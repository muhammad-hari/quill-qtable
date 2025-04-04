import Quill from "quill"
import { getRelativeRect } from '../utils'
import Header from './header'

const Break = Quill.import("blots/break")
const Block = Quill.import("blots/block")
const Container = Quill.import("blots/container")

// Table column attribute keys
const COL_ATTRIBUTES = ["width"]

// Default column width
const COL_DEFAULT = {
  width: 'auto'
}

// Table cell identity keys (e.g., position references)
const CELL_IDENTITY_KEYS = ["row", "cell"]

// Table cell layout attributes
const CELL_ATTRIBUTES = ["rowspan", "colspan"]

// Default values for rowspan and colspan
const CELL_DEFAULT = {
  rowspan: 1,
  colspan: 1
}

const ERROR_LIMIT = 5

/**
 * Represents the content inside a table cell (block-level content inside a cell).
 * Extends Quill's Block blot.
 */
class TableCellLine extends Block {
  /**
   * Creates a DOM node with default or provided cell attributes.
   * Automatically generates row/cell IDs if missing.
   *
   * @param {object} value - Attributes for the table cell line.
   * @returns {HTMLElement} The DOM node representing the cell line.
   */
  static create(value) {
    const node = super.create(value)

    // Auto-generate row and cell identifiers if not provided
    CELL_IDENTITY_KEYS.forEach(key => {
      let identityMaker = key === 'row'
        ? rowId
        : cellId
      node.setAttribute(`data-${key}`, value[key] || identityMaker())
    })

    // Set rowspan and colspan with fallback defaults
    CELL_ATTRIBUTES.forEach(attrName => {
      node.setAttribute(`data-${attrName}`, value[attrName] || CELL_DEFAULT[attrName])
    })

    // Optional background color for cell
    if (value['cell-bg']) {
      node.setAttribute('data-cell-bg', value['cell-bg'])
    }

    return node
  }

  /**
   * Extracts all format attributes from a DOM node.
   *
   * @param {HTMLElement} domNode - DOM element to extract attributes from.
   * @returns {object} Key-value pairs of formats.
   */
  static formats(domNode) {
    return [...CELL_ATTRIBUTES, ...CELL_IDENTITY_KEYS, 'cell-bg'].reduce((formats, attribute) => {
      if (domNode.hasAttribute(`data-${attribute}`)) {
        formats[attribute] = domNode.getAttribute(`data-${attribute}`) || undefined
      }
      return formats
    }, {})
  }

  /**
   * Applies or removes formatting on the cell line.
   *
   * @param {string} name - Format name.
   * @param {*} value - Format value.
   */
  format(name, value) {
    // Handle built-in cell attributes and IDs
    if ([...CELL_ATTRIBUTES, ...CELL_IDENTITY_KEYS].includes(name)) {
      if (value) {
        this.domNode.setAttribute(`data-${name}`, value)
      } else {
        this.domNode.removeAttribute(`data-${name}`)
      }
    }

    // Handle custom cell background color
    else if (name === 'cell-bg') {
      if (value) {
        this.domNode.setAttribute('data-cell-bg', value)
      } else {
        this.domNode.removeAttribute('data-cell-bg')
      }
    }

    // Convert to header format if requested
    else if (name === 'header') {
      if (!value) return
      const { row, cell, rowspan, colspan } = TableCellLine.formats(this.domNode)
      super.format(name, {
        value,
        row,
        cell,
        rowspan,
        colspan
      })
    }

    // Fallback for all other formats
    else {
      super.format(name, value)
    }
  }

  /**
   * Optimizes the blot's structure and ensures correct parent container.
   *
   * @param {object} context - Optimization context from Quill.
   */
  optimize(context) {
    const rowId = this.domNode.getAttribute('data-row')
    const rowspan = this.domNode.getAttribute('data-rowspan')
    const colspan = this.domNode.getAttribute('data-colspan')
    const cellBg = this.domNode.getAttribute('data-cell-bg')

    // Ensure it's inside the correct parent (e.g., TableCell)
    if (
      this.statics.requiredContainer &&
      !(this.parent instanceof this.statics.requiredContainer)
    ) {
      this.wrap(this.statics.requiredContainer.blotName, {
        row: rowId,
        colspan,
        rowspan,
        'cell-bg': cellBg
      })
    }

    super.optimize(context)
  }

