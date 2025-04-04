import Quill from 'quill'
import { css } from '../utils'

const COL_TOOL_HEIGHT = 12
const COL_TOOL_CELL_HEIGHT = 12
const ROW_TOOL_WIDTH = 12
const CELL_MIN_WIDTH = 50
const PRIMARY_COLOR = '#35A7ED'

/**
 * TableColumnTool is a utility class for managing column-level controls
 * in a Quill editor table. It provides functionality such as column resizing
 * using draggable handles above the table.
 *
 * @class
 * @param {HTMLTableElement} table - The table DOM element to attach the tool to.
 * @param {Quill} quill - The Quill editor instance.
 * @param {Object} options - Additional configuration options.
 */
export default class TableColumnTool {
  constructor (table, quill, options) {
    if (!table) return null
    this.table = table
    this.quill = quill
    this.options = options
    this.domNode = null

    this.initColTool()
  }

  /**
   * Initializes the column tool overlay element above the table,
   * calculates positioning, and appends it to the editor container.
   */
  initColTool () {
    const parent = this.quill.root.parentNode
    const tableRect = this.table.getBoundingClientRect()
    const containerRect = parent.getBoundingClientRect()
    const tableViewRect = this.table.parentNode.getBoundingClientRect()

    this.domNode = document.createElement('div')
    this.domNode.classList.add('qlbt-col-tool')
    this.updateToolCells()
    parent.appendChild(this.domNode)
    css(this.domNode, {
      width: `${tableViewRect.width}px`,
      height: `${COL_TOOL_HEIGHT}px`,
      left: `${tableViewRect.left - containerRect.left + parent.scrollLeft}px`,
      top: `${tableViewRect.top - containerRect.top + parent.scrollTop - COL_TOOL_HEIGHT - 5}px`
    })
  }

 /**
  * Creates a single column tool cell, including the resizable handle (holder).
  *
  * @returns {HTMLElement} The DOM element representing a column tool cell.
  */  
  createToolCell () {
    const toolCell = document.createElement('div')
    toolCell.classList.add('qlbt-col-tool-cell')
    const resizeHolder = document.createElement('div')
    resizeHolder.classList.add('qlbt-col-tool-cell-holder')
    css(toolCell, {
      'height': `${COL_TOOL_CELL_HEIGHT}px`,
    })
    toolCell.appendChild(resizeHolder)
    return toolCell
  }

 /**
  * Updates the column tool cells to match the current table structure.
  * It ensures that each visible column has a resizable handle,
  * and it adjusts each cell’s minimum width.
  */
  updateToolCells () {
    const tableContainer = Quill.find(this.table)
    if (!tableContainer) {
      console.warn('[updateToolCells] Failed to find Quill blot for table.')
      return;
    }

    const CellsInFirstRow = tableContainer.children.tail.children.head.children
    const tableCols = tableContainer.colGroup().children
    const cellsNumber = computeCellsNumber(CellsInFirstRow)
    let existCells = Array.from(this.domNode.querySelectorAll('.qlbt-col-tool-cell'))

    for (let index = 0; index < Math.max(cellsNumber, existCells.length); index++) {
      let col = tableCols.at(index)
      let width = col?.formats()?.[col?.statics?.blotName]?.width
      let colWidth = parseInt(width, 10)
      if (isNaN(colWidth)) 
        colWidth = CELL_MIN_WIDTH;
  
      // if cell already exist
      let toolCell = null
      if (!existCells[index]) {
        toolCell = this.createToolCell()
        this.domNode.appendChild(toolCell)
        this.addColCellHolderHandler(toolCell)
        // set tool cell min-width
        css(toolCell, {
          'min-width': `${colWidth}px`
        })
      } else if (existCells[index] && index >= cellsNumber) {
        existCells[index].remove()
      } else {
        toolCell = existCells[index]
        // set tool cell min-width
        css(toolCell, {
          'min-width': `${colWidth}px`
        })
      }
    }
  }

 /**
  * Removes the column tool overlay from the DOM.
  *
  * @returns {null}
  */
  destroy () {
    if (this.domNode?.parentNode) {
      this.domNode.remove();
    }
    return null
  }

