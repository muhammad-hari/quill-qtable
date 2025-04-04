import Quill from 'quill'
import { css, getRelativeRect } from '../utils'

// svg icons
import operationIcon1 from '../assets/icons/table-insert-column-after.svg'
import operationIcon2 from '../assets/icons/table-insert-column-before.svg'
import operationIcon3 from '../assets/icons/table-insert-row-after.svg'
import operationIcon4 from '../assets/icons/table-insert-row-above.svg'
import operationIcon5 from '../assets/icons/table-merge-cells.svg'
import operationIcon6 from '../assets/icons/table-split-cells.svg'
import operationIcon7 from '../assets/icons/table-delete-column.svg'
import operationIcon8 from '../assets/icons/table-delete-row.svg'
import operationIcon9 from '../assets/icons/table-delete-table.svg'

const MENU_MIN_HEIGHT = 150
const MENU_WIDTH = 200
const ERROR_LIMIT = 5

const DEFAULT_CELL_COLORS = ['#FFFFFF', '#08090A', '#EBEBEB', '#00695f', '#ff1744','#FFEB3B', '#ff5722'];
const DEFAULT_COLOR_SUBTITLE = 'Background Colors'

const DEFAULT_TEXT_COLORS = ['#FFFFFF', '#08090A', '#EBEBEB', '#00695f', '#ff1744','#FFEB3B', '#ff5722'];
const DEFAULT_TEXT_COLOR_SUBTITLE = 'Text Colors';

const DEFAULT_LABEL_TEXT_COLORS =['#FFFFFF', '#08090A', '#EBEBEB', '#00695f', '#ff1744','#FFEB3B', '#ff5722'];
const DEFAULT_LABEL_TEXT_COLOR_SUBTITLE = 'Label Text Colors';