  /**
   * Returns the parent container, assumed to be the TableCell blot.
   *
   * @returns {QuillBlot|null} Parent table cell container.
   */
  tableCell() {
    return this.parent
  }
}

TableCellLine.blotName = "table-cell-line"
TableCellLine.className = "qlbt-cell-line"
TableCellLine.tagName = "P"

/**
 * Represents a table cell container in Quill's blot structure.
 * Wraps one or more `TableCellLine` children and holds cell metadata.
 */
class TableCell extends Container {
  /**
   * Check if this cell is mergeable with the next cell (i.e., same identity).
   * Used by Quill to merge blocks during formatting optimizations.
   *
   * @returns {boolean}
   */
  checkMerge() {
    if (super.checkMerge() && this.next?.children?.head) {
      const thisHead = this.children.head.formats()[this.children.head.statics.blotName]
      const thisTail = this.children.tail.formats()[this.children.tail.statics.blotName]
      const nextHead = this.next.children.head.formats()[this.next.children.head.statics.blotName]
      const nextTail = this.next.children.tail.formats()[this.next.children.tail.statics.blotName]
      return (
        thisHead.cell === thisTail.cell &&
        thisHead.cell === nextHead.cell &&
        thisHead.cell === nextTail.cell
      )
    }
    return false
  }

  /**
   * Creates the DOM node for this blot and sets initial attributes.
   *
   * @param {object} value - Attributes to apply (row, rowspan, cell-bg, etc.)
   * @returns {HTMLElement}
   */
  static create(value) {
    const node = super.create(value)
    node.setAttribute("data-row", value.row)

    // Cell span attributes
    CELL_ATTRIBUTES.forEach(attrName => {
      if (value[attrName]) {
        node.setAttribute(attrName, value[attrName])
      }
    })

    // Cell background
    if (value['cell-bg']) {
      node.setAttribute('data-cell-bg', value['cell-bg'])
      node.style.backgroundColor = value['cell-bg']
    }

    // Cell text color
    if (value['cell-color']) {
      node.setAttribute('data-cell-color', value['cell-color'])
      node.style.color = value['cell-color']
    }

    // Label color
    if (value['label-color']) {
      node.setAttribute('data-label-color', value['label-color'])
    }

    return node
  }

  /**
   * Extracts formatting values from the DOM node.
   *
   * @param {HTMLElement} domNode
   * @returns {object}
   */
  static formats(domNode) {
    const formats = {}

    if (domNode.hasAttribute("data-row")) {
      formats["row"] = domNode.getAttribute("data-row")
    }

    if (domNode.hasAttribute("data-cell-bg")) {
      formats["cell-bg"] = domNode.getAttribute("data-cell-bg")
    }

    if (domNode.hasAttribute("data-cell-color")) {
      formats["cell-color"] = domNode.getAttribute("data-cell-color")
    }

    if (domNode.hasAttribute("data-label-color")) {
      formats["label-color"] = domNode.getAttribute("data-label-color")
    }

    // Rowspan / Colspan
    return CELL_ATTRIBUTES.reduce((acc, attr) => {
      if (domNode.hasAttribute(attr)) {
        acc[attr] = domNode.getAttribute(attr)
      }
      return acc
    }, formats)
  }

  /**
   * Returns this cell's position in its parent row.
   *
   * @returns {number}
   */
  cellOffset() {
    return this.parent ? this.parent.children.indexOf(this) : -1
  }

  /**
   * Returns the formats of this blot.
   *
   * @returns {object}
   */
  formats() {
    const formats = {}

    if (this.domNode.hasAttribute("data-row")) {
      formats["row"] = this.domNode.getAttribute("data-row")
    }

    if (this.domNode.hasAttribute("data-cell-bg")) {
      formats["cell-bg"] = this.domNode.getAttribute("data-cell-bg")
    }

    return CELL_ATTRIBUTES.reduce((acc, attr) => {
      if (this.domNode.hasAttribute(attr)) {
        acc[attr] = this.domNode.getAttribute(attr)
      }
      return acc
    }, formats)
  }

  /**
   * Toggle a data attribute on the DOM node.
   *
   * @param {string} name
   * @param {*} value
   */
  toggleAttribute(name, value) {
    if (value) {
      this.domNode.setAttribute(name, value)
    } else {
      this.domNode.removeAttribute(name)
    }
  }

  /**
   * Apply formatting to all child blots (usually TableCellLine).
   *
   * @param {string} name
   * @param {*} value
   */
  formatChildren(name, value) {
    this.children.forEach(child => {
      child.format(name, value)
    })
  }

