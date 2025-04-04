import Quill from 'quill'
import { css, getRelativeRect } from '../utils'
import { TableCell } from '../formats/table'

const PRIMARY_COLOR = '#01C0C8'
const LINE_POSITIONS = ['left', 'right', 'top', 'bottom']
const ERROR_LIMIT = 2

/**
 * Class to handle selection of table cells in a Quill editor
 */
export default class TableSelection {
  /**
   * @param {HTMLTableElement} table - The table DOM element
   * @param {Quill} quill - The Quill editor instance
   * @param {Object} options - Additional options (currently unused)
   */
  constructor(table, quill, options) {
    if (!table) {
      console.warn('No table passed to TableSelection')
      return null
    }

    this.table = table
    this.quill = quill
    this.options = options

    /** @type {Object} Boundary of selection: {x, y, x1, y1, width, height} */
    this.boundary = {}

    /** @type {TableCell[]} Selected table cells */
    this.selectedTds = []

    /** @type {boolean} Whether a selection is being dragged */
    this.dragging = false

    this.selectingHandler = this.mouseDownHandler.bind(this)
    this.clearSelectionHandler = this.clearSelection.bind(this)

    this.helpLinesInitial()
    this.quill.root.addEventListener('mousedown', this.selectingHandler, false)
    this.quill.on('text-change', this.clearSelectionHandler)
  }

  /**
   * Initialize helper lines (selection borders)
   */
  helpLinesInitial() {
    let parent = this.quill.root.parentNode

    LINE_POSITIONS.forEach(direction => {
      this[direction] = document.createElement('div')
      this[direction].classList.add('qlbt-selection-line', 'qlbt-selection-line-' + direction)

      css(this[direction], {
        position: 'absolute',
        display: 'none',
        'background-color': PRIMARY_COLOR
      })

      parent.appendChild(this[direction])
    })
  }

  /**
   * Mouse down handler for starting cell selection
   * @param {MouseEvent} e 
   */
  mouseDownHandler(e) {
    if (e.button !== 0 || !e.target.closest(".quill-qtable")) return

    this.mouseMoveHandler = mouseMoveHandler
    this.mouseUpHandler = mouseUpHandler

    this.quill.root.removeEventListener('mousemove', this.mouseMoveHandler)
    this.quill.root.removeEventListener('mouseup', this.mouseUpHandler)

    const self = this
    const startTd = e.target.closest('td[data-row]')
    const startTdRect = getRelativeRect(startTd.getBoundingClientRect(), this.quill.root.parentNode)

    this.dragging = true
    this.boundary = computeBoundaryFromRects(startTdRect, startTdRect)
    this.correctBoundary()
    this.selectedTds = this.computeSelectedTds()
    this.repositionHelpLines()

    /**
     * Mouse move handler to track selection area
     * @param {MouseEvent} e 
     */
    function mouseMoveHandler(e) {
      if (e.button !== 0 || !e.target.closest(".quill-qtable")) return
      const endTd = e.target.closest('td[data-row]')
      if (!endTd) return

      const endTdRect = getRelativeRect(endTd.getBoundingClientRect(), self.quill.root.parentNode)
      self.boundary = computeBoundaryFromRects(startTdRect, endTdRect)
      self.correctBoundary()
      self.selectedTds = self.computeSelectedTds()
      self.repositionHelpLines()

      if (startTd !== endTd) {
        self.quill.blur()
      }
    }

    /**
     * Mouse up handler to end selection
     * @param {MouseEvent} e 
     */
    function mouseUpHandler(e) {
      self.quill.root.removeEventListener('mousemove', mouseMoveHandler, false)
      self.quill.root.removeEventListener('mouseup', mouseUpHandler, false)
      self.dragging = false
    }

    this.quill.root.addEventListener('mousemove', this.mouseMoveHandler)
    this.quill.root.addEventListener('mouseup', this.mouseUpHandler)
  }

  /**
   * Correct the selection boundary if it partially intersects a cell
   */
  correctBoundary() {
    const tableContainer = Quill.find(this.table)
    const tableCells = tableContainer.descendants(TableCell)

    tableCells.forEach(tableCell => {
      const { x, y, width, height } = getRelativeRect(
        tableCell.domNode.getBoundingClientRect(),
        this.quill.root.parentNode
      )

      const isCellIntersected =
        ((x + ERROR_LIMIT >= this.boundary.x && x + ERROR_LIMIT <= this.boundary.x1) ||
         (x - ERROR_LIMIT + width >= this.boundary.x && x - ERROR_LIMIT + width <= this.boundary.x1)) &&
        ((y + ERROR_LIMIT >= this.boundary.y && y + ERROR_LIMIT <= this.boundary.y1) ||
         (y - ERROR_LIMIT + height >= this.boundary.y && y - ERROR_LIMIT + height <= this.boundary.y1))

      if (isCellIntersected) {
        this.boundary = computeBoundaryFromRects(this.boundary, { x, y, width, height })
      }
    })
  }