const MENU_ITEMS_DEFAULT = {
  insertColumnRight: {
    text: 'Insert column right',
    iconSrc: operationIcon1,
    handler () {
      const tableContainer = Quill.find(this.table)
      let colIndex = getColToolCellIndexByBoundary(
        this.columnToolCells,
        this.boundary,
        (cellRect, boundary) => {
          return Math.abs(cellRect.x + cellRect.width - boundary.x1) <= ERROR_LIMIT
        },
        this.quill.root.parentNode
      )

      const newColumn = tableContainer.insertColumn(
        this.boundary,
        colIndex,
        true,
        this.quill.root.parentNode)

      this.tableColumnTool.updateToolCells()
      this.quill.update(Quill.sources.USER)
      this.quill.setSelection(
        this.quill.getIndex(newColumn[0]),
        0,
        Quill.sources.SILENT
      )
      this.tableSelection.setSelection(
        newColumn[0].domNode.getBoundingClientRect(),
        newColumn[0].domNode.getBoundingClientRect()
      )
    }
  },

  insertColumnLeft: {
    text: 'Insert column left',
    iconSrc: operationIcon2,
    handler () {
      const tableContainer = Quill.find(this.table)
      let colIndex = getColToolCellIndexByBoundary(
        this.columnToolCells,
        this.boundary,
        (cellRect, boundary) => {
          return Math.abs(cellRect.x - boundary.x) <= ERROR_LIMIT
        },
        this.quill.root.parentNode
      )

      const newColumn = tableContainer.insertColumn(
        this.boundary,
        colIndex,
        false,
        this.quill.root.parentNode)

      this.tableColumnTool.updateToolCells()
      this.quill.update(Quill.sources.USER)
      this.quill.setSelection(
        this.quill.getIndex(newColumn[0]),
        0,
        Quill.sources.SILENT
      )
      this.tableSelection.setSelection(
        newColumn[0].domNode.getBoundingClientRect(),
        newColumn[0].domNode.getBoundingClientRect()
      )
    }
  },

  insertRowUp: {
    text: 'Insert row up',
    iconSrc: operationIcon3,
    handler () {
      const tableContainer = Quill.find(this.table)
      const affectedCells = tableContainer.insertRow(
        this.boundary,
        false,
        this.quill.root.parentNode
      )
      this.quill.update(Quill.sources.USER)
      this.quill.setSelection(
        this.quill.getIndex(affectedCells[0]),
        0,
        Quill.sources.SILENT
      )
      this.tableSelection.setSelection(
        affectedCells[0].domNode.getBoundingClientRect(),
        affectedCells[0].domNode.getBoundingClientRect()
      )
    }
  },

  insertRowDown: {
    text: 'Insert row down',
    iconSrc: operationIcon4,
    handler () {
      const tableContainer = Quill.find(this.table)
      const affectedCells = tableContainer.insertRow(
        this.boundary,
        true,
        this.quill.root.parentNode
      )
      this.quill.update(Quill.sources.USER)
      this.quill.setSelection(
        this.quill.getIndex(affectedCells[0]),
        0,
        Quill.sources.SILENT
      )
      this.tableSelection.setSelection(
        affectedCells[0].domNode.getBoundingClientRect(),
        affectedCells[0].domNode.getBoundingClientRect()
      )
    }
  },

  mergeCells: {
    text: 'Merge selected cells',
    iconSrc: operationIcon5,
    handler () {
      const tableContainer = Quill.find(this.table)
      // compute merged Cell rowspan, equal to length of selected rows
      const rowspan = tableContainer.rows().reduce((sum, row) => {
        let rowRect  = getRelativeRect(
          row.domNode.getBoundingClientRect(),
          this.quill.root.parentNode
        )
        if (
          rowRect.y > this.boundary.y - ERROR_LIMIT &&
          rowRect.y + rowRect.height < this.boundary.y + this.boundary.height + ERROR_LIMIT
        ) {
          sum += 1
        }
        return sum
      }, 0)

      // compute merged cell colspan, equal to length of selected cols
      const colspan = this.columnToolCells.reduce((sum, cell) => {
        let cellRect = getRelativeRect(
          cell.getBoundingClientRect(),
          this.quill.root.parentNode
        )
        if (
          cellRect.x > this.boundary.x - ERROR_LIMIT &&
          cellRect.x + cellRect.width < this.boundary.x + this.boundary.width + ERROR_LIMIT
        ) {
          sum += 1
        }
        return sum
      }, 0)

      const mergedCell = tableContainer.mergeCells(
        this.boundary,
        this.selectedTds,
        rowspan,
        colspan,
        this.quill.root.parentNode
      )
      this.quill.update(Quill.sources.USER)
      this.tableSelection.setSelection(
        mergedCell.domNode.getBoundingClientRect(),
        mergedCell.domNode.getBoundingClientRect()
      )
    }
  },

  unmergeCells: {
    text: 'Unmerge cells',
    iconSrc: operationIcon6,
    handler () {
      const tableContainer = Quill.find(this.table)
      tableContainer.unmergeCells(
        this.selectedTds,
        this.quill.root.parentNode
      )
      this.quill.update(Quill.sources.USER)
      this.tableSelection.clearSelection()
    }
  },

  deleteColumn: {
    text: 'Delete selected columns',
    iconSrc: operationIcon7,
    handler () {
      const tableContainer = Quill.find(this.table)
      let colIndexes = getColToolCellIndexesByBoundary(
        this.columnToolCells,
        this.boundary,
        (cellRect, boundary) => {
          return cellRect.x + ERROR_LIMIT > boundary.x &&
            cellRect.x + cellRect.width - ERROR_LIMIT < boundary.x1
        },
        this.quill.root.parentNode
      )

      let isDeleteTable = tableContainer.deleteColumns(
        this.boundary,
        colIndexes,
        this.quill.root.parentNode
      )
      if (!isDeleteTable) {
        this.tableColumnTool.updateToolCells()
        this.quill.update(Quill.sources.USER)
        this.tableSelection.clearSelection()
      }
    }
  },

  deleteRow: {
    text: 'Delete selected rows',
    iconSrc: operationIcon8,
    handler () {
      const tableContainer = Quill.find(this.table)
      tableContainer.deleteRow(
        this.boundary,
        this.quill.root.parentNode
      )
      this.quill.update(Quill.sources.USER)
      this.tableSelection.clearSelection()
    }
  },

  deleteTable: {
    text: 'Delete table',
    iconSrc: operationIcon9,
    handler () {
      const quillQTableModule = this.quill.getModule('qtable')
      const tableContainer = Quill.find(this.table)
      quillQTableModule.hideTableTools()
      tableContainer.remove()
      this.quill.update(Quill.sources.USER)
    }
  }
}