  /**
   * Applies a format to this cell and its children.
   *
   * @param {string} name
   * @param {*} value
   */
  format(name, value) {
    if (CELL_ATTRIBUTES.includes(name)) {
      this.toggleAttribute(name, value)
      this.formatChildren(name, value)
    } else if (name === "row") {
      this.toggleAttribute(`data-${name}`, value)
      this.formatChildren(name, value)
    } else if (name === "cell-bg") {
      this.toggleAttribute('data-cell-bg', value)
      this.formatChildren(name, value)
      this.domNode.style.backgroundColor = value || 'initial'
    } else if (name === "cell-color") {
      this.toggleAttribute('data-cell-color', value)
      this.formatChildren(name, value)
      this.domNode.style.color = value || 'initial'
    } else if (name === "label-color") {
      this.toggleAttribute('data-label-color', value)
      this.formatChildren(name, value)

      const paragraph = this.domNode.querySelector("p")
      if (paragraph) {
        paragraph.style.backgroundColor = value || 'initial'
        paragraph.classList.toggle("qlbt-tag-label", !!value)
      }
    } else {
      super.format(name, value)
    }
  }

  /**
   * Ensures the cell is within a valid parent container.
   *
   * @param {object} context
   */
  optimize(context) {
    const rowId = this.domNode.getAttribute("data-row")
    if (
      this.statics.requiredContainer &&
      !(this.parent instanceof this.statics.requiredContainer)
    ) {
      this.wrap(this.statics.requiredContainer.blotName, {
        row: rowId
      })
    }
    super.optimize(context)
  }

  /**
   * Returns the parent row blot.
   *
   * @returns {QuillBlot|null}
   */
  row() {
    return this.parent
  }

  /**
   * Returns the row index in the table.
   *
   * @returns {number}
   */
  rowOffset() {
    return this.row() ? this.row().rowOffset() : -1
  }

  /**
   * Returns the table that this cell belongs to.
   *
   * @returns {QuillBlot|null}
   */
  table() {
    return this.row() && this.row().table()
  }
}

// Blot registration info
TableCell.blotName = "table"
TableCell.tagName = "TD"

class TableRow extends Container {
  checkMerge() {
    if (super.checkMerge() && this.next.children.head != null) {
      const thisHead = this.children.head.formats()
      const thisTail = this.children.tail.formats()
      const nextHead = this.next.children.head.formats()
      const nextTail = this.next.children.tail.formats()

      return (
        thisHead.row === thisTail.row &&
        thisHead.row === nextHead.row &&
        thisHead.row === nextTail.row
      )
    }
    return false
  }

  static create(value) {
    const node = super.create(value)
    node.setAttribute("data-row", value.row)
    return node
  }

  formats() {
    return ["row"].reduce((formats, attrName) => {
      if (this.domNode.hasAttribute(`data-${attrName}`)) {
        formats[attrName] = this.domNode.getAttribute(`data-${attrName}`)
      }
      return formats
    }, {})
  }

  optimize (context) {
    // optimize function of ShadowBlot
    if (
      this.statics.requiredContainer &&
      !(this.parent instanceof this.statics.requiredContainer)
    ) {
      this.wrap(this.statics.requiredContainer.blotName)
    }

    // optimize function of ParentBlot
    // note: modified this optimize function because
    // TableRow should not be removed when the length of its children was 0
    this.enforceAllowedChildren()
    if (this.uiNode != null && this.uiNode !== this.domNode.firstChild) {
      this.domNode.insertBefore(this.uiNode, this.domNode.firstChild)
    }

    // optimize function of ContainerBlot
    if (this.children.length > 0 && this.next != null && this.checkMerge()) {
      this.next.moveChildren(this)
      this.next.remove()
    }
  }

  rowOffset() {
    if (this.parent) {
      return this.parent.children.indexOf(this)
    }
    return -1
  }

  table() {
    return this.parent && this.parent.parent
  }
}
TableRow.blotName = "table-row"
TableRow.tagName = "TR"

class TableBody extends Container {}
TableBody.blotName = "table-body"
TableBody.tagName = "TBODY"

class TableCol extends Block {
  static create (value) {
    let node = super.create(value)
    COL_ATTRIBUTES.forEach(attrName => {
      node.setAttribute(`${attrName}`, value[attrName] || COL_DEFAULT[attrName])
    })
    return node
  }