 /**
  * Binds the necessary mouse event handlers to enable column resizing
  * via the tool cell's holder. It also handles visual feedback during drag.
  *
  * @param {HTMLElement} cell - The column tool cell element to attach events to.
  */
  addColCellHolderHandler(cell) {
    const tableContainer = Quill.find(this.table)
    if (!tableContainer) {
      console.warn('[addColCellHolderHandler] Failed to find Quill blot for table.')
      return;
    }

    const $holder = cell.querySelector(".qlbt-col-tool-cell-holder")
    let dragging = false
    let x0 = 0
    let x = 0
    let delta = 0
    let width0 = 0
    // helpLine relation varrible
    let tableRect = {}
    let cellRect = {}
    let $helpLine = null

    const handleDrag = e => {
      e.preventDefault()

      if (dragging) {
        x = e.clientX

        if (width0 + x - x0 >= CELL_MIN_WIDTH) {
          delta = x - x0
        } else {
          delta = CELL_MIN_WIDTH - width0
        }

        css($helpLine, {
          'left': `${cellRect.left + cellRect.width - 1 + delta}px`
        })
      }
    }
    const handleMouseup = e => {
      e.preventDefault()
    
      if (!this.domNode || !tableContainer || !cell) {
        console.warn('[ColTool] handleMouseup: Required DOM references missing.')
        return
      }
    
      const existCells = Array.from(this.domNode.querySelectorAll('.qlbt-col-tool-cell'))
      const colIndex = existCells.indexOf(cell)
      const colBlot = tableContainer.colGroup().children.at(colIndex)
    
      if (dragging) {
        const newWidth = width0 + delta
        if (colBlot) {
          colBlot.format('width', newWidth)
        } else {
          console.warn(`[ColTool] handleMouseup: colBlot not found for index ${colIndex}`)
        }
    
        css(cell, { 'min-width': `${newWidth}px` })
    
        x0 = 0
        x = 0
        delta = 0
        width0 = 0
        dragging = false
        $holder?.classList.remove('dragging')
      }
    
      document.removeEventListener('mousemove', handleDrag, false)
      document.removeEventListener('mouseup', handleMouseup, false)
    
      tableRect = {}
      cellRect = {}
    
      if ($helpLine && $helpLine.parentNode) {
        $helpLine.remove()
      }
      $helpLine = null
    
      try {
        tableContainer.updateTableWidth()
      } catch (err) {
        console.error('[ColTool] Error updating table width:', err)
      }
    
      try {
        const tableSelection = this.quill?.getModule('qtable')?.tableSelection
        tableSelection?.clearSelection()
      } catch (err) {
        console.warn('[ColTool] Error clearing selection:', err)
      }
    }
    
    const handleMousedown = e => {
      if (!cell || !this.table || !this.quill) {
        console.warn('[ColTool] handleMousedown: Required references not available.')
        return
      }
    
      document.addEventListener('mousemove', handleDrag, false)
      document.addEventListener('mouseup', handleMouseup, false)
    
      tableRect = this.table.getBoundingClientRect()
      cellRect = cell.getBoundingClientRect()
    
      $helpLine = document.createElement('div')
      css($helpLine, {
        position: 'fixed',
        top: `${cellRect.top}px`,
        left: `${cellRect.left + cellRect.width - 1}px`,
        zIndex: '100',
        height: `${tableRect.height + COL_TOOL_HEIGHT + 4}px`,
        width: '1px',
        backgroundColor: PRIMARY_COLOR
      })
    
      document.body.appendChild($helpLine)
    
      dragging = true
      x0 = e.clientX
      width0 = cellRect.width
      $holder?.classList.add('dragging')
    }
    
    $holder.addEventListener('mousedown', handleMousedown, false)
  }

  /**
   * Returns all existing column tool cell elements.
   *
   * @returns {HTMLElement[]} An array of column tool cell DOM nodes.
   */
  colToolCells () {
    return Array.from(this.domNode.querySelectorAll('.qlbt-col-tool-cell'))
  }
}

/**
 * Computes the total number of columns in the first row by summing up colspans.
 *
 * @param {Array} CellsInFirstRow - An array of Quill table cell blots in the first row.
 * @returns {number} Total number of columns, considering colspan.
 */
function computeCellsNumber (CellsInFirstRow) {
  return CellsInFirstRow.reduce((sum, cell) => {
    const cellColspan = cell.formats().colspan
    sum = sum + parseInt(cellColspan, 10)
    return sum
  }, 0)
}