/**
 * TableOperationMenu handles the creation and rendering of a contextual operation menu
 * for tables in the Quill editor. It provides functionality such as inserting/removing rows
 * and columns, merging/unmerging cells, deleting tables, and applying colors to table cells.
 *
 * @class
 * @param {Object} params - Initialization parameters.
 * @param {HTMLElement} params.table - The table element associated with the menu.
 * @param {number} params.left - The left offset (in pixels) where the menu will be displayed.
 * @param {number} params.top - The top offset (in pixels) where the menu will be displayed.
 * @param {Quill} quill - The Quill editor instance.
 * @param {Object} options - Additional configuration for the menu.
 * @param {Object} [options.items] - Custom menu items to override or extend the default.
 * @param {Object} [options.color] - Background color options (e.g., label and color list).
 * @param {Object} [options.textcolor] - Text color options (e.g., label and color list).
 * @param {Object} [options.textlabel] - Label text color options (e.g., label and color list).
 */

export default class TableOperationMenu {
  constructor (params, quill, options) {
    const quillQTableModule = quill.getModule('qtable')
    this.tableSelection = quillQTableModule.tableSelection
    this.table = params.table
    this.quill = quill
    this.options = options
    this.menuItems = Object.assign({}, MENU_ITEMS_DEFAULT, options.items)
    this.tableColumnTool = quillQTableModule.columnTool
    this.boundary = this.tableSelection.boundary
    this.selectedTds = this.tableSelection.selectedTds
    this.destroyHandler = this.destroy.bind(this)
    this.columnToolCells = this.tableColumnTool.colToolCells()
    this.colorSubTitle = options.color && options.color.text ? options.color.text : DEFAULT_COLOR_SUBTITLE
    this.cellColors = options.color && options.color.colors ? options.color.colors : DEFAULT_CELL_COLORS

    this.textColorSubTitle = options.textcolor && options.textcolor.text ? options.textcolor.text : DEFAULT_TEXT_COLOR_SUBTITLE
    this.textColors = options.textcolor && options.textcolor.colors ? options.textcolor.colors : DEFAULT_TEXT_COLORS

    this.textLabelSubTitle = options.textlabel && options.textlabel.text ? options.textlabel.text : DEFAULT_LABEL_TEXT_COLOR_SUBTITLE
    this.textLabelColors = options.textlabel && options.textlabel.colors ? options.textlabel.colors : DEFAULT_LABEL_TEXT_COLORS

    this.menuInitial(params)
    this.mount()
    document.addEventListener("click", this.destroyHandler, false)
  }

  /**
  * Appends the operation menu DOM node to the body.
  */
  mount () {
    document.body.appendChild(this.domNode)
  }

  /**
  * Removes the operation menu DOM node and unbinds the click event listener.
  *
  * @returns {null}
  */
  destroy () {
    if (this.domNode && this.domNode.parentNode) {
      this.domNode.remove();
      document.removeEventListener("click", this.destroyHandler, false)
    }
    return null
  }