  static formats(domNode) {
    return COL_ATTRIBUTES.reduce((formats, attribute) => {
      if (domNode.hasAttribute(`${attribute}`)) {
        formats[attribute] =
          domNode.getAttribute(`${attribute}`) || undefined
      }
      return formats
    }, {})
  }

  format(name, value) {
    if (COL_ATTRIBUTES.indexOf(name) > -1) {
      this.domNode.setAttribute(`${name}`, value || COL_DEFAULT[name])
    } else {
      super.format(name, value)
    }
  }

  html () {
    return this.domNode.outerHTML
  }
}
TableCol.blotName = "table-col"
TableCol.tagName = "col"

class TableColGroup extends Container {}
TableColGroup.blotName = "table-col-group"
TableColGroup.tagName = "colgroup"

class TableContainer extends Container {
  static create() {
    let node = super.create()
    return node
  }

  constructor (scroll, domNode) {
    super(scroll, domNode)
    this.updateTableWidth()
  }

  updateTableWidth () {
    setTimeout(() => {
      const colGroup = this.colGroup()
      if (!colGroup) return
      const tableWidth = colGroup.children.reduce((sumWidth, col) => {
        sumWidth = sumWidth + parseInt(col.formats()[TableCol.blotName].width, 10)
        return sumWidth
      }, 0)
      this.domNode.style.width = `${tableWidth}px`
    }, 0)
  }

  cells(column) {
    return this.rows().map(row => row.children.at(column))
  }

  colGroup () {
    return this.children.head
  }

  deleteColumns(compareRect, delIndexes = [], editorWrapper) {
    const [body] = this.descendants(TableBody)
    if (body == null || body.children.head == null) return

    const tableCells = this.descendants(TableCell)
    const removedCells = []
    const modifiedCells = []

    tableCells.forEach(cell => {
      const cellRect = getRelativeRect(
        cell.domNode.getBoundingClientRect(),
        editorWrapper
      )

      if (
        cellRect.x + ERROR_LIMIT > compareRect.x &&
        cellRect.x1 - ERROR_LIMIT < compareRect.x1
      ) {
        removedCells.push(cell)
      } else if (
        cellRect.x < compareRect.x + ERROR_LIMIT &&
        cellRect.x1 > compareRect.x1 - ERROR_LIMIT
      ) {
        modifiedCells.push(cell)
      }
    })

    if (removedCells.length === tableCells.length) {
      this.tableDestroy()
      return true
    }

    // remove the matches column tool cell
    delIndexes.forEach((delIndex) => {
      this.colGroup().children.at(delIndexes[0]).remove()
    })

    removedCells.forEach(cell => {
      cell.remove()
    })

    modifiedCells.forEach(cell => {
      const cellColspan = parseInt(cell.formats().colspan, 10)
      const cellWidth = parseInt(cell.formats().width, 10)
      cell.format('colspan', cellColspan - delIndexes.length)
    })

    this.updateTableWidth()
  }

