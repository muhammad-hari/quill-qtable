import Quill from "quill"
import { 
  TableCell,
  TableCellLine,
  CELL_IDENTITY_KEYS,
  CELL_ATTRIBUTES
} from './table'

const Block = Quill.import("blots/block")

/**
 * Custom Header blot used for table headers (e.g., H1-H6) in Quill editor.
 * Extends Quill's Block blot and supports data attributes related to tables.
 */
class Header extends Block {
  /**
   * Creates a DOM node for the header blot with optional table-related attributes.
   *
   * @param {string|object} value - Header value or an object containing metadata.
   * @returns {HTMLElement} The created DOM node.
   */
  static create(value) {
    if (typeof value === 'string') {
      value = { value }
    }

    const node = super.create(value.value)

    // Set table-related identity and attributes
    CELL_IDENTITY_KEYS.forEach(key => {
      if (value[key]) node.setAttribute(`data-${key}`, value[key])
    })

    CELL_ATTRIBUTES.forEach(key => {
      if (value[key]) node.setAttribute(`data-${key}`, value[key])
    })

    return node
  }

  /**
   * Extracts format attributes from a DOM node.
   *
   * @param {HTMLElement} domNode - The DOM node to read attributes from.
   * @returns {object} The extracted format values.
   */
  static formats(domNode) {
    const formats = {}
    formats.value = this.tagName.indexOf(domNode.tagName) + 1

    return CELL_ATTRIBUTES.concat(CELL_IDENTITY_KEYS).reduce((formats, attribute) => {
      if (domNode.hasAttribute(`data-${attribute}`)) {
        formats[attribute] = domNode.getAttribute(`data-${attribute}`) || undefined
      }
      return formats
    }, formats)
  }

  /**
   * Applies formatting to the header blot.
   *
   * @param {string} name - The format name.
   * @param {*} value - The value to set.
   */
  format(name, value) {
    const { row, cell, rowspan, colspan } = Header.formats(this.domNode)

    if (name === Header.blotName) {
      if (value) {
        super.format(name, {
          value,
          row, cell, rowspan, colspan
        })
      } else {
        if (row) {
          // Convert header to regular TableCellLine if header format removed
          this.replaceWith(TableCellLine.blotName, {
            row,
            cell,
            rowspan,
            colspan
          })
        } else {
          super.format(name, value)
        }
      }
    } else {
      super.format(name, value)
    }
  }

  /**
   * Optimizes the blot structure to ensure proper table structure.
   * Called automatically by Quill when the document is mutated.
   *
   * @param {object} context - The optimization context.
   */
  optimize(context) {
    const { row, rowspan, colspan } = Header.formats(this.domNode)

    // If this header is not inside a TableCell, wrap it
    if (
      row &&
      !(this.parent instanceof TableCell)
    ) {
      this.wrap(TableCell.blotName, {
        row,
        colspan,
        rowspan
      })
    }

    // Enforce allowed children (required by Quill internals)
    this.enforceAllowedChildren()

    // Ensure uiNode is at the beginning
    if (this.uiNode != null && this.uiNode !== this.domNode.firstChild) {
      this.domNode.insertBefore(this.uiNode, this.domNode.firstChild)
    }

    // Ensure it has children
    if (this.children.length === 0) {
      if (this.statics.defaultChild != null) {
        const child = this.scroll.create(this.statics.defaultChild.blotName)
        this.appendChild(child)
        // Optional: child.optimize(context)
      } else {
        this.remove()
      }
    }

    // Reset cache (used internally)
    this.cache = {}
  }
}

/** @static {string} The blot name used to register with Quill. */
Header.blotName = 'header'

/** @static {string[]} Supported HTML tags for this blot. */
Header.tagName = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6']

export default Header