  /**
  * Initializes the menu UI structure based on provided parameters and options.
  *
  * @param {Object} params - Initialization parameters.
  * @param {HTMLElement} params.table - The table element.
  * @param {number} params.left - Left offset position for the menu.
  * @param {number} params.top - Top offset position for the menu.
  */
  menuInitial ({ table, left, top }) {
    this.domNode = document.createElement('div')
    this.domNode.classList.add('qlbt-operation-menu')
    css(this.domNode, {
      position: 'absolute',
      left: `${left}px`,
      top: `${top}px`,
      'min-height': `${MENU_MIN_HEIGHT}px`,
      width: `${MENU_WIDTH}px`
    })

    for (let name in this.menuItems) {
      if (this.menuItems[name] && typeof this.menuItems[name].handler === 'function') {
        this.domNode.appendChild(
          this.menuItemCreator(
            Object.assign({}, MENU_ITEMS_DEFAULT[name], this.menuItems[name])
          )
        )

        if (['insertRowDown', 'unmergeCells'].indexOf(name) > -1) {
          this.domNode.appendChild(
            dividingCreator()
          )
        }
      }
      else {
        console.warn(`Invalid menu item: ${name}`, this.menuItems[name]);
      }
    }

    // if colors option is false, disabled bg color
    if (this.options.color && this.options.color !== false) {
      this.domNode.appendChild(
        dividingCreator()
      )
      this.domNode.appendChild(
        subTitleCreator(this.colorSubTitle)
      )
      this.domNode.appendChild(this.colorsItemCreator(this.cellColors))
      
      this.domNode.appendChild(
        dividingCreator()
      )
    }

    if (this.options.textcolor && this.options.textcolor !== false){
      this.domNode.appendChild(
        subTitleCreator(this.textColorSubTitle)
      );
      this.domNode.appendChild(this.textColorsItemCreator(this.textColors));
      this.domNode.appendChild(dividingCreator());
    }

    if (this.options.textlabel && this.options.textlabel !== false){
      this.domNode.appendChild(
        subTitleCreator(this.textLabelSubTitle)
      );
      this.domNode.appendChild(this.labelTextColorsItemCreator(this.textLabelColors));
      this.domNode.appendChild(dividingCreator());

    }

    // create dividing line
    function dividingCreator () {
      const dividing = document.createElement('div')
      dividing.classList.add('qlbt-operation-menu-dividing')
      return dividing
    }

    // create subtitle for menu
    function subTitleCreator (title) {
      const subTitle = document.createElement('div')
      subTitle.classList.add('qlbt-operation-menu-subtitle')
      subTitle.innerText = title
      return subTitle
    }
  }

  /**
  * Creates a background color picker UI element.
  *
  * @param {string[]} colors - List of color hex strings.
  * @returns {HTMLElement} DOM node containing color options.
  */
  colorsItemCreator (colors) {
    const self = this
    const node = document.createElement('div')
    node.classList.add('qlbt-operation-color-picker')

    colors.forEach(color => {
      let colorBox = colorBoxCreator(color)
      node.appendChild(colorBox)
    })

    function colorBoxCreator (color) {
      const box = document.createElement('div')
      box.classList.add('qlbt-operation-color-picker-item')
      box.setAttribute('data-color', color)
      box.style.backgroundColor = color

      box.addEventListener('click', function () {
        const selectedTds = self.tableSelection.selectedTds
        if (selectedTds && selectedTds.length > 0) {
          selectedTds.forEach(tableCell => {
            tableCell.format('cell-bg', color);
          })
        }
      }, false)

      return box
    }

    return node
  }

  /**
  * Creates a text color picker UI element.
  *
  * @param {string[]} colors - List of color hex strings for text.
  * @returns {HTMLElement} DOM node containing text color options.
  */
  textColorsItemCreator(colors) {
    const self = this;
    const node = document.createElement('div');
    node.classList.add('qlbt-operation-text-color-picker');
  
    colors.forEach(color => {
      let colorBox = textColorBoxCreator(color);
      node.appendChild(colorBox);
    });
  
    function textColorBoxCreator(color) {
      const box = document.createElement('div');
      box.classList.add('qlbt-operation-text-color-picker-item');
      box.setAttribute('data-cell-color', color);
      box.style.backgroundColor = color;
  
      box.addEventListener('click', function () {
        const selectedTds = self.tableSelection.selectedTds;
        if (selectedTds && selectedTds.length > 0) {
          selectedTds.forEach(tableCell => {
            tableCell.format('cell-color', color);
          });
        }
      }, false);
  
      return box;
    }
    return node;
  }