  deleteRow(compareRect, editorWrapper) {
    const [body] = this.descendants(TableBody)
    if (body == null || body.children.head == null) return

    const tableCells = this.descendants(TableCell)
    const tableRows = this.descendants(TableRow)
    const removedCells = []  // cells to be removed
    const modifiedCells = [] // cells to be modified
    const fallCells = []     // cells to fall into next row

    // compute rows to remove
    // bugfix: #21 There will be a empty tr left if delete the last row of a table
    const removedRows = tableRows.filter(row => {
      const rowRect = getRelativeRect(
        row.domNode.getBoundingClientRect(),
        editorWrapper
      )
      
      return rowRect.y > compareRect.y - ERROR_LIMIT &&
        rowRect.y1 < compareRect.y1 + ERROR_LIMIT
    })

    tableCells.forEach(cell => {
      const cellRect = getRelativeRect(
        cell.domNode.getBoundingClientRect(),
        editorWrapper
      )

      if (
        cellRect.y > compareRect.y - ERROR_LIMIT &&
        cellRect.y1 < compareRect.y1 + ERROR_LIMIT
      ) {
        removedCells.push(cell)
      } else if (
        cellRect.y < compareRect.y + ERROR_LIMIT &&
        cellRect.y1 > compareRect.y1 - ERROR_LIMIT
      ) {
        modifiedCells.push(cell)

        if (Math.abs(cellRect.y - compareRect.y) < ERROR_LIMIT) {
          fallCells.push(cell)
        }
      }
    })

    if (removedCells.length === tableCells.length) {
      this.tableDestroy()
      return
    }

    // compute length of removed rows
    const removedRowsLength = this.rows().reduce((sum, row) => {
      let rowRect  = getRelativeRect(
        row.domNode.getBoundingClientRect(),
        editorWrapper
      )

      if (
        rowRect.y > compareRect.y - ERROR_LIMIT &&
        rowRect.y1 < compareRect.y1 + ERROR_LIMIT
      ) {
        sum += 1
      }
      return sum
    }, 0)

    // it must excute before the table layout changed with other operation
    fallCells.forEach(cell => {
      const cellRect = getRelativeRect(
        cell.domNode.getBoundingClientRect(),
        editorWrapper
      )
      const nextRow = cell.parent.next
      const cellsInNextRow = nextRow.children

      const refCell = cellsInNextRow.reduce((ref, compareCell) => {
        const compareRect = getRelativeRect(
          compareCell.domNode.getBoundingClientRect(),
          editorWrapper
        )
        if (Math.abs(cellRect.x1 - compareRect.x) < ERROR_LIMIT) {
          ref = compareCell
        }
        return ref
      }, null)

      nextRow.insertBefore(cell, refCell)
      cell.format('row', nextRow.formats().row)
    })

    removedCells.forEach(cell => {
      cell.remove()
    })

    modifiedCells.forEach(cell => {
      const cellRowspan = parseInt(cell.formats().rowspan, 10)
      cell.format("rowspan", cellRowspan - removedRowsLength)
    })

    // remove selected rows
    removedRows.forEach(row => row.remove())
  }

  tableDestroy() {
    const quill = Quill.find(this.scroll.domNode.parentNode)
    const tableModule = quill.getModule("qtable")
    this.remove()
    tableModule.hideTableTools()
    quill.update(Quill.sources.USER)
  }

  insertCell(tableRow, ref) {
    const id = cellId()
    const rId = tableRow.formats().row
    const tableCell = this.scroll.create(
      TableCell.blotName,
      Object.assign({}, CELL_DEFAULT, {
        row: rId
      })
    )
    const cellLine = this.scroll.create(TableCellLine.blotName, {
      row: rId,
      cell: id
    })
    tableCell.appendChild(cellLine)

    if (ref) {
      tableRow.insertBefore(tableCell, ref)
    } else {
      tableRow.appendChild(tableCell)
    }
  }

  insertColumn(compareRect, colIndex, isRight = true, editorWrapper) {
    const [body] = this.descendants(TableBody)
    const [tableColGroup] = this.descendants(TableColGroup)
    const tableCols = this.descendants(TableCol)
    let addAsideCells = []
    let modifiedCells = []
    let affectedCells = []

    if (body == null || body.children.head == null) return
    const tableCells = this.descendants(TableCell)
    tableCells.forEach(cell => {
      const cellRect = getRelativeRect(
        cell.domNode.getBoundingClientRect(),
        editorWrapper
      )

      if (isRight) {
        if (Math.abs(cellRect.x1 - compareRect.x1) < ERROR_LIMIT) {
          // the right of selected boundary equal to the right of table cell,
          // add a new table cell right aside this table cell
          addAsideCells.push(cell)
        } else if (
          compareRect.x1 - cellRect.x > ERROR_LIMIT &&
          compareRect.x1 - cellRect.x1 < -ERROR_LIMIT
        ) {
          // the right of selected boundary is inside this table cell
          // colspan of this table cell will increase 1
          modifiedCells.push(cell)
        }
      } else {
        if (Math.abs(cellRect.x - compareRect.x) < ERROR_LIMIT) {
          // left of selected boundary equal to left of table cell,
          // add a new table cell left aside this table cell
          addAsideCells.push(cell)
        } else if (
          compareRect.x - cellRect.x > ERROR_LIMIT &&
          compareRect.x - cellRect.x1 < -ERROR_LIMIT
        ) {
          // the left of selected boundary is inside this table cell
          // colspan of this table cell will increase 1
          modifiedCells.push(cell)
        }
      }
    })

    addAsideCells.forEach(cell => {
      const ref = isRight ? cell.next : cell
      const id = cellId()
      const tableRow = cell.parent
      const rId = tableRow.formats().row
      const cellFormats = cell.formats()
      const tableCell = this.scroll.create(
        TableCell.blotName,
        Object.assign({}, CELL_DEFAULT, {
          row: rId,
          rowspan: cellFormats.rowspan
        })
      )
      const cellLine = this.scroll.create(TableCellLine.blotName, {
        row: rId,
        cell: id,
        rowspan: cellFormats.rowspan
      })
      tableCell.appendChild(cellLine)

      if (ref) {
        tableRow.insertBefore(tableCell, ref)
      } else {
        tableRow.appendChild(tableCell)
      }
      affectedCells.push(tableCell)
    })

    // insert new tableCol
    const tableCol = this.scroll.create(TableCol.blotName, true)
    let colRef = isRight ? tableCols[colIndex].next : tableCols[colIndex]
    if (colRef) {
      tableColGroup.insertBefore(tableCol, colRef)
    } else {
      tableColGroup.appendChild(tableCol)
    }

    modifiedCells.forEach(cell => {
      const cellColspan = cell.formats().colspan
      cell.format('colspan', parseInt(cellColspan, 10) + 1)
      affectedCells.push(cell)
    })

    affectedCells.sort((cellA, cellB) => {
      let y1 = cellA.domNode.getBoundingClientRect().y
      let y2 = cellB.domNode.getBoundingClientRect().y
      return y1 - y2
    })

    this.updateTableWidth()
    return affectedCells
  }