  /**
   * Find all cells within the current boundary
   * @returns {TableCell[]} Selected cells
   */
  computeSelectedTds() {
    const tableContainer = Quill.find(this.table)
    const tableCells = tableContainer.descendants(TableCell)

    return tableCells.reduce((selectedCells, tableCell) => {
      const { x, y, width, height } = getRelativeRect(
        tableCell.domNode.getBoundingClientRect(),
        this.quill.root.parentNode
      )

      const isCellIncluded =
        x + ERROR_LIMIT >= this.boundary.x &&
        x - ERROR_LIMIT + width <= this.boundary.x1 &&
        y + ERROR_LIMIT >= this.boundary.y &&
        y - ERROR_LIMIT + height <= this.boundary.y1

      if (isCellIncluded) {
        selectedCells.push(tableCell)
      }

      return selectedCells
    }, [])
  }

  /**
   * Reposition the helper lines (selection borders) to match the current boundary
   */
  repositionHelpLines() {
    const scrollLeft = this.table.parentNode.scrollLeft

    css(this.left, {
      display: 'block',
      left: `${this.boundary.x - scrollLeft - 1}px`,
      top: `${this.boundary.y}px`,
      height: `${this.boundary.height + 1}px`,
      width: '1px'
    })

    css(this.right, {
      display: 'block',
      left: `${this.boundary.x1 - scrollLeft}px`,
      top: `${this.boundary.y}px`,
      height: `${this.boundary.height + 1}px`,
      width: '1px'
    })

    css(this.top, {
      display: 'block',
      left: `${this.boundary.x - 1 - scrollLeft}px`,
      top: `${this.boundary.y}px`,
      width: `${this.boundary.width + 1}px`,
      height: '1px'
    })

    css(this.bottom, {
      display: 'block',
      left: `${this.boundary.x - 1 - scrollLeft}px`,
      top: `${this.boundary.y1 + 1}px`,
      width: `${this.boundary.width + 1}px`,
      height: '1px'
    })
  }

  /**
   * Refresh the position of helper lines without recomputing selected cells
   */
  refreshHelpLinesPosition() {
    const startRect = getRelativeRect(
      this.selectedTds[0].domNode.getBoundingClientRect(),
      this.quill.root.parentNode
    )

    const endRect = getRelativeRect(
      this.selectedTds[this.selectedTds.length - 1].domNode.getBoundingClientRect(),
      this.quill.root.parentNode
    )

    this.boundary = computeBoundaryFromRects(startRect, endRect)
    this.repositionHelpLines()
  }

  /**
   * Destroy this selection instance and clean up DOM/events
   * @returns {null}
   */
  destroy() {
    LINE_POSITIONS.forEach(direction => {
      this[direction].remove()
      this[direction] = null
    })

    this.quill.root.removeEventListener('mousedown', this.selectingHandler, false)
    this.quill.off('text-change', this.clearSelectionHandler)

    this.boundary = {}
    this.selectedTds = []
    this.dragging = false

    return null
  }

  /**
   * Set selection by providing start and end rectangles
   * @param {DOMRect} startRect 
   * @param {DOMRect} endRect 
   */
  setSelection(startRect, endRect) {
    this.boundary = computeBoundaryFromRects(
      getRelativeRect(startRect, this.quill.root.parentNode),
      getRelativeRect(endRect, this.quill.root.parentNode)
    )
    this.correctBoundary()
    this.selectedTds = this.computeSelectedTds()
    this.repositionHelpLines()
  }

  /**
   * Clear current selection and hide helper lines
   */
  clearSelection() {
    this.boundary = {}
    this.selectedTds = []
    LINE_POSITIONS.forEach(direction => {
      this[direction] && css(this[direction], { display: 'none' })
    })
  }
}

/**
 * Compute a boundary box from two rectangles
 * @param {DOMRect|Object} startRect - Start rectangle
 * @param {DOMRect|Object} endRect - End rectangle
 * @returns {{x: number, y: number, x1: number, y1: number, width: number, height: number}}
 */
function computeBoundaryFromRects(startRect, endRect) {
  let x = Math.min(startRect.x, endRect.x, startRect.x + startRect.width - 1, endRect.x + endRect.width - 1)
  let x1 = Math.max(startRect.x, endRect.x, startRect.x + startRect.width - 1, endRect.x + endRect.width - 1)
  let y = Math.min(startRect.y, endRect.y, startRect.y + startRect.height - 1, endRect.y + endRect.height - 1)
  let y1 = Math.max(startRect.y, endRect.y, startRect.y + startRect.height - 1, endRect.y + endRect.height - 1)
  let width = x1 - x
  let height = y1 - y

  return { x, x1, y, y1, width, height }
}