  /**
  * Creates a label text color picker UI element.
  *
  * @param {string[]} colors - List of label text color hex strings.
  * @returns {HTMLElement} DOM node with label color options.
  */
  labelTextColorsItemCreator(colors) {
    const self = this;
    const node = document.createElement('div');
    node.classList.add('qlbt-operation-label-text-color-picker');
  
    colors.forEach(color => {
      let colorBox = labelTextColorBoxCreator(color);
      node.appendChild(colorBox);
    });
  
    function labelTextColorBoxCreator(color) {
      const box = document.createElement('div');
      box.classList.add('qlbt-operation-label-text-color-picker-item');
      box.setAttribute('data-label-color', color);
      box.style.backgroundColor = color;
  
      box.addEventListener('click', function () {
        const selectedTds = self.tableSelection.selectedTds;
        if (selectedTds && selectedTds.length > 0) {
          selectedTds.forEach(tableCell => {
            tableCell.format('label-color', color);

          });
        }
      }, false);
  
      return box;
    }
  
    return node;
  }

  /**
  * Creates an individual menu item button for table operations.
  *
  * @param {Object} item - Menu item configuration.
  * @param {string} item.text - Text label for the menu item.
  * @param {string} item.iconSrc - SVG icon string.
  * @param {Function} item.handler - Click event handler for the menu item.
  * @returns {HTMLElement} Menu item DOM node.
  */
  menuItemCreator({ text, iconSrc, handler }) {
    const node = document.createElement('div');
    node.classList.add('qlbt-operation-menu-item');
  
    const iconSpan = document.createElement('span');
    iconSpan.classList.add('qlbt-operation-menu-icon');
    iconSpan.innerHTML = iconSrc;
  
    const textSpan = document.createElement('span');
    textSpan.classList.add('qlbt-operation-menu-text');
    textSpan.innerText = text;
  
    node.appendChild(iconSpan);
    node.appendChild(textSpan);
  
    if (typeof handler === 'function') {
      node.addEventListener('click', handler.bind(this), false);
    } else {
      console.warn(`Handler for menu item "${text}" is not a function`, handler);
    }
  
    return node;
  }
}


/**
 * Gets the index of a column tool cell that matches a given boundary condition.
 *
 * @param {HTMLElement[]} cells - List of tool cell elements.
 * @param {DOMRect} boundary - Boundary used for comparison.
 * @param {Function} conditionFn - Callback to evaluate the matching condition.
 * @param {HTMLElement} container - Container used for relative position calculation.
 * @returns {number|false} Index of the matching column or false if not found.
 */
function getColToolCellIndexByBoundary (cells, boundary, conditionFn, container) {
  return cells.reduce((findIndex, cell) => {
    let cellRect = getRelativeRect(cell.getBoundingClientRect(), container)
    if (conditionFn(cellRect, boundary)) {
      findIndex = cells.indexOf(cell)
    }
    return findIndex
  }, false)
}

/**
 * Gets all indexes of column tool cells that match a given boundary condition.
 *
 * @param {HTMLElement[]} cells - List of tool cell elements.
 * @param {DOMRect} boundary - Boundary used for comparison.
 * @param {Function} conditionFn - Callback to evaluate the matching condition.
 * @param {HTMLElement} container - Container used for relative position calculation.
 * @returns {number[]} List of matching column indexes.
 */
function getColToolCellIndexesByBoundary (cells, boundary, conditionFn, container) {
  return cells.reduce((findIndexes, cell) => {
    let cellRect = getRelativeRect(
      cell.getBoundingClientRect(),
      container
    )
    if (conditionFn(cellRect, boundary)) {
      findIndexes.push(cells.indexOf(cell))
    }
    return findIndexes
  }, [])
}