  insertRow(compareRect, isDown, editorWrapper) {
    const [body] = this.descendants(TableBody)
    if (body == null || body.children.head == null) return

    const tableCells = this.descendants(TableCell)
    const rId = rowId()
    const newRow = this.scroll.create(TableRow.blotName, {
      row: rId
    })
    let addBelowCells = []
    let modifiedCells = []
    let affectedCells = []

    tableCells.forEach(cell => {
      const cellRect = getRelativeRect(
        cell.domNode.getBoundingClientRect(),
        editorWrapper
      )

      if (isDown) {
        if (Math.abs(cellRect.y1 - compareRect.y1) < ERROR_LIMIT) {
          addBelowCells.push(cell)
        } else if (
          compareRect.y1 - cellRect.y > ERROR_LIMIT &&
          compareRect.y1 - cellRect.y1 < -ERROR_LIMIT
        ) {
          modifiedCells.push(cell)
        }
      } else {
        if (Math.abs(cellRect.y - compareRect.y) < ERROR_LIMIT) {
          addBelowCells.push(cell)
        } else if (
          compareRect.y - cellRect.y > ERROR_LIMIT &&
          compareRect.y - cellRect.y1 < -ERROR_LIMIT
        ) {
          modifiedCells.push(cell)
        }
      }
    })

    // ordered table cells with rect.x, fix error for inserting
    // new table cell in complicated table with wrong order.
    const sortFunc = (cellA, cellB) => {
      let x1 = cellA.domNode.getBoundingClientRect().x
      let x2 = cellB.domNode.getBoundingClientRect().x
      return x1 - x2
    }
    addBelowCells.sort(sortFunc)

    addBelowCells.forEach(cell => {
      const cId = cellId()
      const cellFormats = cell.formats()

      const tableCell = this.scroll.create(TableCell.blotName, Object.assign(
        {}, CELL_DEFAULT, { row: rId, colspan: cellFormats.colspan }
      ))
      const cellLine = this.scroll.create(TableCellLine.blotName, {
        row: rId,
        cell: cId,
        colspan: cellFormats.colspan
      })
      const empty = this.scroll.create(Break.blotName)
      cellLine.appendChild(empty)
      tableCell.appendChild(cellLine)
      newRow.appendChild(tableCell)
      affectedCells.push(tableCell)
    })

    modifiedCells.forEach(cell => {
      const cellRowspan = parseInt(cell.formats().rowspan, 10)
      cell.format("rowspan", cellRowspan + 1)
      affectedCells.push(cell)
    })

    const refRow = this.rows().find(row => {
      let rowRect = getRelativeRect(
        row.domNode.getBoundingClientRect(),
        editorWrapper
      )
      if (isDown) {
        return Math.abs(rowRect.y - compareRect.y - compareRect.height) < ERROR_LIMIT
      } else {
        return Math.abs(rowRect.y - compareRect.y) < ERROR_LIMIT
      }
    })
    body.insertBefore(newRow, refRow)

    // reordering affectedCells
    affectedCells.sort(sortFunc)
    return affectedCells
  }

  mergeCells (compareRect, mergingCells, rowspan, colspan, editorWrapper) {
    const mergedCell = mergingCells.reduce((result, tableCell, index) => {
      if (index !== 0) {
        result && tableCell.moveChildren(result)
        tableCell.remove()
      } else {
        tableCell.format('colspan', colspan)
        tableCell.format('rowspan', rowspan)
        result = tableCell
      }

      return result
    }, null)

    let rowId = mergedCell.domNode.getAttribute('data-row')
    let cellId = mergedCell.children.head.domNode.getAttribute('data-cell')
    mergedCell.children.forEach(cellLine => {
      cellLine.format('cell', cellId)
      cellLine.format('row', rowId)
      cellLine.format('colspan', colspan)
      cellLine.format('rowspan', rowspan)
    })

    return mergedCell
  }

  unmergeCells (unmergingCells, editorWrapper) {
    let cellFormats = {}
    let cellRowspan = 1
    let cellColspan = 1

    unmergingCells.forEach(tableCell => {
      cellFormats = tableCell.formats()
      cellRowspan = cellFormats.rowspan
      cellColspan = cellFormats.colspan

      if (cellColspan > 1) {
        let ref = tableCell.next
        let row = tableCell.row()
        tableCell.format('colspan', 1)
        for (let i = cellColspan; i > 1; i--) {
          this.insertCell(row, ref)
        }
      }

      if (cellRowspan > 1) {
        let i = cellRowspan
        let nextRow = tableCell.row().next
        while (i > 1) {
          let refInNextRow = nextRow.children
            .reduce((result, cell) => {
              let compareRect = getRelativeRect(
                tableCell.domNode.getBoundingClientRect(),
                editorWrapper
              )
              let cellRect = getRelativeRect(
                cell.domNode.getBoundingClientRect(),
                editorWrapper
              )
              if (Math.abs(compareRect.x1 - cellRect.x) < ERROR_LIMIT) {
                result = cell
              }
              return result
            }, null)

          for (let i = cellColspan; i > 0; i--) {
            this.insertCell(nextRow, refInNextRow)
          }

          i -= 1
          nextRow = nextRow.next
        }

        tableCell.format('rowspan', 1)
      }
    })
  }

  rows() {
    const body = this.children.tail
    if (body == null) return []
    return body.children.map(row => row)
  }
}
TableContainer.blotName = "table-container"
TableContainer.className = "quill-qtable"
TableContainer.tagName = "TABLE"

class TableViewWrapper extends Container {
  constructor (scroll, domNode) {
    super(scroll, domNode)
    const quill = Quill.find(scroll.domNode.parentNode)
    domNode.addEventListener('scroll', (e) => {
      const tableModule = quill.getModule('qtable')
      if (tableModule.columnTool) {
        tableModule.columnTool.domNode.scrollLeft = e.target.scrollLeft
      }

      if (tableModule.tableSelection &&
        tableModule.tableSelection.selectedTds.length > 0) {
        tableModule.tableSelection.repositionHelpLines()
      }
    }, false)
  }

  table () {
    return this.children.head
  }
}
TableViewWrapper.blotName = "table-view"
TableViewWrapper.className = "quill-qtable-wrapper"
TableViewWrapper.tagName = "DIV"

TableViewWrapper.allowedChildren = [TableContainer]
TableContainer.requiredContainer = TableViewWrapper

TableContainer.allowedChildren = [TableBody, TableColGroup]
TableBody.requiredContainer = TableContainer

TableBody.allowedChildren = [TableRow]
TableRow.requiredContainer = TableBody

TableRow.allowedChildren = [TableCell]
TableCell.requiredContainer = TableRow

TableCell.allowedChildren = [TableCellLine, Header]
TableCellLine.requiredContainer = TableCell

TableColGroup.allowedChildren = [TableCol]
TableColGroup.requiredContainer = TableContainer

TableCol.requiredContainer = TableColGroup


function rowId() {
  const id = Math.random()
    .toString(36)
    .slice(2, 6)
  return `row-${id}`
}

function cellId() {
  const id = Math.random()
    .toString(36)
    .slice(2, 6)
  return `cell-${id}`
}

export {
  // blots
  TableCol,
  TableColGroup,
  TableCellLine,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  TableViewWrapper,

  // identity getters
  rowId,
  cellId,

  // attributes
  CELL_IDENTITY_KEYS,
  CELL_ATTRIBUTES
}

