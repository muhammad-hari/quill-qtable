(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("quill"));
	else if(typeof define === 'function' && define.amd)
		define(["quill"], factory);
	else if(typeof exports === 'object')
		exports["quillQTable"] = factory(require("quill"));
	else
		root["quillQTable"] = factory(root["Quill"]);
})(self, (__WEBPACK_EXTERNAL_MODULE__912__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 140:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* eslint-env browser */
/*
  eslint-disable
  no-console,
  func-names
*/

/** @typedef {any} TODO */

var normalizeUrl = __webpack_require__(918);
var srcByModuleId = Object.create(null);
var noDocument = typeof document === "undefined";
var forEach = Array.prototype.forEach;

/**
 * @param {function} fn
 * @param {number} time
 * @returns {(function(): void)|*}
 */
function debounce(fn, time) {
  var timeout = 0;
  return function () {
    // @ts-ignore
    var self = this;
    // eslint-disable-next-line prefer-rest-params
    var args = arguments;
    var functionCall = function functionCall() {
      return fn.apply(self, args);
    };
    clearTimeout(timeout);

    // @ts-ignore
    timeout = setTimeout(functionCall, time);
  };
}
function noop() {}

/**
 * @param {TODO} moduleId
 * @returns {TODO}
 */
function getCurrentScriptUrl(moduleId) {
  var src = srcByModuleId[moduleId];
  if (!src) {
    if (document.currentScript) {
      src = ( /** @type {HTMLScriptElement} */document.currentScript).src;
    } else {
      var scripts = document.getElementsByTagName("script");
      var lastScriptTag = scripts[scripts.length - 1];
      if (lastScriptTag) {
        src = lastScriptTag.src;
      }
    }
    srcByModuleId[moduleId] = src;
  }

  /**
   * @param {string} fileMap
   * @returns {null | string[]}
   */
  return function (fileMap) {
    if (!src) {
      return null;
    }
    var splitResult = src.split(/([^\\/]+)\.js$/);
    var filename = splitResult && splitResult[1];
    if (!filename) {
      return [src.replace(".js", ".css")];
    }
    if (!fileMap) {
      return [src.replace(".js", ".css")];
    }
    return fileMap.split(",").map(function (mapRule) {
      var reg = new RegExp("".concat(filename, "\\.js$"), "g");
      return normalizeUrl(src.replace(reg, "".concat(mapRule.replace(/{fileName}/g, filename), ".css")));
    });
  };
}

/**
 * @param {TODO} el
 * @param {string} [url]
 */
function updateCss(el, url) {
  if (!url) {
    if (!el.href) {
      return;
    }

    // eslint-disable-next-line
    url = el.href.split("?")[0];
  }
  if (!isUrlRequest( /** @type {string} */url)) {
    return;
  }
  if (el.isLoaded === false) {
    // We seem to be about to replace a css link that hasn't loaded yet.
    // We're probably changing the same file more than once.
    return;
  }
  if (!url || !(url.indexOf(".css") > -1)) {
    return;
  }

  // eslint-disable-next-line no-param-reassign
  el.visited = true;
  var newEl = el.cloneNode();
  newEl.isLoaded = false;
  newEl.addEventListener("load", function () {
    if (newEl.isLoaded) {
      return;
    }
    newEl.isLoaded = true;
    el.parentNode.removeChild(el);
  });
  newEl.addEventListener("error", function () {
    if (newEl.isLoaded) {
      return;
    }
    newEl.isLoaded = true;
    el.parentNode.removeChild(el);
  });
  newEl.href = "".concat(url, "?").concat(Date.now());
  if (el.nextSibling) {
    el.parentNode.insertBefore(newEl, el.nextSibling);
  } else {
    el.parentNode.appendChild(newEl);
  }
}

/**
 * @param {string} href
 * @param {TODO} src
 * @returns {TODO}
 */
function getReloadUrl(href, src) {
  var ret;

  // eslint-disable-next-line no-param-reassign
  href = normalizeUrl(href);
  src.some(
  /**
   * @param {string} url
   */
  // eslint-disable-next-line array-callback-return
  function (url) {
    if (href.indexOf(src) > -1) {
      ret = url;
    }
  });
  return ret;
}

/**
 * @param {string} [src]
 * @returns {boolean}
 */
function reloadStyle(src) {
  if (!src) {
    return false;
  }
  var elements = document.querySelectorAll("link");
  var loaded = false;
  forEach.call(elements, function (el) {
    if (!el.href) {
      return;
    }
    var url = getReloadUrl(el.href, src);
    if (!isUrlRequest(url)) {
      return;
    }
    if (el.visited === true) {
      return;
    }
    if (url) {
      updateCss(el, url);
      loaded = true;
    }
  });
  return loaded;
}
function reloadAll() {
  var elements = document.querySelectorAll("link");
  forEach.call(elements, function (el) {
    if (el.visited === true) {
      return;
    }
    updateCss(el);
  });
}

/**
 * @param {string} url
 * @returns {boolean}
 */
function isUrlRequest(url) {
  // An URL is not an request if

  // It is not http or https
  if (!/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url)) {
    return false;
  }
  return true;
}

/**
 * @param {TODO} moduleId
 * @param {TODO} options
 * @returns {TODO}
 */
module.exports = function (moduleId, options) {
  if (noDocument) {
    console.log("no window.document found, will not HMR CSS");
    return noop;
  }
  var getScriptSrc = getCurrentScriptUrl(moduleId);
  function update() {
    var src = getScriptSrc(options.filename);
    var reloaded = reloadStyle(src);
    if (options.locals) {
      console.log("[HMR] Detected local css modules. Reload all css");
      reloadAll();
      return;
    }
    if (reloaded) {
      console.log("[HMR] css reload %s", src.join(" "));
    } else {
      console.log("[HMR] Reload all css");
      reloadAll();
    }
  }
  return debounce(update, 50);
};

/***/ }),

/***/ 299:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ quill_qtable)
});

// EXTERNAL MODULE: external {"commonjs":"quill","commonjs2":"quill","amd":"quill","root":"Quill"}
var external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_ = __webpack_require__(912);
var external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default = /*#__PURE__*/__webpack_require__.n(external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_);
;// ./src/utils/index.js
function css(domNode, rules) {
  if (typeof rules === 'object') {
    for (let prop in rules) {
      domNode.style[prop] = rules[prop];
    }
  }
}

/**
 * getRelativeRect
 * @param  {Object} targetRect  rect data for target element
 * @param  {Element} container  container element
 * @return {Object}             an object with rect data
 */
function getRelativeRect(targetRect, container) {
  let containerRect = container.getBoundingClientRect();
  return {
    x: targetRect.x - containerRect.x - container.scrollLeft,
    y: targetRect.y - containerRect.y - container.scrollTop,
    x1: targetRect.x - containerRect.x - container.scrollLeft + targetRect.width,
    y1: targetRect.y - containerRect.y - container.scrollTop + targetRect.height,
    width: targetRect.width,
    height: targetRect.height
  };
}

/**
 * _omit
 * @param  {Object} obj         target Object
 * @param  {Array} uselessKeys  keys of removed properties
 * @return {Object}             new Object without useless properties
 */
function _omit(obj, uselessKeys) {
  return obj && Object.keys(obj).reduce((acc, key) => {
    return uselessKeys.includes(key) ? acc : Object.assign({}, acc, {
      [key]: obj[key]
    });
  }, {});
}

/**
 * getEventComposedPath
 *  compatibility fixed for Event.path/Event.composedPath
 *  Event.path is only for chrome/opera
 *  Event.composedPath is for Safari, FF
 *  Neither for Micro Edge
 * @param {Event} evt
 * @return {Array} an array of event.path
 */
function getEventComposedPath(evt) {
  let path;
  // chrome, opera, safari, firefox
  path = evt.path || evt.composedPath && evt.composedPath();

  // other: edge
  if (path == undefined && evt.target) {
    path = [];
    let target = evt.target;
    path.push(target);
    while (target && target.parentNode) {
      target = target.parentNode;
      path.push(target);
    }
  }
  return path;
}
function convertToHex(rgb) {
  var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  // if rgb
  if (/^(rgb|RGB)/.test(rgb)) {
    var color = rgb.toString().match(/\d+/g);
    var hex = "#";
    for (var i = 0; i < 3; i++) {
      hex += ("0" + Number(color[i]).toString(16)).slice(-2);
    }
    return hex;
  } else if (reg.test(rgb)) {
    var aNum = rgb.replace(/#/, "").split("");
    if (aNum.length === 6) {
      return rgb;
    } else if (aNum.length === 3) {
      var numHex = "#";
      for (var i = 0; i < aNum.length; i += 1) {
        numHex += aNum[i] + aNum[i];
      }
      return numHex;
    }
  }
  return rgb;
}
;// ./src/modules/table-column-tool.js


const COL_TOOL_HEIGHT = 12;
const COL_TOOL_CELL_HEIGHT = 12;
const ROW_TOOL_WIDTH = 12;
const CELL_MIN_WIDTH = 50;
const PRIMARY_COLOR = '#35A7ED';
class TableColumnTool {
  constructor(table, quill, options) {
    if (!table) return null;
    this.table = table;
    this.quill = quill;
    this.options = options;
    this.domNode = null;
    this.initColTool();
  }
  initColTool() {
    const parent = this.quill.root.parentNode;
    const tableRect = this.table.getBoundingClientRect();
    const containerRect = parent.getBoundingClientRect();
    const tableViewRect = this.table.parentNode.getBoundingClientRect();
    this.domNode = document.createElement('div');
    this.domNode.classList.add('qlbt-col-tool');
    this.updateToolCells();
    parent.appendChild(this.domNode);
    css(this.domNode, {
      width: `${tableViewRect.width}px`,
      height: `${COL_TOOL_HEIGHT}px`,
      left: `${tableViewRect.left - containerRect.left + parent.scrollLeft}px`,
      top: `${tableViewRect.top - containerRect.top + parent.scrollTop - COL_TOOL_HEIGHT - 5}px`
    });
  }
  createToolCell() {
    const toolCell = document.createElement('div');
    toolCell.classList.add('qlbt-col-tool-cell');
    const resizeHolder = document.createElement('div');
    resizeHolder.classList.add('qlbt-col-tool-cell-holder');
    css(toolCell, {
      'height': `${COL_TOOL_CELL_HEIGHT}px`
    });
    toolCell.appendChild(resizeHolder);
    return toolCell;
  }
  updateToolCells() {
    const tableContainer = external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default().find(this.table);
    const CellsInFirstRow = tableContainer.children.tail.children.head.children;
    const tableCols = tableContainer.colGroup().children;
    const cellsNumber = computeCellsNumber(CellsInFirstRow);
    let existCells = Array.from(this.domNode.querySelectorAll('.qlbt-col-tool-cell'));
    for (let index = 0; index < Math.max(cellsNumber, existCells.length); index++) {
      let col = tableCols.at(index);
      let colWidth = col && parseInt(col.formats()[col.statics.blotName].width, 10);
      // if cell already exist
      let toolCell = null;
      if (!existCells[index]) {
        toolCell = this.createToolCell();
        this.domNode.appendChild(toolCell);
        this.addColCellHolderHandler(toolCell);
        // set tool cell min-width
        css(toolCell, {
          'min-width': `${colWidth}px`
        });
      } else if (existCells[index] && index >= cellsNumber) {
        existCells[index].remove();
      } else {
        toolCell = existCells[index];
        // set tool cell min-width
        css(toolCell, {
          'min-width': `${colWidth}px`
        });
      }
    }
  }
  destroy() {
    this.domNode.remove();
    return null;
  }
  addColCellHolderHandler(cell) {
    const tableContainer = external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default().find(this.table);
    const $holder = cell.querySelector(".qlbt-col-tool-cell-holder");
    let dragging = false;
    let x0 = 0;
    let x = 0;
    let delta = 0;
    let width0 = 0;
    // helpLine relation varrible
    let tableRect = {};
    let cellRect = {};
    let $helpLine = null;
    const handleDrag = e => {
      e.preventDefault();
      if (dragging) {
        x = e.clientX;
        if (width0 + x - x0 >= CELL_MIN_WIDTH) {
          delta = x - x0;
        } else {
          delta = CELL_MIN_WIDTH - width0;
        }
        css($helpLine, {
          'left': `${cellRect.left + cellRect.width - 1 + delta}px`
        });
      }
    };
    const handleMouseup = e => {
      e.preventDefault();
      const existCells = Array.from(this.domNode.querySelectorAll('.qlbt-col-tool-cell'));
      const colIndex = existCells.indexOf(cell);
      const colBlot = tableContainer.colGroup().children.at(colIndex);
      if (dragging) {
        colBlot.format('width', width0 + delta);
        css(cell, {
          'min-width': `${width0 + delta}px`
        });
        x0 = 0;
        x = 0;
        delta = 0;
        width0 = 0;
        dragging = false;
        $holder.classList.remove('dragging');
      }
      document.removeEventListener('mousemove', handleDrag, false);
      document.removeEventListener('mouseup', handleMouseup, false);
      tableRect = {};
      cellRect = {};
      $helpLine.remove();
      $helpLine = null;
      tableContainer.updateTableWidth();
      const tableSelection = this.quill.getModule('qtable').tableSelection;
      tableSelection && tableSelection.clearSelection();
    };
    const handleMousedown = e => {
      document.addEventListener('mousemove', handleDrag, false);
      document.addEventListener('mouseup', handleMouseup, false);
      tableRect = this.table.getBoundingClientRect();
      cellRect = cell.getBoundingClientRect();
      $helpLine = document.createElement('div');
      css($helpLine, {
        position: 'fixed',
        top: `${cellRect.top}px`,
        left: `${cellRect.left + cellRect.width - 1}px`,
        zIndex: '100',
        height: `${tableRect.height + COL_TOOL_HEIGHT + 4}px`,
        width: '1px',
        backgroundColor: PRIMARY_COLOR
      });
      document.body.appendChild($helpLine);
      dragging = true;
      x0 = e.clientX;
      width0 = cellRect.width;
      $holder.classList.add('dragging');
    };
    $holder.addEventListener('mousedown', handleMousedown, false);
  }
  colToolCells() {
    return Array.from(this.domNode.querySelectorAll('.qlbt-col-tool-cell'));
  }
}
function computeCellsNumber(CellsInFirstRow) {
  return CellsInFirstRow.reduce((sum, cell) => {
    const cellColspan = cell.formats().colspan;
    sum = sum + parseInt(cellColspan, 10);
    return sum;
  }, 0);
}
;// ./src/formats/header.js


const Block = external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default()["import"]("blots/block");
class Header extends Block {
  static create(value) {
    if (typeof value === 'string') {
      value = {
        value
      };
    }
    const node = super.create(value.value);
    CELL_IDENTITY_KEYS.forEach(key => {
      if (value[key]) node.setAttribute(`data-${key}`, value[key]);
    });
    CELL_ATTRIBUTES.forEach(key => {
      if (value[key]) node.setAttribute(`data-${key}`, value[key]);
    });
    return node;
  }
  static formats(domNode) {
    const formats = {};
    formats.value = this.tagName.indexOf(domNode.tagName) + 1;
    return CELL_ATTRIBUTES.concat(CELL_IDENTITY_KEYS).reduce((formats, attribute) => {
      if (domNode.hasAttribute(`data-${attribute}`)) {
        formats[attribute] = domNode.getAttribute(`data-${attribute}`) || undefined;
      }
      return formats;
    }, formats);
  }
  format(name, value) {
    const {
      row,
      cell,
      rowspan,
      colspan
    } = Header.formats(this.domNode);
    if (name === Header.blotName) {
      if (value) {
        super.format(name, {
          value,
          row,
          cell,
          rowspan,
          colspan
        });
      } else {
        if (row) {
          this.replaceWith(TableCellLine.blotName, {
            row,
            cell,
            rowspan,
            colspan
          });
        } else {
          super.format(name, value);
        }
      }
    } else {
      super.format(name, value);
    }
  }
  optimize(context) {
    const {
      row,
      rowspan,
      colspan
    } = Header.formats(this.domNode);
    if (row && !(this.parent instanceof TableCell)) {
      this.wrap(TableCell.blotName, {
        row,
        colspan,
        rowspan
      });
    }

    // ShadowBlot optimize
    this.enforceAllowedChildren();
    if (this.uiNode != null && this.uiNode !== this.domNode.firstChild) {
      this.domNode.insertBefore(this.uiNode, this.domNode.firstChild);
    }
    if (this.children.length === 0) {
      if (this.statics.defaultChild != null) {
        const child = this.scroll.create(this.statics.defaultChild.blotName);
        this.appendChild(child);
        // TODO double check if necessary
        // child.optimize(context);
      } else {
        this.remove();
      }
    }
    // Block optimize
    this.cache = {};
  }
}
Header.blotName = 'header';
Header.tagName = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
/* harmony default export */ const header = (Header);
;// ./src/formats/table.js



const Break = external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default()["import"]("blots/break");
const table_Block = external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default()["import"]("blots/block");
const Container = external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default()["import"]("blots/container");
const COL_ATTRIBUTES = ["width"];
const COL_DEFAULT = {
  width: 100
};
const CELL_IDENTITY_KEYS = ["row", "cell"];
const CELL_ATTRIBUTES = ["rowspan", "colspan"];
const CELL_DEFAULT = {
  rowspan: 1,
  colspan: 1
};
const ERROR_LIMIT = 5;
class TableCellLine extends table_Block {
  static create(value) {
    const node = super.create(value);
    CELL_IDENTITY_KEYS.forEach(key => {
      let identityMaker = key === 'row' ? rowId : cellId;
      node.setAttribute(`data-${key}`, value[key] || identityMaker());
    });
    CELL_ATTRIBUTES.forEach(attrName => {
      node.setAttribute(`data-${attrName}`, value[attrName] || CELL_DEFAULT[attrName]);
    });
    if (value['cell-bg']) {
      node.setAttribute('data-cell-bg', value['cell-bg']);
    }
    return node;
  }
  static formats(domNode) {
    const formats = {};
    return CELL_ATTRIBUTES.concat(CELL_IDENTITY_KEYS).concat(['cell-bg']).reduce((formats, attribute) => {
      if (domNode.hasAttribute(`data-${attribute}`)) {
        formats[attribute] = domNode.getAttribute(`data-${attribute}`) || undefined;
      }
      return formats;
    }, formats);
  }
  format(name, value) {
    if (CELL_ATTRIBUTES.concat(CELL_IDENTITY_KEYS).indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(`data-${name}`, value);
      } else {
        this.domNode.removeAttribute(`data-${name}`);
      }
    } else if (name === 'cell-bg') {
      if (value) {
        this.domNode.setAttribute('data-cell-bg', value);
      } else {
        this.domNode.removeAttribute('data-cell-bg');
      }
    } else if (name === 'header') {
      if (!value) return;
      const {
        row,
        cell,
        rowspan,
        colspan
      } = TableCellLine.formats(this.domNode);
      super.format(name, {
        value,
        row,
        cell,
        rowspan,
        colspan
      });
    } else {
      super.format(name, value);
    }
  }
  optimize(context) {
    // cover shadowBlot's wrap call, pass params parentBlot initialize
    // needed
    const rowId = this.domNode.getAttribute('data-row');
    const rowspan = this.domNode.getAttribute('data-rowspan');
    const colspan = this.domNode.getAttribute('data-colspan');
    const cellBg = this.domNode.getAttribute('data-cell-bg');
    if (this.statics.requiredContainer && !(this.parent instanceof this.statics.requiredContainer)) {
      this.wrap(this.statics.requiredContainer.blotName, {
        row: rowId,
        colspan,
        rowspan,
        'cell-bg': cellBg
      });
    }
    super.optimize(context);
  }
  tableCell() {
    return this.parent;
  }
}
TableCellLine.blotName = "table-cell-line";
TableCellLine.className = "qlbt-cell-line";
TableCellLine.tagName = "P";
class TableCell extends Container {
  checkMerge() {
    if (super.checkMerge() && this.next.children.head != null) {
      const thisHead = this.children.head.formats()[this.children.head.statics.blotName];
      const thisTail = this.children.tail.formats()[this.children.tail.statics.blotName];
      const nextHead = this.next.children.head.formats()[this.next.children.head.statics.blotName];
      const nextTail = this.next.children.tail.formats()[this.next.children.tail.statics.blotName];
      return thisHead.cell === thisTail.cell && thisHead.cell === nextHead.cell && thisHead.cell === nextTail.cell;
    }
    return false;
  }
  static create(value) {
    const node = super.create(value);
    node.setAttribute("data-row", value.row);
    CELL_ATTRIBUTES.forEach(attrName => {
      if (value[attrName]) {
        node.setAttribute(attrName, value[attrName]);
      }
    });
    if (value['cell-bg']) {
      node.setAttribute('data-cell-bg', value['cell-bg']);
      node.style.backgroundColor = value['cell-bg'];
    }
    if (value['cell-color']) {
      node.setAttribute('data-cell-color', value['cell-color']);
      node.style.color = value['cell-color'];
    }
    if (value['label-color']) {
      node.setAttribute('data-label-color', value['label-color']);
    }
    return node;
  }
  static formats(domNode) {
    const formats = {};
    if (domNode.hasAttribute("data-row")) {
      formats["row"] = domNode.getAttribute("data-row");
    }
    if (domNode.hasAttribute("data-cell-bg")) {
      formats["cell-bg"] = domNode.getAttribute("data-cell-bg");
    }
    if (domNode.hasAttribute("data-cell-color")) {
      formats["cell-color"] = domNode.getAttribute("data-cell-color");
    }
    if (domNode.hasAttribute("data-label-color")) {
      formats["label-color"] = domNode.getAttribute("data-label-color");
    }
    return CELL_ATTRIBUTES.reduce((formats, attribute) => {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, formats);
  }
  cellOffset() {
    if (this.parent) {
      return this.parent.children.indexOf(this);
    }
    return -1;
  }
  formats() {
    const formats = {};
    if (this.domNode.hasAttribute("data-row")) {
      formats["row"] = this.domNode.getAttribute("data-row");
    }
    if (this.domNode.hasAttribute("data-cell-bg")) {
      formats["cell-bg"] = this.domNode.getAttribute("data-cell-bg");
    }
    return CELL_ATTRIBUTES.reduce((formats, attribute) => {
      if (this.domNode.hasAttribute(attribute)) {
        formats[attribute] = this.domNode.getAttribute(attribute);
      }
      return formats;
    }, formats);
  }
  toggleAttribute(name, value) {
    if (value) {
      this.domNode.setAttribute(name, value);
    } else {
      this.domNode.removeAttribute(name);
    }
  }
  formatChildren(name, value) {
    this.children.forEach(child => {
      child.format(name, value);
    });
  }
  format(name, value) {
    if (CELL_ATTRIBUTES.indexOf(name) > -1) {
      this.toggleAttribute(name, value);
      this.formatChildren(name, value);
    } else if (['row'].indexOf(name) > -1) {
      this.toggleAttribute(`data-${name}`, value);
      this.formatChildren(name, value);
    } else if (name === 'cell-bg') {
      this.toggleAttribute('data-cell-bg', value);
      this.formatChildren(name, value);
      if (value) {
        this.domNode.style.backgroundColor = value;
      } else {
        this.domNode.style.backgroundColor = 'initial';
      }
    } else if (name === 'cell-color') {
      this.toggleAttribute('data-cell-color', value);
      this.formatChildren(name, value);
      if (value) {
        this.domNode.style.color = value;
      } else {
        this.domNode.style.color = 'initial';
      }
    } else if (name === 'label-color') {
      this.toggleAttribute('data-label-color', value);
      this.formatChildren(name, value);
      const paragraph = this.domNode.querySelector("p");
      if (value && paragraph) {
        paragraph.style.backgroundColor = value;
        paragraph.classList.add("qlbt-tag-label");
      } else {
        paragraph.style.backgroundColor = 'initial';
        paragraph.classList.remove("qlbt-tag-label");
      }
    } else {
      super.format(name, value);
    }
  }
  optimize(context) {
    const rowId = this.domNode.getAttribute("data-row");
    if (this.statics.requiredContainer && !(this.parent instanceof this.statics.requiredContainer)) {
      this.wrap(this.statics.requiredContainer.blotName, {
        row: rowId
      });
    }
    super.optimize(context);
  }
  row() {
    return this.parent;
  }
  rowOffset() {
    if (this.row()) {
      return this.row().rowOffset();
    }
    return -1;
  }
  table() {
    return this.row() && this.row().table();
  }
}
TableCell.blotName = "table";
TableCell.tagName = "TD";
class TableRow extends Container {
  checkMerge() {
    if (super.checkMerge() && this.next.children.head != null) {
      const thisHead = this.children.head.formats();
      const thisTail = this.children.tail.formats();
      const nextHead = this.next.children.head.formats();
      const nextTail = this.next.children.tail.formats();
      return thisHead.row === thisTail.row && thisHead.row === nextHead.row && thisHead.row === nextTail.row;
    }
    return false;
  }
  static create(value) {
    const node = super.create(value);
    node.setAttribute("data-row", value.row);
    return node;
  }
  formats() {
    return ["row"].reduce((formats, attrName) => {
      if (this.domNode.hasAttribute(`data-${attrName}`)) {
        formats[attrName] = this.domNode.getAttribute(`data-${attrName}`);
      }
      return formats;
    }, {});
  }
  optimize(context) {
    // optimize function of ShadowBlot
    if (this.statics.requiredContainer && !(this.parent instanceof this.statics.requiredContainer)) {
      this.wrap(this.statics.requiredContainer.blotName);
    }

    // optimize function of ParentBlot
    // note: modified this optimize function because
    // TableRow should not be removed when the length of its children was 0
    this.enforceAllowedChildren();
    if (this.uiNode != null && this.uiNode !== this.domNode.firstChild) {
      this.domNode.insertBefore(this.uiNode, this.domNode.firstChild);
    }

    // optimize function of ContainerBlot
    if (this.children.length > 0 && this.next != null && this.checkMerge()) {
      this.next.moveChildren(this);
      this.next.remove();
    }
  }
  rowOffset() {
    if (this.parent) {
      return this.parent.children.indexOf(this);
    }
    return -1;
  }
  table() {
    return this.parent && this.parent.parent;
  }
}
TableRow.blotName = "table-row";
TableRow.tagName = "TR";
class TableBody extends Container {}
TableBody.blotName = "table-body";
TableBody.tagName = "TBODY";
class TableCol extends table_Block {
  static create(value) {
    let node = super.create(value);
    COL_ATTRIBUTES.forEach(attrName => {
      node.setAttribute(`${attrName}`, value[attrName] || COL_DEFAULT[attrName]);
    });
    return node;
  }
  static formats(domNode) {
    return COL_ATTRIBUTES.reduce((formats, attribute) => {
      if (domNode.hasAttribute(`${attribute}`)) {
        formats[attribute] = domNode.getAttribute(`${attribute}`) || undefined;
      }
      return formats;
    }, {});
  }
  format(name, value) {
    if (COL_ATTRIBUTES.indexOf(name) > -1) {
      this.domNode.setAttribute(`${name}`, value || COL_DEFAULT[name]);
    } else {
      super.format(name, value);
    }
  }
  html() {
    return this.domNode.outerHTML;
  }
}
TableCol.blotName = "table-col";
TableCol.tagName = "col";
class TableColGroup extends Container {}
TableColGroup.blotName = "table-col-group";
TableColGroup.tagName = "colgroup";
class TableContainer extends Container {
  static create() {
    let node = super.create();
    return node;
  }
  constructor(scroll, domNode) {
    super(scroll, domNode);
    this.updateTableWidth();
  }
  updateTableWidth() {
    setTimeout(() => {
      const colGroup = this.colGroup();
      if (!colGroup) return;
      const tableWidth = colGroup.children.reduce((sumWidth, col) => {
        sumWidth = sumWidth + parseInt(col.formats()[TableCol.blotName].width, 10);
        return sumWidth;
      }, 0);
      this.domNode.style.width = `${tableWidth}px`;
    }, 0);
  }
  cells(column) {
    return this.rows().map(row => row.children.at(column));
  }
  colGroup() {
    return this.children.head;
  }
  deleteColumns(compareRect, delIndexes = [], editorWrapper) {
    const [body] = this.descendants(TableBody);
    if (body == null || body.children.head == null) return;
    const tableCells = this.descendants(TableCell);
    const removedCells = [];
    const modifiedCells = [];
    tableCells.forEach(cell => {
      const cellRect = getRelativeRect(cell.domNode.getBoundingClientRect(), editorWrapper);
      if (cellRect.x + ERROR_LIMIT > compareRect.x && cellRect.x1 - ERROR_LIMIT < compareRect.x1) {
        removedCells.push(cell);
      } else if (cellRect.x < compareRect.x + ERROR_LIMIT && cellRect.x1 > compareRect.x1 - ERROR_LIMIT) {
        modifiedCells.push(cell);
      }
    });
    if (removedCells.length === tableCells.length) {
      this.tableDestroy();
      return true;
    }

    // remove the matches column tool cell
    delIndexes.forEach(delIndex => {
      this.colGroup().children.at(delIndexes[0]).remove();
    });
    removedCells.forEach(cell => {
      cell.remove();
    });
    modifiedCells.forEach(cell => {
      const cellColspan = parseInt(cell.formats().colspan, 10);
      const cellWidth = parseInt(cell.formats().width, 10);
      cell.format('colspan', cellColspan - delIndexes.length);
    });
    this.updateTableWidth();
  }
  deleteRow(compareRect, editorWrapper) {
    const [body] = this.descendants(TableBody);
    if (body == null || body.children.head == null) return;
    const tableCells = this.descendants(TableCell);
    const tableRows = this.descendants(TableRow);
    const removedCells = []; // cells to be removed
    const modifiedCells = []; // cells to be modified
    const fallCells = []; // cells to fall into next row

    // compute rows to remove
    // bugfix: #21 There will be a empty tr left if delete the last row of a table
    const removedRows = tableRows.filter(row => {
      const rowRect = getRelativeRect(row.domNode.getBoundingClientRect(), editorWrapper);
      return rowRect.y > compareRect.y - ERROR_LIMIT && rowRect.y1 < compareRect.y1 + ERROR_LIMIT;
    });
    tableCells.forEach(cell => {
      const cellRect = getRelativeRect(cell.domNode.getBoundingClientRect(), editorWrapper);
      if (cellRect.y > compareRect.y - ERROR_LIMIT && cellRect.y1 < compareRect.y1 + ERROR_LIMIT) {
        removedCells.push(cell);
      } else if (cellRect.y < compareRect.y + ERROR_LIMIT && cellRect.y1 > compareRect.y1 - ERROR_LIMIT) {
        modifiedCells.push(cell);
        if (Math.abs(cellRect.y - compareRect.y) < ERROR_LIMIT) {
          fallCells.push(cell);
        }
      }
    });
    if (removedCells.length === tableCells.length) {
      this.tableDestroy();
      return;
    }

    // compute length of removed rows
    const removedRowsLength = this.rows().reduce((sum, row) => {
      let rowRect = getRelativeRect(row.domNode.getBoundingClientRect(), editorWrapper);
      if (rowRect.y > compareRect.y - ERROR_LIMIT && rowRect.y1 < compareRect.y1 + ERROR_LIMIT) {
        sum += 1;
      }
      return sum;
    }, 0);

    // it must excute before the table layout changed with other operation
    fallCells.forEach(cell => {
      const cellRect = getRelativeRect(cell.domNode.getBoundingClientRect(), editorWrapper);
      const nextRow = cell.parent.next;
      const cellsInNextRow = nextRow.children;
      const refCell = cellsInNextRow.reduce((ref, compareCell) => {
        const compareRect = getRelativeRect(compareCell.domNode.getBoundingClientRect(), editorWrapper);
        if (Math.abs(cellRect.x1 - compareRect.x) < ERROR_LIMIT) {
          ref = compareCell;
        }
        return ref;
      }, null);
      nextRow.insertBefore(cell, refCell);
      cell.format('row', nextRow.formats().row);
    });
    removedCells.forEach(cell => {
      cell.remove();
    });
    modifiedCells.forEach(cell => {
      const cellRowspan = parseInt(cell.formats().rowspan, 10);
      cell.format("rowspan", cellRowspan - removedRowsLength);
    });

    // remove selected rows
    removedRows.forEach(row => row.remove());
  }
  tableDestroy() {
    const quill = external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default().find(this.scroll.domNode.parentNode);
    const tableModule = quill.getModule("qtable");
    this.remove();
    tableModule.hideTableTools();
    quill.update((external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default()).sources.USER);
  }
  insertCell(tableRow, ref) {
    const id = cellId();
    const rId = tableRow.formats().row;
    const tableCell = this.scroll.create(TableCell.blotName, Object.assign({}, CELL_DEFAULT, {
      row: rId
    }));
    const cellLine = this.scroll.create(TableCellLine.blotName, {
      row: rId,
      cell: id
    });
    tableCell.appendChild(cellLine);
    if (ref) {
      tableRow.insertBefore(tableCell, ref);
    } else {
      tableRow.appendChild(tableCell);
    }
  }
  insertColumn(compareRect, colIndex, isRight = true, editorWrapper) {
    const [body] = this.descendants(TableBody);
    const [tableColGroup] = this.descendants(TableColGroup);
    const tableCols = this.descendants(TableCol);
    let addAsideCells = [];
    let modifiedCells = [];
    let affectedCells = [];
    if (body == null || body.children.head == null) return;
    const tableCells = this.descendants(TableCell);
    tableCells.forEach(cell => {
      const cellRect = getRelativeRect(cell.domNode.getBoundingClientRect(), editorWrapper);
      if (isRight) {
        if (Math.abs(cellRect.x1 - compareRect.x1) < ERROR_LIMIT) {
          // the right of selected boundary equal to the right of table cell,
          // add a new table cell right aside this table cell
          addAsideCells.push(cell);
        } else if (compareRect.x1 - cellRect.x > ERROR_LIMIT && compareRect.x1 - cellRect.x1 < -ERROR_LIMIT) {
          // the right of selected boundary is inside this table cell
          // colspan of this table cell will increase 1
          modifiedCells.push(cell);
        }
      } else {
        if (Math.abs(cellRect.x - compareRect.x) < ERROR_LIMIT) {
          // left of selected boundary equal to left of table cell,
          // add a new table cell left aside this table cell
          addAsideCells.push(cell);
        } else if (compareRect.x - cellRect.x > ERROR_LIMIT && compareRect.x - cellRect.x1 < -ERROR_LIMIT) {
          // the left of selected boundary is inside this table cell
          // colspan of this table cell will increase 1
          modifiedCells.push(cell);
        }
      }
    });
    addAsideCells.forEach(cell => {
      const ref = isRight ? cell.next : cell;
      const id = cellId();
      const tableRow = cell.parent;
      const rId = tableRow.formats().row;
      const cellFormats = cell.formats();
      const tableCell = this.scroll.create(TableCell.blotName, Object.assign({}, CELL_DEFAULT, {
        row: rId,
        rowspan: cellFormats.rowspan
      }));
      const cellLine = this.scroll.create(TableCellLine.blotName, {
        row: rId,
        cell: id,
        rowspan: cellFormats.rowspan
      });
      tableCell.appendChild(cellLine);
      if (ref) {
        tableRow.insertBefore(tableCell, ref);
      } else {
        tableRow.appendChild(tableCell);
      }
      affectedCells.push(tableCell);
    });

    // insert new tableCol
    const tableCol = this.scroll.create(TableCol.blotName, true);
    let colRef = isRight ? tableCols[colIndex].next : tableCols[colIndex];
    if (colRef) {
      tableColGroup.insertBefore(tableCol, colRef);
    } else {
      tableColGroup.appendChild(tableCol);
    }
    modifiedCells.forEach(cell => {
      const cellColspan = cell.formats().colspan;
      cell.format('colspan', parseInt(cellColspan, 10) + 1);
      affectedCells.push(cell);
    });
    affectedCells.sort((cellA, cellB) => {
      let y1 = cellA.domNode.getBoundingClientRect().y;
      let y2 = cellB.domNode.getBoundingClientRect().y;
      return y1 - y2;
    });
    this.updateTableWidth();
    return affectedCells;
  }
  insertRow(compareRect, isDown, editorWrapper) {
    const [body] = this.descendants(TableBody);
    if (body == null || body.children.head == null) return;
    const tableCells = this.descendants(TableCell);
    const rId = rowId();
    const newRow = this.scroll.create(TableRow.blotName, {
      row: rId
    });
    let addBelowCells = [];
    let modifiedCells = [];
    let affectedCells = [];
    tableCells.forEach(cell => {
      const cellRect = getRelativeRect(cell.domNode.getBoundingClientRect(), editorWrapper);
      if (isDown) {
        if (Math.abs(cellRect.y1 - compareRect.y1) < ERROR_LIMIT) {
          addBelowCells.push(cell);
        } else if (compareRect.y1 - cellRect.y > ERROR_LIMIT && compareRect.y1 - cellRect.y1 < -ERROR_LIMIT) {
          modifiedCells.push(cell);
        }
      } else {
        if (Math.abs(cellRect.y - compareRect.y) < ERROR_LIMIT) {
          addBelowCells.push(cell);
        } else if (compareRect.y - cellRect.y > ERROR_LIMIT && compareRect.y - cellRect.y1 < -ERROR_LIMIT) {
          modifiedCells.push(cell);
        }
      }
    });

    // ordered table cells with rect.x, fix error for inserting
    // new table cell in complicated table with wrong order.
    const sortFunc = (cellA, cellB) => {
      let x1 = cellA.domNode.getBoundingClientRect().x;
      let x2 = cellB.domNode.getBoundingClientRect().x;
      return x1 - x2;
    };
    addBelowCells.sort(sortFunc);
    addBelowCells.forEach(cell => {
      const cId = cellId();
      const cellFormats = cell.formats();
      const tableCell = this.scroll.create(TableCell.blotName, Object.assign({}, CELL_DEFAULT, {
        row: rId,
        colspan: cellFormats.colspan
      }));
      const cellLine = this.scroll.create(TableCellLine.blotName, {
        row: rId,
        cell: cId,
        colspan: cellFormats.colspan
      });
      const empty = this.scroll.create(Break.blotName);
      cellLine.appendChild(empty);
      tableCell.appendChild(cellLine);
      newRow.appendChild(tableCell);
      affectedCells.push(tableCell);
    });
    modifiedCells.forEach(cell => {
      const cellRowspan = parseInt(cell.formats().rowspan, 10);
      cell.format("rowspan", cellRowspan + 1);
      affectedCells.push(cell);
    });
    const refRow = this.rows().find(row => {
      let rowRect = getRelativeRect(row.domNode.getBoundingClientRect(), editorWrapper);
      if (isDown) {
        return Math.abs(rowRect.y - compareRect.y - compareRect.height) < ERROR_LIMIT;
      } else {
        return Math.abs(rowRect.y - compareRect.y) < ERROR_LIMIT;
      }
    });
    body.insertBefore(newRow, refRow);

    // reordering affectedCells
    affectedCells.sort(sortFunc);
    return affectedCells;
  }
  mergeCells(compareRect, mergingCells, rowspan, colspan, editorWrapper) {
    const mergedCell = mergingCells.reduce((result, tableCell, index) => {
      if (index !== 0) {
        result && tableCell.moveChildren(result);
        tableCell.remove();
      } else {
        tableCell.format('colspan', colspan);
        tableCell.format('rowspan', rowspan);
        result = tableCell;
      }
      return result;
    }, null);
    let rowId = mergedCell.domNode.getAttribute('data-row');
    let cellId = mergedCell.children.head.domNode.getAttribute('data-cell');
    mergedCell.children.forEach(cellLine => {
      cellLine.format('cell', cellId);
      cellLine.format('row', rowId);
      cellLine.format('colspan', colspan);
      cellLine.format('rowspan', rowspan);
    });
    return mergedCell;
  }
  unmergeCells(unmergingCells, editorWrapper) {
    let cellFormats = {};
    let cellRowspan = 1;
    let cellColspan = 1;
    unmergingCells.forEach(tableCell => {
      cellFormats = tableCell.formats();
      cellRowspan = cellFormats.rowspan;
      cellColspan = cellFormats.colspan;
      if (cellColspan > 1) {
        let ref = tableCell.next;
        let row = tableCell.row();
        tableCell.format('colspan', 1);
        for (let i = cellColspan; i > 1; i--) {
          this.insertCell(row, ref);
        }
      }
      if (cellRowspan > 1) {
        let i = cellRowspan;
        let nextRow = tableCell.row().next;
        while (i > 1) {
          let refInNextRow = nextRow.children.reduce((result, cell) => {
            let compareRect = getRelativeRect(tableCell.domNode.getBoundingClientRect(), editorWrapper);
            let cellRect = getRelativeRect(cell.domNode.getBoundingClientRect(), editorWrapper);
            if (Math.abs(compareRect.x1 - cellRect.x) < ERROR_LIMIT) {
              result = cell;
            }
            return result;
          }, null);
          for (let i = cellColspan; i > 0; i--) {
            this.insertCell(nextRow, refInNextRow);
          }
          i -= 1;
          nextRow = nextRow.next;
        }
        tableCell.format('rowspan', 1);
      }
    });
  }
  rows() {
    const body = this.children.tail;
    if (body == null) return [];
    return body.children.map(row => row);
  }
}
TableContainer.blotName = "table-container";
TableContainer.className = "quill-qtable";
TableContainer.tagName = "TABLE";
class TableViewWrapper extends Container {
  constructor(scroll, domNode) {
    super(scroll, domNode);
    const quill = external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default().find(scroll.domNode.parentNode);
    domNode.addEventListener('scroll', e => {
      const tableModule = quill.getModule('qtable');
      if (tableModule.columnTool) {
        tableModule.columnTool.domNode.scrollLeft = e.target.scrollLeft;
      }
      if (tableModule.tableSelection && tableModule.tableSelection.selectedTds.length > 0) {
        tableModule.tableSelection.repositionHelpLines();
      }
    }, false);
  }
  table() {
    return this.children.head;
  }
}
TableViewWrapper.blotName = "table-view";
TableViewWrapper.className = "quill-qtable-wrapper";
TableViewWrapper.tagName = "DIV";
TableViewWrapper.allowedChildren = [TableContainer];
TableContainer.requiredContainer = TableViewWrapper;
TableContainer.allowedChildren = [TableBody, TableColGroup];
TableBody.requiredContainer = TableContainer;
TableBody.allowedChildren = [TableRow];
TableRow.requiredContainer = TableBody;
TableRow.allowedChildren = [TableCell];
TableCell.requiredContainer = TableRow;
TableCell.allowedChildren = [TableCellLine, header];
TableCellLine.requiredContainer = TableCell;
TableColGroup.allowedChildren = [TableCol];
TableColGroup.requiredContainer = TableContainer;
TableCol.requiredContainer = TableColGroup;
function rowId() {
  const id = Math.random().toString(36).slice(2, 6);
  return `row-${id}`;
}
function cellId() {
  const id = Math.random().toString(36).slice(2, 6);
  return `cell-${id}`;
}

;// ./src/modules/table-selection.js



const table_selection_PRIMARY_COLOR = '#01C0C8';
const LINE_POSITIONS = ['left', 'right', 'top', 'bottom'];
const table_selection_ERROR_LIMIT = 2;
class TableSelection {
  constructor(table, quill, options) {
    if (!table) return null;
    this.table = table;
    this.quill = quill;
    this.options = options;
    this.boundary = {}; // params for selected square
    this.selectedTds = []; // array for selected table-cells
    this.dragging = false;
    this.selectingHandler = this.mouseDownHandler.bind(this);
    this.clearSelectionHandler = this.clearSelection.bind(this);
    this.helpLinesInitial();
    this.quill.root.addEventListener('mousedown', this.selectingHandler, false);
    this.quill.on('text-change', this.clearSelectionHandler);
  }
  helpLinesInitial() {
    let parent = this.quill.root.parentNode;
    LINE_POSITIONS.forEach(direction => {
      this[direction] = document.createElement('div');
      this[direction].classList.add('qlbt-selection-line');
      this[direction].classList.add('qlbt-selection-line-' + direction);
      css(this[direction], {
        position: 'absolute',
        display: 'none',
        'background-color': table_selection_PRIMARY_COLOR
      });
      parent.appendChild(this[direction]);
    });
  }
  mouseDownHandler(e) {
    if (e.button !== 0 || !e.target.closest(".quill-qtable")) return;
    this.quill.root.addEventListener('mousemove', mouseMoveHandler, false);
    this.quill.root.addEventListener('mouseup', mouseUpHandler, false);
    const self = this;
    const startTd = e.target.closest('td[data-row]');
    const startTdRect = getRelativeRect(startTd.getBoundingClientRect(), this.quill.root.parentNode);
    this.dragging = true;
    this.boundary = computeBoundaryFromRects(startTdRect, startTdRect);
    this.correctBoundary();
    this.selectedTds = this.computeSelectedTds();
    this.repositionHelpLines();
    function mouseMoveHandler(e) {
      if (e.button !== 0 || !e.target.closest(".quill-qtable")) return;
      const endTd = e.target.closest('td[data-row]');
      const endTdRect = getRelativeRect(endTd.getBoundingClientRect(), self.quill.root.parentNode);
      self.boundary = computeBoundaryFromRects(startTdRect, endTdRect);
      self.correctBoundary();
      self.selectedTds = self.computeSelectedTds();
      self.repositionHelpLines();

      // avoid select text in multiple table-cell
      if (startTd !== endTd) {
        self.quill.blur();
      }
    }
    function mouseUpHandler(e) {
      self.quill.root.removeEventListener('mousemove', mouseMoveHandler, false);
      self.quill.root.removeEventListener('mouseup', mouseUpHandler, false);
      self.dragging = false;
    }
  }
  correctBoundary() {
    const tableContainer = external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default().find(this.table);
    const tableCells = tableContainer.descendants(TableCell);
    tableCells.forEach(tableCell => {
      let {
        x,
        y,
        width,
        height
      } = getRelativeRect(tableCell.domNode.getBoundingClientRect(), this.quill.root.parentNode);
      let isCellIntersected = (x + table_selection_ERROR_LIMIT >= this.boundary.x && x + table_selection_ERROR_LIMIT <= this.boundary.x1 || x - table_selection_ERROR_LIMIT + width >= this.boundary.x && x - table_selection_ERROR_LIMIT + width <= this.boundary.x1) && (y + table_selection_ERROR_LIMIT >= this.boundary.y && y + table_selection_ERROR_LIMIT <= this.boundary.y1 || y - table_selection_ERROR_LIMIT + height >= this.boundary.y && y - table_selection_ERROR_LIMIT + height <= this.boundary.y1);
      if (isCellIntersected) {
        this.boundary = computeBoundaryFromRects(this.boundary, {
          x,
          y,
          width,
          height
        });
      }
    });
  }
  computeSelectedTds() {
    const tableContainer = external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default().find(this.table);
    const tableCells = tableContainer.descendants(TableCell);
    return tableCells.reduce((selectedCells, tableCell) => {
      let {
        x,
        y,
        width,
        height
      } = getRelativeRect(tableCell.domNode.getBoundingClientRect(), this.quill.root.parentNode);
      let isCellIncluded = x + table_selection_ERROR_LIMIT >= this.boundary.x && x - table_selection_ERROR_LIMIT + width <= this.boundary.x1 && y + table_selection_ERROR_LIMIT >= this.boundary.y && y - table_selection_ERROR_LIMIT + height <= this.boundary.y1;
      if (isCellIncluded) {
        selectedCells.push(tableCell);
      }
      return selectedCells;
    }, []);
  }
  repositionHelpLines() {
    const tableViewScrollLeft = this.table.parentNode.scrollLeft;
    css(this.left, {
      display: 'block',
      left: `${this.boundary.x - tableViewScrollLeft - 1}px`,
      top: `${this.boundary.y}px`,
      height: `${this.boundary.height + 1}px`,
      width: '1px'
    });
    css(this.right, {
      display: 'block',
      left: `${this.boundary.x1 - tableViewScrollLeft}px`,
      top: `${this.boundary.y}px`,
      height: `${this.boundary.height + 1}px`,
      width: '1px'
    });
    css(this.top, {
      display: 'block',
      left: `${this.boundary.x - 1 - tableViewScrollLeft}px`,
      top: `${this.boundary.y}px`,
      width: `${this.boundary.width + 1}px`,
      height: '1px'
    });
    css(this.bottom, {
      display: 'block',
      left: `${this.boundary.x - 1 - tableViewScrollLeft}px`,
      top: `${this.boundary.y1 + 1}px`,
      width: `${this.boundary.width + 1}px`,
      height: '1px'
    });
  }

  // based on selectedTds compute positions of help lines
  // It is useful when selectedTds are not changed
  refreshHelpLinesPosition() {
    const startRect = getRelativeRect(this.selectedTds[0].domNode.getBoundingClientRect(), this.quill.root.parentNode);
    const endRect = getRelativeRect(this.selectedTds[this.selectedTds.length - 1].domNode.getBoundingClientRect(), this.quill.root.parentNode);
    this.boundary = computeBoundaryFromRects(startRect, endRect);
    this.repositionHelpLines();
  }
  destroy() {
    LINE_POSITIONS.forEach(direction => {
      this[direction].remove();
      this[direction] = null;
    });
    this.quill.root.removeEventListener('mousedown', this.selectingHandler, false);
    this.quill.off('text-change', this.clearSelectionHandler);
    return null;
  }
  setSelection(startRect, endRect) {
    this.boundary = computeBoundaryFromRects(getRelativeRect(startRect, this.quill.root.parentNode), getRelativeRect(endRect, this.quill.root.parentNode));
    this.correctBoundary();
    this.selectedTds = this.computeSelectedTds();
    this.repositionHelpLines();
  }
  clearSelection() {
    this.boundary = {};
    this.selectedTds = [];
    LINE_POSITIONS.forEach(direction => {
      this[direction] && css(this[direction], {
        display: 'none'
      });
    });
  }
}
function computeBoundaryFromRects(startRect, endRect) {
  let x = Math.min(startRect.x, endRect.x, startRect.x + startRect.width - 1, endRect.x + endRect.width - 1);
  let x1 = Math.max(startRect.x, endRect.x, startRect.x + startRect.width - 1, endRect.x + endRect.width - 1);
  let y = Math.min(startRect.y, endRect.y, startRect.y + startRect.height - 1, endRect.y + endRect.height - 1);
  let y1 = Math.max(startRect.y, endRect.y, startRect.y + startRect.height - 1, endRect.y + endRect.height - 1);
  let width = x1 - x;
  let height = y1 - y;
  return {
    x,
    x1,
    y,
    y1,
    width,
    height
  };
}
;// ./src/assets/icons/table-insert-column-after.svg
// Module
var code = `<?xml version="1.0" encoding="UTF-8"?> <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 20 20" version="1.1"> <g id="surface1"> <path style="stroke:none;fill-rule:evenodd;fill:rgb(12.156863%,13.725491%,15.686275%);fill-opacity:1" d="M 18.125 0 C 19.160156 0 20 0.839844 20 1.875 L 20 18.125 C 20 19.160156 19.160156 20 18.125 20 L 1.875 20 C 0.839844 20 0 19.160156 0 18.125 L 0 1.875 C 0 0.839844 0.839844 0 1.875 0 Z M 18.75 18.125 L 18.75 1.875 C 18.75 1.53125 18.46875 1.25 18.125 1.25 L 7.5 1.25 L 7.5 18.75 L 18.125 18.75 C 18.46875 18.75 18.75 18.46875 18.75 18.125 Z M 1.875 18.75 L 6.25 18.75 L 6.25 13.75 L 1.25 13.75 L 1.25 18.125 C 1.25 18.46875 1.53125 18.75 1.875 18.75 Z M 1.25 12.5 L 6.25 12.5 L 6.25 7.5 L 1.25 7.5 Z M 1.875 1.25 C 1.53125 1.25 1.25 1.53125 1.25 1.875 L 1.25 6.25 L 6.25 6.25 L 6.25 1.25 Z M 11.910156 5.3125 L 14.410156 5.3125 L 14.410156 8.75 L 17.847656 8.75 L 17.847656 11.25 L 14.410156 11.25 L 14.410156 14.6875 L 11.910156 14.6875 L 11.910156 11.25 L 8.472656 11.25 L 8.472656 8.75 L 11.910156 8.75 Z M 11.910156 5.3125 "/> </g> </svg> `;
// Exports
/* harmony default export */ const table_insert_column_after = (code);
;// ./src/assets/icons/table-insert-column-before.svg
// Module
var table_insert_column_before_code = `<?xml version="1.0" encoding="UTF-8"?> <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 20 20" version="1.1"> <g id="surface1"> <path style="stroke:none;fill-rule:evenodd;fill:rgb(12.156863%,13.725491%,15.686275%);fill-opacity:1" d="M 1.25 1.875 L 1.25 18.125 C 1.25 18.46875 1.53125 18.75 1.875 18.75 L 12.5 18.75 L 12.5 1.25 L 1.875 1.25 C 1.53125 1.25 1.25 1.53125 1.25 1.875 Z M 18.125 1.25 L 13.75 1.25 L 13.75 6.25 L 18.75 6.25 L 18.75 1.875 C 18.75 1.53125 18.46875 1.25 18.125 1.25 Z M 18.75 7.5 L 13.75 7.5 L 13.75 12.5 L 18.75 12.5 Z M 18.125 18.75 C 18.46875 18.75 18.75 18.46875 18.75 18.125 L 18.75 13.75 L 13.75 13.75 L 13.75 18.75 Z M 1.875 20 C 0.839844 20 0 19.160156 0 18.125 L 0 1.875 C 0 0.839844 0.839844 0 1.875 0 L 18.125 0 C 19.160156 0 20 0.839844 20 1.875 L 20 18.125 C 20 19.160156 19.160156 20 18.125 20 Z M 8.089844 14.6875 L 5.589844 14.6875 L 5.589844 11.25 L 2.152344 11.25 L 2.152344 8.75 L 5.589844 8.75 L 5.589844 5.3125 L 8.089844 5.3125 L 8.089844 8.75 L 11.527344 8.75 L 11.527344 11.25 L 8.089844 11.25 Z M 8.089844 14.6875 "/> </g> </svg> `;
// Exports
/* harmony default export */ const table_insert_column_before = (table_insert_column_before_code);
;// ./src/assets/icons/table-insert-row-after.svg
// Module
var table_insert_row_after_code = `<?xml version="1.0" encoding="UTF-8"?> <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 20 20" version="1.1"> <g id="surface1"> <path style="stroke:none;fill-rule:evenodd;fill:rgb(12.156863%,13.725491%,15.686275%);fill-opacity:1" d="M 1.875 18.75 L 18.125 18.75 C 18.46875 18.75 18.75 18.46875 18.75 18.125 L 18.75 7.5 L 1.25 7.5 L 1.25 18.125 C 1.25 18.46875 1.53125 18.75 1.875 18.75 Z M 1.25 1.875 L 1.25 6.25 L 6.25 6.25 L 6.25 1.25 L 1.875 1.25 C 1.53125 1.25 1.25 1.53125 1.25 1.875 Z M 7.5 1.25 L 7.5 6.25 L 12.5 6.25 L 12.5 1.25 Z M 18.75 1.875 C 18.75 1.53125 18.46875 1.25 18.125 1.25 L 13.75 1.25 L 13.75 6.25 L 18.75 6.25 Z M 20 18.125 C 20 19.160156 19.160156 20 18.125 20 L 1.875 20 C 0.839844 20 0 19.160156 0 18.125 L 0 1.875 C 0 0.839844 0.839844 0 1.875 0 L 18.125 0 C 19.160156 0 20 0.839844 20 1.875 Z M 14.6875 11.910156 L 14.6875 14.410156 L 11.25 14.410156 L 11.25 17.847656 L 8.75 17.847656 L 8.75 14.410156 L 5.3125 14.410156 L 5.3125 11.910156 L 8.75 11.910156 L 8.75 8.472656 L 11.25 8.472656 L 11.25 11.910156 Z M 14.6875 11.910156 "/> </g> </svg> `;
// Exports
/* harmony default export */ const table_insert_row_after = (table_insert_row_after_code);
;// ./src/assets/icons/table-insert-row-above.svg
// Module
var table_insert_row_above_code = `<?xml version="1.0" encoding="UTF-8"?> <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 20 20" version="1.1"> <g id="surface1"> <path style="stroke:none;fill-rule:evenodd;fill:rgb(12.156863%,13.725491%,15.686275%);fill-opacity:1" d="M 18.125 1.25 L 1.875 1.25 C 1.53125 1.25 1.25 1.53125 1.25 1.875 L 1.25 12.5 L 18.75 12.5 L 18.75 1.875 C 18.75 1.53125 18.46875 1.25 18.125 1.25 Z M 18.75 18.125 L 18.75 13.75 L 13.75 13.75 L 13.75 18.75 L 18.125 18.75 C 18.46875 18.75 18.75 18.46875 18.75 18.125 Z M 12.5 18.75 L 12.5 13.75 L 7.5 13.75 L 7.5 18.75 Z M 1.25 18.125 C 1.25 18.46875 1.53125 18.75 1.875 18.75 L 6.25 18.75 L 6.25 13.75 L 1.25 13.75 Z M 0 1.875 C 0 0.839844 0.839844 0 1.875 0 L 18.125 0 C 19.160156 0 20 0.839844 20 1.875 L 20 18.125 C 20 19.160156 19.160156 20 18.125 20 L 1.875 20 C 0.839844 20 0 19.160156 0 18.125 Z M 5.3125 8.089844 L 5.3125 5.589844 L 8.75 5.589844 L 8.75 2.152344 L 11.25 2.152344 L 11.25 5.589844 L 14.6875 5.589844 L 14.6875 8.089844 L 11.25 8.089844 L 11.25 11.527344 L 8.75 11.527344 L 8.75 8.089844 Z M 5.3125 8.089844 "/> </g> </svg> `;
// Exports
/* harmony default export */ const table_insert_row_above = (table_insert_row_above_code);
;// ./src/assets/icons/table-merge-cells.svg
// Module
var table_merge_cells_code = `<?xml version="1.0" encoding="UTF-8"?> <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 20 20" version="1.1"> <g id="surface1"> <path style="stroke:none;fill-rule:evenodd;fill:rgb(12.156863%,13.725491%,15.686275%);fill-opacity:1" d="M 18.125 0 C 19.160156 0 20 0.839844 20 1.875 L 20 18.125 C 20 19.160156 19.160156 20 18.125 20 L 1.875 20 C 0.839844 20 0 19.160156 0 18.125 L 0 1.875 C 0 0.839844 0.839844 0 1.875 0 Z M 18.75 6.25 L 18.75 1.875 C 18.75 1.53125 18.46875 1.25 18.125 1.25 L 13.75 1.25 L 13.75 6.25 Z M 18.75 17.34375 L 18.75 7.5 L 7.5 7.5 L 7.5 18.75 L 17.34375 18.75 C 18.117188 18.75 18.75 18.117188 18.75 17.34375 Z M 7.5 6.25 L 12.5 6.25 L 12.5 1.25 L 7.5 1.25 Z M 6.25 6.25 L 6.25 1.25 L 1.875 1.25 C 1.53125 1.25 1.25 1.53125 1.25 1.875 L 1.25 6.25 Z M 1.25 12.5 L 6.25 12.5 L 6.25 7.5 L 1.25 7.5 Z M 6.25 18.75 L 6.25 13.75 L 1.25 13.75 L 1.25 18.125 C 1.25 18.46875 1.53125 18.75 1.875 18.75 Z M 6.25 18.75 "/> </g> </svg> `;
// Exports
/* harmony default export */ const table_merge_cells = (table_merge_cells_code);
;// ./src/assets/icons/table-split-cells.svg
// Module
var table_split_cells_code = `<?xml version="1.0" encoding="UTF-8"?> <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 20 20" version="1.1"> <g id="surface1"> <path style="stroke:none;fill-rule:evenodd;fill:rgb(12.156863%,13.725491%,15.686275%);fill-opacity:1" d="M 18.125 0 C 19.160156 0 20 0.839844 20 1.875 L 20 18.125 C 20 19.160156 19.160156 20 18.125 20 L 1.875 20 C 0.839844 20 0 19.160156 0 18.125 L 0 1.875 C 0 0.839844 0.839844 0 1.875 0 Z M 18.75 7.5 L 7.5 7.5 L 7.5 18.75 L 17.34375 18.75 C 18.117188 18.75 18.75 18.117188 18.75 17.34375 Z M 6.25 13.75 L 1.25 13.75 L 1.25 18.125 C 1.25 18.46875 1.53125 18.75 1.875 18.75 L 6.25 18.75 Z M 6.25 7.5 L 1.25 7.5 L 1.25 12.5 L 6.25 12.5 Z M 18.125 1.25 L 13.75 1.25 L 13.75 6.25 L 18.75 6.25 L 18.75 1.875 C 18.75 1.53125 18.46875 1.25 18.125 1.25 Z M 12.5 1.25 L 7.5 1.25 L 7.5 6.25 L 12.5 6.25 Z M 6.25 1.25 L 1.875 1.25 C 1.53125 1.25 1.25 1.53125 1.25 1.875 L 1.25 6.25 L 6.25 6.25 Z M 18.0625 10.015625 L 16.296875 8.25 L 13.121094 11.425781 L 9.941406 8.25 L 8.175781 10.015625 L 11.355469 13.191406 L 8.175781 16.371094 L 9.941406 18.136719 L 13.121094 14.957031 L 16.296875 18.136719 L 18.0625 16.371094 L 14.886719 13.191406 Z M 18.0625 10.015625 "/> </g> </svg> `;
// Exports
/* harmony default export */ const table_split_cells = (table_split_cells_code);
;// ./src/assets/icons/table-delete-column.svg
// Module
var table_delete_column_code = `<?xml version="1.0" encoding="UTF-8"?> <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 20 20" version="1.1"> <g id="surface1"> <path style="stroke:none;fill-rule:evenodd;fill:rgb(12.156863%,13.725491%,15.686275%);fill-opacity:1" d="M 18.75 18.125 C 18.75 18.46875 18.46875 18.75 18.125 18.75 L 13.75 18.75 L 13.75 15.625 L 12.5 15.625 L 12.5 18.75 L 7.5 18.75 L 7.5 15.625 L 6.25 15.625 L 6.25 18.75 L 1.875 18.75 C 1.53125 18.75 1.25 18.46875 1.25 18.125 L 1.25 1.875 C 1.25 1.53125 1.53125 1.25 1.875 1.25 L 6.25 1.25 L 6.25 4.375 L 7.5 4.375 L 7.5 1.25 L 12.5 1.25 L 12.5 4.375 L 13.75 4.375 L 13.75 1.25 L 18.125 1.25 C 18.46875 1.25 18.75 1.53125 18.75 1.875 Z M 18.125 0 L 1.875 0 C 0.839844 0 0 0.839844 0 1.875 L 0 18.125 C 0 19.160156 0.839844 20 1.875 20 L 18.125 20 C 19.160156 20 20 19.160156 20 18.125 L 20 1.875 C 20 0.839844 19.160156 0 18.125 0 Z M 14.945312 6.820312 L 13.179688 5.054688 L 10 8.234375 L 6.820312 5.054688 L 5.054688 6.820312 L 8.234375 10 L 5.054688 13.179688 L 6.820312 14.945312 L 10 11.765625 L 13.179688 14.945312 L 14.945312 13.179688 L 11.765625 10 Z M 14.945312 6.820312 "/> </g> </svg> `;
// Exports
/* harmony default export */ const table_delete_column = (table_delete_column_code);
;// ./src/assets/icons/table-delete-row.svg
// Module
var table_delete_row_code = `<?xml version="1.0" encoding="UTF-8"?> <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 20 20" version="1.1"> <g id="surface1"> <path style="stroke:none;fill-rule:evenodd;fill:rgb(12.156863%,13.725491%,15.686275%);fill-opacity:1" d="M 1.875 18.75 C 1.53125 18.75 1.25 18.46875 1.25 18.125 L 1.25 13.75 L 4.375 13.75 L 4.375 12.5 L 1.25 12.5 L 1.25 7.5 L 4.375 7.5 L 4.375 6.25 L 1.25 6.25 L 1.25 1.875 C 1.25 1.53125 1.53125 1.25 1.875 1.25 L 18.125 1.25 C 18.46875 1.25 18.75 1.53125 18.75 1.875 L 18.75 6.25 L 15.625 6.25 L 15.625 7.5 L 18.75 7.5 L 18.75 12.5 L 15.625 12.5 L 15.625 13.75 L 18.75 13.75 L 18.75 18.125 C 18.75 18.46875 18.46875 18.75 18.125 18.75 Z M 20 18.125 L 20 1.875 C 20 0.839844 19.160156 0 18.125 0 L 1.875 0 C 0.839844 0 0 0.839844 0 1.875 L 0 18.125 C 0 19.160156 0.839844 20 1.875 20 L 18.125 20 C 19.160156 20 20 19.160156 20 18.125 Z M 5.054688 13.175781 L 6.824219 14.945312 L 10 11.765625 L 13.179688 14.945312 L 14.949219 13.175781 L 11.769531 10 L 14.949219 6.820312 L 13.179688 5.050781 L 10 8.230469 L 6.824219 5.050781 L 5.054688 6.820312 L 8.234375 10 Z M 5.054688 13.175781 "/> </g> </svg> `;
// Exports
/* harmony default export */ const table_delete_row = (table_delete_row_code);
;// ./src/assets/icons/table-delete-table.svg
// Module
var table_delete_table_code = `<?xml version="1.0" encoding="UTF-8"?> <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 20 20" version="1.1"> <g id="surface1"> <path style="stroke:none;fill-rule:evenodd;fill:rgb(12.156863%,13.725491%,15.686275%);fill-opacity:1" d="M 18.75 18.125 C 18.75 18.46875 18.46875 18.75 18.125 18.75 L 1.875 18.75 C 1.53125 18.75 1.25 18.46875 1.25 18.125 L 1.25 1.875 C 1.25 1.53125 1.53125 1.25 1.875 1.25 L 18.125 1.25 C 18.46875 1.25 18.75 1.53125 18.75 1.875 Z M 18.125 0 L 1.875 0 C 0.839844 0 0 0.839844 0 1.875 L 0 18.125 C 0 19.160156 0.839844 20 1.875 20 L 18.125 20 C 19.160156 20 20 19.160156 20 18.125 L 20 1.875 C 20 0.839844 19.160156 0 18.125 0 Z M 15.675781 2.554688 L 10 8.230469 L 4.324219 2.554688 L 2.554688 4.324219 L 8.234375 10 L 2.554688 15.675781 L 4.324219 17.445312 L 10 11.765625 L 15.675781 17.445312 L 17.445312 15.675781 L 11.765625 10 L 17.445312 4.324219 Z M 15.675781 2.554688 "/> </g> </svg> `;
// Exports
/* harmony default export */ const table_delete_table = (table_delete_table_code);
;// ./src/modules/table-operation-menu.js



// svg icons









const MENU_MIN_HEIHGT = 150;
const MENU_WIDTH = 200;
const table_operation_menu_ERROR_LIMIT = 5;
const DEFAULT_CELL_COLORS = ['#FFFFFF', '#08090A', '#EBEBEB', '#00695f', '#ff1744', '#FFEB3B', '#ff5722'];
const DEFAULT_COLOR_SUBTITLE = 'Background Colors';
const DEFAULT_TEXT_COLORS = ['#FFFFFF', '#08090A', '#EBEBEB', '#00695f', '#ff1744', '#FFEB3B', '#ff5722'];
const DEFAULT_TEXT_COLOR_SUBTITLE = 'Text Colors';
const DEFAULT_LABEL_TEXT_COLORS = ['#FFFFFF', '#08090A', '#EBEBEB', '#00695f', '#ff1744', '#FFEB3B', '#ff5722'];
const DEFAULT_LABEL_TEXT_COLOR_SUBTITLE = 'Label Text Colors';
const MENU_ITEMS_DEFAULT = {
  insertColumnRight: {
    text: 'Insert column right',
    iconSrc: table_insert_column_after,
    handler() {
      const tableContainer = external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default().find(this.table);
      let colIndex = getColToolCellIndexByBoundary(this.columnToolCells, this.boundary, (cellRect, boundary) => {
        return Math.abs(cellRect.x + cellRect.width - boundary.x1) <= table_operation_menu_ERROR_LIMIT;
      }, this.quill.root.parentNode);
      const newColumn = tableContainer.insertColumn(this.boundary, colIndex, true, this.quill.root.parentNode);
      this.tableColumnTool.updateToolCells();
      this.quill.update((external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default()).sources.USER);
      this.quill.setSelection(this.quill.getIndex(newColumn[0]), 0, (external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default()).sources.SILENT);
      this.tableSelection.setSelection(newColumn[0].domNode.getBoundingClientRect(), newColumn[0].domNode.getBoundingClientRect());
    }
  },
  insertColumnLeft: {
    text: 'Insert column left',
    iconSrc: table_insert_column_before,
    handler() {
      const tableContainer = external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default().find(this.table);
      let colIndex = getColToolCellIndexByBoundary(this.columnToolCells, this.boundary, (cellRect, boundary) => {
        return Math.abs(cellRect.x - boundary.x) <= table_operation_menu_ERROR_LIMIT;
      }, this.quill.root.parentNode);
      const newColumn = tableContainer.insertColumn(this.boundary, colIndex, false, this.quill.root.parentNode);
      this.tableColumnTool.updateToolCells();
      this.quill.update((external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default()).sources.USER);
      this.quill.setSelection(this.quill.getIndex(newColumn[0]), 0, (external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default()).sources.SILENT);
      this.tableSelection.setSelection(newColumn[0].domNode.getBoundingClientRect(), newColumn[0].domNode.getBoundingClientRect());
    }
  },
  insertRowUp: {
    text: 'Insert row up',
    iconSrc: table_insert_row_after,
    handler() {
      const tableContainer = external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default().find(this.table);
      const affectedCells = tableContainer.insertRow(this.boundary, false, this.quill.root.parentNode);
      this.quill.update((external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default()).sources.USER);
      this.quill.setSelection(this.quill.getIndex(affectedCells[0]), 0, (external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default()).sources.SILENT);
      this.tableSelection.setSelection(affectedCells[0].domNode.getBoundingClientRect(), affectedCells[0].domNode.getBoundingClientRect());
    }
  },
  insertRowDown: {
    text: 'Insert row down',
    iconSrc: table_insert_row_above,
    handler() {
      const tableContainer = external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default().find(this.table);
      const affectedCells = tableContainer.insertRow(this.boundary, true, this.quill.root.parentNode);
      this.quill.update((external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default()).sources.USER);
      this.quill.setSelection(this.quill.getIndex(affectedCells[0]), 0, (external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default()).sources.SILENT);
      this.tableSelection.setSelection(affectedCells[0].domNode.getBoundingClientRect(), affectedCells[0].domNode.getBoundingClientRect());
    }
  },
  mergeCells: {
    text: 'Merge selected cells',
    iconSrc: table_merge_cells,
    handler() {
      const tableContainer = external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default().find(this.table);
      // compute merged Cell rowspan, equal to length of selected rows
      const rowspan = tableContainer.rows().reduce((sum, row) => {
        let rowRect = getRelativeRect(row.domNode.getBoundingClientRect(), this.quill.root.parentNode);
        if (rowRect.y > this.boundary.y - table_operation_menu_ERROR_LIMIT && rowRect.y + rowRect.height < this.boundary.y + this.boundary.height + table_operation_menu_ERROR_LIMIT) {
          sum += 1;
        }
        return sum;
      }, 0);

      // compute merged cell colspan, equal to length of selected cols
      const colspan = this.columnToolCells.reduce((sum, cell) => {
        let cellRect = getRelativeRect(cell.getBoundingClientRect(), this.quill.root.parentNode);
        if (cellRect.x > this.boundary.x - table_operation_menu_ERROR_LIMIT && cellRect.x + cellRect.width < this.boundary.x + this.boundary.width + table_operation_menu_ERROR_LIMIT) {
          sum += 1;
        }
        return sum;
      }, 0);
      const mergedCell = tableContainer.mergeCells(this.boundary, this.selectedTds, rowspan, colspan, this.quill.root.parentNode);
      this.quill.update((external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default()).sources.USER);
      this.tableSelection.setSelection(mergedCell.domNode.getBoundingClientRect(), mergedCell.domNode.getBoundingClientRect());
    }
  },
  unmergeCells: {
    text: 'Unmerge cells',
    iconSrc: table_split_cells,
    handler() {
      const tableContainer = external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default().find(this.table);
      tableContainer.unmergeCells(this.selectedTds, this.quill.root.parentNode);
      this.quill.update((external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default()).sources.USER);
      this.tableSelection.clearSelection();
    }
  },
  deleteColumn: {
    text: 'Delete selected columns',
    iconSrc: table_delete_column,
    handler() {
      const tableContainer = external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default().find(this.table);
      let colIndexes = getColToolCellIndexesByBoundary(this.columnToolCells, this.boundary, (cellRect, boundary) => {
        return cellRect.x + table_operation_menu_ERROR_LIMIT > boundary.x && cellRect.x + cellRect.width - table_operation_menu_ERROR_LIMIT < boundary.x1;
      }, this.quill.root.parentNode);
      let isDeleteTable = tableContainer.deleteColumns(this.boundary, colIndexes, this.quill.root.parentNode);
      if (!isDeleteTable) {
        this.tableColumnTool.updateToolCells();
        this.quill.update((external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default()).sources.USER);
        this.tableSelection.clearSelection();
      }
    }
  },
  deleteRow: {
    text: 'Delete selected rows',
    iconSrc: table_delete_row,
    handler() {
      const tableContainer = external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default().find(this.table);
      tableContainer.deleteRow(this.boundary, this.quill.root.parentNode);
      this.quill.update((external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default()).sources.USER);
      this.tableSelection.clearSelection();
    }
  },
  deleteTable: {
    text: 'Delete table',
    iconSrc: table_delete_table,
    handler() {
      const quillQTableModule = this.quill.getModule('qtable');
      const tableContainer = external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default().find(this.table);
      quillQTableModule.hideTableTools();
      tableContainer.remove();
      this.quill.update((external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default()).sources.USER);
    }
  }
};
class TableOperationMenu {
  constructor(params, quill, options) {
    const quillQTableModule = quill.getModule('qtable');
    this.tableSelection = quillQTableModule.tableSelection;
    this.table = params.table;
    this.quill = quill;
    this.options = options;
    this.menuItems = Object.assign({}, MENU_ITEMS_DEFAULT, options.items);
    this.tableColumnTool = quillQTableModule.columnTool;
    this.boundary = this.tableSelection.boundary;
    this.selectedTds = this.tableSelection.selectedTds;
    this.destroyHandler = this.destroy.bind(this);
    this.columnToolCells = this.tableColumnTool.colToolCells();
    this.colorSubTitle = options.color && options.color.text ? options.color.text : DEFAULT_COLOR_SUBTITLE;
    this.cellColors = options.color && options.color.colors ? options.color.colors : DEFAULT_CELL_COLORS;
    this.textColorSubTitle = options.textcolor && options.textcolor.text ? options.textcolor.text : DEFAULT_TEXT_COLOR_SUBTITLE;
    this.textColors = options.textcolor && options.textcolor.colors ? options.textcolor.colors : DEFAULT_TEXT_COLORS;
    this.textLabelSubTitle = options.textlabel && options.textlabel.text ? options.textlabel.text : DEFAULT_LABEL_TEXT_COLOR_SUBTITLE;
    this.textLebelColors = options.textlabel && options.textlabel.colors ? options.textlabel.colors : DEFAULT_LABEL_TEXT_COLORS;
    this.menuInitial(params);
    this.mount();
    document.addEventListener("click", this.destroyHandler, false);
  }
  mount() {
    document.body.appendChild(this.domNode);
  }
  destroy() {
    this.domNode.remove();
    document.removeEventListener("click", this.destroyHandler, false);
    return null;
  }
  menuInitial({
    table,
    left,
    top
  }) {
    this.domNode = document.createElement('div');
    this.domNode.classList.add('qlbt-operation-menu');
    css(this.domNode, {
      position: 'absolute',
      left: `${left}px`,
      top: `${top}px`,
      'min-height': `${MENU_MIN_HEIHGT}px`,
      width: `${MENU_WIDTH}px`
    });
    for (let name in this.menuItems) {
      if (this.menuItems[name]) {
        this.domNode.appendChild(this.menuItemCreator(Object.assign({}, MENU_ITEMS_DEFAULT[name], this.menuItems[name])));
        if (['insertRowDown', 'unmergeCells'].indexOf(name) > -1) {
          this.domNode.appendChild(dividingCreator());
        }
      }
    }

    // if colors option is false, disabled bg color
    if (this.options.color && this.options.color !== false) {
      this.domNode.appendChild(dividingCreator());
      this.domNode.appendChild(subTitleCreator(this.colorSubTitle));
      this.domNode.appendChild(this.colorsItemCreator(this.cellColors));
      this.domNode.appendChild(dividingCreator());
    }
    if (this.options.textcolor && this.options.textcolor !== false) {
      this.domNode.appendChild(subTitleCreator(this.textColorSubTitle));
      this.domNode.appendChild(this.textColorsItemCreator(this.textColors));
      this.domNode.appendChild(dividingCreator());
    }
    if (this.options.textlabel && this.options.textlabel !== false) {
      this.domNode.appendChild(subTitleCreator(this.textLabelSubTitle));
      this.domNode.appendChild(this.labelTextColorsItemCreator(this.textLebelColors));
      this.domNode.appendChild(dividingCreator());
    }

    // create dividing line
    function dividingCreator() {
      const dividing = document.createElement('div');
      dividing.classList.add('qlbt-operation-menu-dividing');
      return dividing;
    }

    // create subtitle for menu
    function subTitleCreator(title) {
      const subTitle = document.createElement('div');
      subTitle.classList.add('qlbt-operation-menu-subtitle');
      subTitle.innerText = title;
      return subTitle;
    }
  }
  colorsItemCreator(colors) {
    const self = this;
    const node = document.createElement('div');
    node.classList.add('qlbt-operation-color-picker');
    colors.forEach(color => {
      let colorBox = colorBoxCreator(color);
      node.appendChild(colorBox);
    });
    function colorBoxCreator(color) {
      const box = document.createElement('div');
      box.classList.add('qlbt-operation-color-picker-item');
      box.setAttribute('data-color', color);
      box.style.backgroundColor = color;
      box.addEventListener('click', function () {
        const selectedTds = self.tableSelection.selectedTds;
        if (selectedTds && selectedTds.length > 0) {
          selectedTds.forEach(tableCell => {
            tableCell.format('cell-bg', color);
          });
        }
      }, false);
      return box;
    }
    return node;
  }
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
  menuItemCreator({
    text,
    iconSrc,
    handler
  }) {
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
    node.addEventListener('click', handler.bind(this), false);
    return node;
  }
}
function getColToolCellIndexByBoundary(cells, boundary, conditionFn, container) {
  return cells.reduce((findIndex, cell) => {
    let cellRect = getRelativeRect(cell.getBoundingClientRect(), container);
    if (conditionFn(cellRect, boundary)) {
      findIndex = cells.indexOf(cell);
    }
    return findIndex;
  }, false);
}
function getColToolCellIndexesByBoundary(cells, boundary, conditionFn, container) {
  return cells.reduce((findIndexes, cell) => {
    let cellRect = getRelativeRect(cell.getBoundingClientRect(), container);
    if (conditionFn(cellRect, boundary)) {
      findIndexes.push(cells.indexOf(cell));
    }
    return findIndexes;
  }, []);
}
;// ./src/utils/node-matchers.js


const Delta = external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default()["import"]('delta');

// rebuild delta
function matchTableCell(node, delta, scroll) {
  const row = node.parentNode;
  const table = row.parentNode.tagName === 'TABLE' ? row.parentNode : row.parentNode.parentNode;
  const rows = Array.from(table.querySelectorAll('tr'));
  const cells = Array.from(row.querySelectorAll('td'));
  const rowId = rows.indexOf(row) + 1;
  const cellId = cells.indexOf(node) + 1;
  const colspan = node.getAttribute('colspan') || false;
  const rowspan = node.getAttribute('rowspan') || false;
  const cellBg = node.getAttribute('data-cell-bg') || node.style.backgroundColor; // The td from external table has no 'data-cell-bg' 

  // bugfix: empty table cells copied from other place will be removed unexpectedly
  if (delta.length() === 0) {
    delta = new Delta().insert('\n', {
      'table-cell-line': {
        row: rowId,
        cell: cellId,
        rowspan,
        colspan
      }
    });
    return delta;
  }
  delta = delta.reduce((newDelta, op) => {
    if (op.insert && typeof op.insert === 'string') {
      const lines = [];
      let insertStr = op.insert;
      let start = 0;
      for (let i = 0; i < op.insert.length; i++) {
        if (insertStr.charAt(i) === '\n') {
          if (i === 0) {
            lines.push('\n');
          } else {
            lines.push(insertStr.substring(start, i));
            lines.push('\n');
          }
          start = i + 1;
        }
      }
      const tailStr = insertStr.substring(start);
      if (tailStr) lines.push(tailStr);
      lines.forEach(text => {
        text === '\n' ? newDelta.insert('\n', op.attributes) : newDelta.insert(text, _omit(op.attributes, ['table', 'table-cell-line']));
      });
    } else {
      newDelta.insert(op.insert, op.attributes);
    }
    return newDelta;
  }, new Delta());
  return delta.reduce((newDelta, op) => {
    if (op.insert && typeof op.insert === 'string' && op.insert.startsWith('\n')) {
      newDelta.insert(op.insert, Object.assign({}, Object.assign({}, {
        row: rowId
      }, op.attributes.table), {
        'table-cell-line': {
          row: rowId,
          cell: cellId,
          rowspan,
          colspan,
          'cell-bg': cellBg
        }
      }, _omit(op.attributes, ['table'])));
    } else {
      // bugfix: remove background attr from the delta of table cell
      //         to prevent unexcepted background attr append.
      if (op.attributes && op.attributes.background && op.attributes.background === convertToHex(cellBg)) {
        newDelta.insert(op.insert, Object.assign({}, _omit(op.attributes, ['table', 'table-cell-line', 'background'])));
      } else {
        newDelta.insert(op.insert, Object.assign({}, _omit(op.attributes, ['table', 'table-cell-line'])));
      }
    }
    return newDelta;
  }, new Delta());
}

// replace th tag with td tag
function matchTableHeader(node, delta, scroll) {
  const row = node.parentNode;
  const table = row.parentNode.tagName === 'TABLE' ? row.parentNode : row.parentNode.parentNode;
  const rows = Array.from(table.querySelectorAll('tr'));
  const cells = Array.from(row.querySelectorAll('th'));
  const rowId = rows.indexOf(row) + 1;
  const cellId = cells.indexOf(node) + 1;
  const colspan = node.getAttribute('colspan') || false;
  const rowspan = node.getAttribute('rowspan') || false;

  // bugfix: empty table cells copied from other place will be removed unexpectedly
  if (delta.length() === 0) {
    delta = new Delta().insert('\n', {
      'table-cell-line': {
        row: rowId,
        cell: cellId,
        rowspan,
        colspan
      }
    });
    return delta;
  }
  delta = delta.reduce((newDelta, op) => {
    if (op.insert && typeof op.insert === 'string') {
      const lines = [];
      let insertStr = op.insert;
      let start = 0;
      for (let i = 0; i < op.insert.length; i++) {
        if (insertStr.charAt(i) === '\n') {
          if (i === 0) {
            lines.push('\n');
          } else {
            lines.push(insertStr.substring(start, i));
            lines.push('\n');
          }
          start = i + 1;
        }
      }
      const tailStr = insertStr.substring(start);
      if (tailStr) lines.push(tailStr);

      // bugfix: no '\n' in op.insert, push a '\n' to lines
      if (lines.indexOf('\n') < 0) {
        lines.push('\n');
      }
      lines.forEach(text => {
        text === '\n' ? newDelta.insert('\n', {
          'table-cell-line': {
            row: rowId,
            cell: cellId,
            rowspan,
            colspan
          }
        }) : newDelta.insert(text, op.attributes);
      });
    } else {
      newDelta.insert(op.insert, op.attributes);
    }
    return newDelta;
  }, new Delta());
  return delta.reduce((newDelta, op) => {
    if (op.insert && typeof op.insert === 'string' && op.insert.startsWith('\n')) {
      newDelta.insert(op.insert, Object.assign({}, {
        'table-cell-line': {
          row: rowId,
          cell: cellId,
          rowspan,
          colspan
        }
      }));
    } else {
      newDelta.insert(op.insert, Object.assign({}, _omit(op.attributes, ['table', 'table-cell-line'])));
    }
    return newDelta;
  }, new Delta());
}

// supplement colgroup and col
function matchTable(node, delta, scroll) {
  let newColDelta = new Delta();
  const topRow = node.querySelector('tr');

  // bugfix: empty table will return empty delta
  if (topRow === null) return newColDelta;
  const cellsInTopRow = Array.from(topRow.querySelectorAll('td')).concat(Array.from(topRow.querySelectorAll('th')));
  const maxCellsNumber = cellsInTopRow.reduce((sum, cell) => {
    const cellColspan = cell.getAttribute('colspan') || 1;
    sum = sum + parseInt(cellColspan, 10);
    return sum;
  }, 0);
  const colsNumber = node.querySelectorAll('col').length;

  // issue #2
  // bugfix: the table copied from Excel had some default col tags missing
  //         add missing col tags
  if (colsNumber === maxCellsNumber) {
    return delta;
  } else {
    for (let i = 0; i < maxCellsNumber - colsNumber; i++) {
      newColDelta.insert('\n', {
        'table-col': true
      });
    }
    if (colsNumber === 0) return newColDelta.concat(delta);
    let lastNumber = 0;
    return delta.reduce((finalDelta, op) => {
      finalDelta.insert(op.insert, op.attributes);
      if (op.attributes && op.attributes['table-col']) {
        lastNumber += op.insert.length;
        if (lastNumber === colsNumber) {
          finalDelta = finalDelta.concat(newColDelta);
        }
      }
      return finalDelta;
    }, new Delta());
  }
}
;// ./src/quill-qtable.js





// import table node matchers


const Module = external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default()["import"]('core/module');
const quill_qtable_Delta = external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default()["import"]('delta');

class QuilQtable extends Module {
  static register() {
    external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default().register(TableCol, true);
    external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default().register(TableColGroup, true);
    external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default().register(TableCellLine, true);
    external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default().register(TableCell, true);
    external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default().register(TableRow, true);
    external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default().register(TableBody, true);
    external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default().register(TableContainer, true);
    external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default().register(TableViewWrapper, true);
    external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default().register(TableViewWrapper, true);
    // register customized Header，overwriting quill built-in Header
    // Quill.register('formats/header', Header, true);
  }
  constructor(quill, options) {
    super(quill, options);

    // handle click on quill-q-table
    this.quill.root.addEventListener('click', evt => {
      // bugfix: evt.path is undefined in Safari, FF, Micro Edge
      const path = getEventComposedPath(evt);
      if (!path || path.length <= 0) return;
      const tableNode = path.filter(node => {
        return node.tagName && node.tagName.toUpperCase() === 'TABLE' && node.classList.contains('quill-qtable');
      })[0];
      if (tableNode) {
        // current table clicked
        if (this.table === tableNode) return;
        // other table clicked
        if (this.table) this.hideTableTools();
        this.showTableTools(tableNode, quill, options);
      } else if (this.table) {
        // other clicked
        this.hideTableTools();
      }
    }, false);

    // handle right click on quill-q-table
    this.quill.root.addEventListener('contextmenu', evt => {
      if (!this.table) return true;
      evt.preventDefault();

      // bugfix: evt.path is undefined in Safari, FF, Micro Edge
      const path = getEventComposedPath(evt);
      if (!path || path.length <= 0) return;
      const tableNode = path.filter(node => {
        return node.tagName && node.tagName.toUpperCase() === 'TABLE' && node.classList.contains('quill-qtable');
      })[0];
      const rowNode = path.filter(node => {
        return node.tagName && node.tagName.toUpperCase() === 'TR' && node.getAttribute('data-row');
      })[0];
      const cellNode = path.filter(node => {
        return node.tagName && node.tagName.toUpperCase() === 'TD' && node.getAttribute('data-row');
      })[0];
      let isTargetCellSelected = this.tableSelection.selectedTds.map(tableCell => tableCell.domNode).includes(cellNode);
      if (this.tableSelection.selectedTds.length <= 0 || !isTargetCellSelected) {
        this.tableSelection.setSelection(cellNode.getBoundingClientRect(), cellNode.getBoundingClientRect());
      }
      if (this.tableOperationMenu) this.tableOperationMenu = this.tableOperationMenu.destroy();
      if (tableNode) {
        this.tableOperationMenu = new TableOperationMenu({
          table: tableNode,
          row: rowNode,
          cell: cellNode,
          left: evt.pageX,
          top: evt.pageY
        }, quill, options.operationMenu);
      }
    }, false);

    // add keyboard binding：Backspace
    // prevent user hits backspace to delete table cell
    const KeyBoard = quill.getModule('keyboard');
    quill.keyboard.addBinding({
      key: 'Backspace'
    }, {}, function (range, context) {
      if (range.index === 0 || this.quill.getLength() <= 1) return true;
      const [line] = this.quill.getLine(range.index);
      if (context.offset === 0) {
        const [prev] = this.quill.getLine(range.index - 1);
        if (prev != null) {
          if (prev.statics.blotName === 'table-cell-line' && line.statics.blotName !== 'table-cell-line') return false;
        }
      }
      return true;
    });
    // since only one matched bindings callback will excute.
    // expected my binding callback excute first
    // I changed the order of binding callbacks
    let thisBinding = quill.keyboard.bindings['Backspace'].pop();
    quill.keyboard.bindings['Backspace'].splice(0, 1, thisBinding);

    // add Matchers to match and render quill-q-table for initialization
    // or pasting
    quill.clipboard.addMatcher('td', matchTableCell);
    quill.clipboard.addMatcher('th', matchTableHeader);
    quill.clipboard.addMatcher('table', matchTable);
    // quill.clipboard.addMatcher('h1, h2, h3, h4, h5, h6', matchHeader)

    // remove matcher for tr tag
    quill.clipboard.matchers = quill.clipboard.matchers.filter(matcher => {
      return matcher[0] !== 'tr';
    });
  }
  getTable(range = this.quill.getSelection()) {
    if (range == null) return [null, null, null, -1];
    const [cellLine, offset] = this.quill.getLine(range.index);
    if (cellLine == null || cellLine.statics.blotName !== TableCellLine.blotName) {
      return [null, null, null, -1];
    }
    const cell = cellLine.tableCell();
    const row = cell.row();
    const table = row.table();
    return [table, row, cell, offset];
  }
  insertTable(rows, columns) {
    const range = this.quill.getSelection(true);
    if (range == null) return;
    let currentBlot = this.quill.getLeaf(range.index)[0];
    let delta = new quill_qtable_Delta().retain(range.index);
    if (isInTableCell(currentBlot)) {
      console.warn(`Can not insert table into a table cell.`);
      return;
    }
    delta.insert('\n');
    // insert table column
    delta = new Array(columns).fill('\n').reduce((memo, text) => {
      memo.insert(text, {
        'table-col': true
      });
      return memo;
    }, delta);
    // insert table cell line with empty line
    delta = new Array(rows).fill(0).reduce(memo => {
      let tableRowId = rowId();
      return new Array(columns).fill('\n').reduce((memo, text) => {
        memo.insert(text, {
          'table-cell-line': {
            row: tableRowId,
            cell: cellId()
          }
        });
        return memo;
      }, memo);
    }, delta);
    this.quill.updateContents(delta, (external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default()).sources.USER);
    this.quill.setSelection(range.index + columns + 1, (external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default()).sources.API);
  }
  showTableTools(table, quill, options) {
    this.table = table;
    this.columnTool = new TableColumnTool(table, quill, options);
    this.tableSelection = new TableSelection(table, quill, options);
  }
  hideTableTools() {
    this.columnTool && this.columnTool.destroy();
    this.tableSelection && this.tableSelection.destroy();
    this.tableOperationMenu && this.tableOperationMenu.destroy();
    this.columnTool = null;
    this.tableSelection = null;
    this.tableOperationMenu = null;
    this.table = null;
  }
}
QuilQtable.keyboardBindings = {
  'table-cell-line backspace': {
    key: 'Backspace',
    format: ['table-cell-line'],
    collapsed: true,
    offset: 0,
    handler(range, context) {
      const [line, offset] = this.quill.getLine(range.index);
      if (!line.prev || line.prev.statics.blotName !== 'table-cell-line') {
        return false;
      }
      return true;
    }
  },
  'table-cell-line delete': {
    key: 'Delete',
    format: ['table-cell-line'],
    collapsed: true,
    suffix: /^$/,
    handler() {}
  },
  'table-cell-line enter': {
    key: 'Enter',
    shiftKey: null,
    format: ['table-cell-line'],
    handler(range, context) {
      // bugfix: a unexpected new line inserted when user compositionend with hitting Enter
      if (this.quill.selection && this.quill.selection.composing) return;
      const Scope = (external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default()).imports.parchment.Scope;
      if (range.length > 0) {
        this.quill.scroll.deleteAt(range.index, range.length); // So we do not trigger text-change
      }
      const lineFormats = Object.keys(context.format).reduce((formats, format) => {
        if (this.quill.scroll.query(format, Scope.BLOCK) && !Array.isArray(context.format[format])) {
          formats[format] = context.format[format];
        }
        return formats;
      }, {});
      // insert new cellLine with lineFormats
      this.quill.insertText(range.index, '\n', lineFormats['table-cell-line'], (external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default()).sources.USER);
      // Earlier scroll.deleteAt might have messed up our selection,
      // so insertText's built in selection preservation is not reliable
      this.quill.setSelection(range.index + 1, (external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default()).sources.SILENT);
      this.quill.focus();
      Object.keys(context.format).forEach(name => {
        if (lineFormats[name] != null) return;
        if (Array.isArray(context.format[name])) return;
        if (name === 'link') return;
        this.quill.format(name, context.format[name], (external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default()).sources.USER);
      });
    }
  },
  'table-cell-line up': makeTableArrowHandler(true),
  'table-cell-line down': makeTableArrowHandler(false),
  'down-to-table': {
    key: 'ArrowDown',
    collapsed: true,
    handler(range, context) {
      const target = context.line.next;
      if (target && target.statics.blotName === 'table-view') {
        const targetCell = target.table().rows()[0].children.head;
        const targetLine = targetCell.children.head;
        this.quill.setSelection(targetLine.offset(this.quill.scroll), 0, (external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default()).sources.USER);
        return false;
      }
      return true;
    }
  },
  'up-to-table': {
    key: 'ArrowUp',
    collapsed: true,
    handler(range, context) {
      const target = context.line.prev;
      if (target && target.statics.blotName === 'table-view') {
        const rows = target.table().rows();
        const targetCell = rows[rows.length - 1].children.head;
        const targetLine = targetCell.children.head;
        this.quill.setSelection(targetLine.offset(this.quill.scroll), 0, (external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default()).sources.USER);
        return false;
      }
      return true;
    }
  }
};
function makeTableArrowHandler(up) {
  return {
    key: up ? 'ArrowUp' : 'ArrowDown',
    collapsed: true,
    format: ['table-cell-line'],
    handler(range, context) {
      // TODO move to table module
      const key = up ? 'prev' : 'next';
      const targetLine = context.line[key];
      if (targetLine != null) return true;
      const cell = context.line.parent;
      const targetRow = cell.parent[key];
      if (targetRow != null && targetRow.statics.blotName === 'table-row') {
        let targetCell = targetRow.children.head;
        let totalColspanOfTargetCell = parseInt(targetCell.formats()['colspan'], 10);
        let cur = cell;
        let totalColspanOfCur = parseInt(cur.formats()['colspan'], 10);

        // get targetCell above current cell depends on colspan
        while (cur.prev != null) {
          cur = cur.prev;
          totalColspanOfCur += parseInt(cur.formats()['colspan'], 10);
        }
        while (targetCell.next != null && totalColspanOfTargetCell < totalColspanOfCur) {
          targetCell = targetCell.next;
          totalColspanOfTargetCell += parseInt(targetCell.formats()['colspan'], 10);
        }
        const index = targetCell.offset(this.quill.scroll);
        this.quill.setSelection(index, 0, (external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default()).sources.USER);
      } else {
        const targetLine = cell.table().parent[key];
        if (targetLine != null) {
          if (up) {
            this.quill.setSelection(targetLine.offset(this.quill.scroll) + targetLine.length() - 1, 0, (external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default()).sources.USER);
          } else {
            this.quill.setSelection(targetLine.offset(this.quill.scroll), 0, (external_commonjs_quill_commonjs2_quill_amd_quill_root_Quill_default()).sources.USER);
          }
        }
      }
      return false;
    }
  };
}
function isTableCell(blot) {
  return blot.statics.blotName === TableCell.blotName;
}
function isInTableCell(current) {
  return current && current.parent ? isTableCell(current.parent) ? true : isInTableCell(current.parent) : false;
}
/* harmony default export */ const quill_qtable = (QuilQtable);

/***/ }),

/***/ 574:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

/* harmony import */ var src_quill_qtable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(299);
/* harmony import */ var src_assets_quill_qtable_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(805);

// import better-table styles file

Quill.register({
  'modules/qtable': src_quill_qtable_js__WEBPACK_IMPORTED_MODULE_0__["default"]
}, true);
window.onload = () => {
  const quill = new Quill('#editor-wrapper', {
    theme: 'snow',
    modules: {
      table: false,
      'qtable': {
        operationMenu: {
          items: {
            unmergeCells: {
              text: 'Another unmerge cells name'
            }
          },
          color: {
            colors: ['red', 'green', 'yellow', 'white', 'red', 'green', 'yellow', 'white']
          }
        }
      },
      keyboard: {
        bindings: src_quill_qtable_js__WEBPACK_IMPORTED_MODULE_0__["default"].keyboardBindings
      }
    }
  });
  let tableModule = quill.getModule('qtable');
  document.body.querySelector('#insert-table').onclick = () => {
    tableModule.insertTable(3, 3);
  };
  document.body.querySelector('#get-table').onclick = () => {
    console.log(tableModule.getTable());
  };
  document.body.querySelector('#get-contents').onclick = () => {
    console.log(quill.getContents());
  };
};

/***/ }),

/***/ 805:
/***/ ((module, __unused_webpack___webpack_exports__, __webpack_require__) => {

// extracted by mini-css-extract-plugin

    if(true) {
      (function() {
        var localsJsonString = undefined;
        // 1743739011840
        var cssReload = __webpack_require__(140)(module.id, {});
        // only invalidate when locals change
        if (
          module.hot.data &&
          module.hot.data.value &&
          module.hot.data.value !== localsJsonString
        ) {
          module.hot.invalidate();
        } else {
          module.hot.accept();
        }
        module.hot.dispose(function(data) {
          data.value = localsJsonString;
          cssReload();
        });
      })();
    }
  

/***/ }),

/***/ 912:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__912__;

/***/ }),

/***/ 918:
/***/ ((module) => {



/* eslint-disable */

/**
 * @param {string[]} pathComponents
 * @returns {string}
 */
function normalizeUrl(pathComponents) {
  return pathComponents.reduce(function (accumulator, item) {
    switch (item) {
      case "..":
        accumulator.pop();
        break;
      case ".":
        break;
      default:
        accumulator.push(item);
    }
    return accumulator;
  }, /** @type {string[]} */[]).join("/");
}

/**
 * @param {string} urlString
 * @returns {string}
 */
module.exports = function (urlString) {
  urlString = urlString.trim();
  if (/^data:/i.test(urlString)) {
    return urlString;
  }
  var protocol = urlString.indexOf("//") !== -1 ? urlString.split("//")[0] + "//" : "";
  var components = urlString.replace(new RegExp(protocol, "i"), "").split("/");
  var host = components[0].toLowerCase().replace(/\.$/, "");
  components[0] = "";
  var path = normalizeUrl(components);
  return protocol + host + path;
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		try {
/******/ 			var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 			__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 			module = execOptions.module;
/******/ 			execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 		} catch(e) {
/******/ 			module.error = e;
/******/ 			throw e;
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// expose the module execution interceptor
/******/ 	__webpack_require__.i = [];
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript update chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.hu = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get mini-css chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.miniCssF = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return undefined;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get update manifest filename */
/******/ 	(() => {
/******/ 		__webpack_require__.hmrF = () => ("demo_demo1_js." + __webpack_require__.h() + ".hot-update.json");
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => ("30b445536457d10f8710")
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "quillQTable:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hot module replacement */
/******/ 	(() => {
/******/ 		var currentModuleData = {};
/******/ 		var installedModules = __webpack_require__.c;
/******/ 		
/******/ 		// module and require creation
/******/ 		var currentChildModule;
/******/ 		var currentParents = [];
/******/ 		
/******/ 		// status
/******/ 		var registeredStatusHandlers = [];
/******/ 		var currentStatus = "idle";
/******/ 		
/******/ 		// while downloading
/******/ 		var blockingPromises = 0;
/******/ 		var blockingPromisesWaiting = [];
/******/ 		
/******/ 		// The update info
/******/ 		var currentUpdateApplyHandlers;
/******/ 		var queuedInvalidatedModules;
/******/ 		
/******/ 		__webpack_require__.hmrD = currentModuleData;
/******/ 		
/******/ 		__webpack_require__.i.push(function (options) {
/******/ 			var module = options.module;
/******/ 			var require = createRequire(options.require, options.id);
/******/ 			module.hot = createModuleHotObject(options.id, module);
/******/ 			module.parents = currentParents;
/******/ 			module.children = [];
/******/ 			currentParents = [];
/******/ 			options.require = require;
/******/ 		});
/******/ 		
/******/ 		__webpack_require__.hmrC = {};
/******/ 		__webpack_require__.hmrI = {};
/******/ 		
/******/ 		function createRequire(require, moduleId) {
/******/ 			var me = installedModules[moduleId];
/******/ 			if (!me) return require;
/******/ 			var fn = function (request) {
/******/ 				if (me.hot.active) {
/******/ 					if (installedModules[request]) {
/******/ 						var parents = installedModules[request].parents;
/******/ 						if (parents.indexOf(moduleId) === -1) {
/******/ 							parents.push(moduleId);
/******/ 						}
/******/ 					} else {
/******/ 						currentParents = [moduleId];
/******/ 						currentChildModule = request;
/******/ 					}
/******/ 					if (me.children.indexOf(request) === -1) {
/******/ 						me.children.push(request);
/******/ 					}
/******/ 				} else {
/******/ 					console.warn(
/******/ 						"[HMR] unexpected require(" +
/******/ 							request +
/******/ 							") from disposed module " +
/******/ 							moduleId
/******/ 					);
/******/ 					currentParents = [];
/******/ 				}
/******/ 				return require(request);
/******/ 			};
/******/ 			var createPropertyDescriptor = function (name) {
/******/ 				return {
/******/ 					configurable: true,
/******/ 					enumerable: true,
/******/ 					get: function () {
/******/ 						return require[name];
/******/ 					},
/******/ 					set: function (value) {
/******/ 						require[name] = value;
/******/ 					}
/******/ 				};
/******/ 			};
/******/ 			for (var name in require) {
/******/ 				if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
/******/ 					Object.defineProperty(fn, name, createPropertyDescriptor(name));
/******/ 				}
/******/ 			}
/******/ 			fn.e = function (chunkId, fetchPriority) {
/******/ 				return trackBlockingPromise(require.e(chunkId, fetchPriority));
/******/ 			};
/******/ 			return fn;
/******/ 		}
/******/ 		
/******/ 		function createModuleHotObject(moduleId, me) {
/******/ 			var _main = currentChildModule !== moduleId;
/******/ 			var hot = {
/******/ 				// private stuff
/******/ 				_acceptedDependencies: {},
/******/ 				_acceptedErrorHandlers: {},
/******/ 				_declinedDependencies: {},
/******/ 				_selfAccepted: false,
/******/ 				_selfDeclined: false,
/******/ 				_selfInvalidated: false,
/******/ 				_disposeHandlers: [],
/******/ 				_main: _main,
/******/ 				_requireSelf: function () {
/******/ 					currentParents = me.parents.slice();
/******/ 					currentChildModule = _main ? undefined : moduleId;
/******/ 					__webpack_require__(moduleId);
/******/ 				},
/******/ 		
/******/ 				// Module API
/******/ 				active: true,
/******/ 				accept: function (dep, callback, errorHandler) {
/******/ 					if (dep === undefined) hot._selfAccepted = true;
/******/ 					else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 					else if (typeof dep === "object" && dep !== null) {
/******/ 						for (var i = 0; i < dep.length; i++) {
/******/ 							hot._acceptedDependencies[dep[i]] = callback || function () {};
/******/ 							hot._acceptedErrorHandlers[dep[i]] = errorHandler;
/******/ 						}
/******/ 					} else {
/******/ 						hot._acceptedDependencies[dep] = callback || function () {};
/******/ 						hot._acceptedErrorHandlers[dep] = errorHandler;
/******/ 					}
/******/ 				},
/******/ 				decline: function (dep) {
/******/ 					if (dep === undefined) hot._selfDeclined = true;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._declinedDependencies[dep[i]] = true;
/******/ 					else hot._declinedDependencies[dep] = true;
/******/ 				},
/******/ 				dispose: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				addDisposeHandler: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				removeDisposeHandler: function (callback) {
/******/ 					var idx = hot._disposeHandlers.indexOf(callback);
/******/ 					if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 				},
/******/ 				invalidate: function () {
/******/ 					this._selfInvalidated = true;
/******/ 					switch (currentStatus) {
/******/ 						case "idle":
/******/ 							currentUpdateApplyHandlers = [];
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							setStatus("ready");
/******/ 							break;
/******/ 						case "ready":
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							break;
/******/ 						case "prepare":
/******/ 						case "check":
/******/ 						case "dispose":
/******/ 						case "apply":
/******/ 							(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
/******/ 								moduleId
/******/ 							);
/******/ 							break;
/******/ 						default:
/******/ 							// ignore requests in error states
/******/ 							break;
/******/ 					}
/******/ 				},
/******/ 		
/******/ 				// Management API
/******/ 				check: hotCheck,
/******/ 				apply: hotApply,
/******/ 				status: function (l) {
/******/ 					if (!l) return currentStatus;
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				addStatusHandler: function (l) {
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				removeStatusHandler: function (l) {
/******/ 					var idx = registeredStatusHandlers.indexOf(l);
/******/ 					if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
/******/ 				},
/******/ 		
/******/ 				// inherit from previous dispose call
/******/ 				data: currentModuleData[moduleId]
/******/ 			};
/******/ 			currentChildModule = undefined;
/******/ 			return hot;
/******/ 		}
/******/ 		
/******/ 		function setStatus(newStatus) {
/******/ 			currentStatus = newStatus;
/******/ 			var results = [];
/******/ 		
/******/ 			for (var i = 0; i < registeredStatusHandlers.length; i++)
/******/ 				results[i] = registeredStatusHandlers[i].call(null, newStatus);
/******/ 		
/******/ 			return Promise.all(results).then(function () {});
/******/ 		}
/******/ 		
/******/ 		function unblock() {
/******/ 			if (--blockingPromises === 0) {
/******/ 				setStatus("ready").then(function () {
/******/ 					if (blockingPromises === 0) {
/******/ 						var list = blockingPromisesWaiting;
/******/ 						blockingPromisesWaiting = [];
/******/ 						for (var i = 0; i < list.length; i++) {
/******/ 							list[i]();
/******/ 						}
/******/ 					}
/******/ 				});
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function trackBlockingPromise(promise) {
/******/ 			switch (currentStatus) {
/******/ 				case "ready":
/******/ 					setStatus("prepare");
/******/ 				/* fallthrough */
/******/ 				case "prepare":
/******/ 					blockingPromises++;
/******/ 					promise.then(unblock, unblock);
/******/ 					return promise;
/******/ 				default:
/******/ 					return promise;
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function waitForBlockingPromises(fn) {
/******/ 			if (blockingPromises === 0) return fn();
/******/ 			return new Promise(function (resolve) {
/******/ 				blockingPromisesWaiting.push(function () {
/******/ 					resolve(fn());
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotCheck(applyOnUpdate) {
/******/ 			if (currentStatus !== "idle") {
/******/ 				throw new Error("check() is only allowed in idle status");
/******/ 			}
/******/ 			return setStatus("check")
/******/ 				.then(__webpack_require__.hmrM)
/******/ 				.then(function (update) {
/******/ 					if (!update) {
/******/ 						return setStatus(applyInvalidatedModules() ? "ready" : "idle").then(
/******/ 							function () {
/******/ 								return null;
/******/ 							}
/******/ 						);
/******/ 					}
/******/ 		
/******/ 					return setStatus("prepare").then(function () {
/******/ 						var updatedModules = [];
/******/ 						currentUpdateApplyHandlers = [];
/******/ 		
/******/ 						return Promise.all(
/******/ 							Object.keys(__webpack_require__.hmrC).reduce(function (
/******/ 								promises,
/******/ 								key
/******/ 							) {
/******/ 								__webpack_require__.hmrC[key](
/******/ 									update.c,
/******/ 									update.r,
/******/ 									update.m,
/******/ 									promises,
/******/ 									currentUpdateApplyHandlers,
/******/ 									updatedModules
/******/ 								);
/******/ 								return promises;
/******/ 							}, [])
/******/ 						).then(function () {
/******/ 							return waitForBlockingPromises(function () {
/******/ 								if (applyOnUpdate) {
/******/ 									return internalApply(applyOnUpdate);
/******/ 								}
/******/ 								return setStatus("ready").then(function () {
/******/ 									return updatedModules;
/******/ 								});
/******/ 							});
/******/ 						});
/******/ 					});
/******/ 				});
/******/ 		}
/******/ 		
/******/ 		function hotApply(options) {
/******/ 			if (currentStatus !== "ready") {
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw new Error(
/******/ 						"apply() is only allowed in ready status (state: " +
/******/ 							currentStatus +
/******/ 							")"
/******/ 					);
/******/ 				});
/******/ 			}
/******/ 			return internalApply(options);
/******/ 		}
/******/ 		
/******/ 		function internalApply(options) {
/******/ 			options = options || {};
/******/ 		
/******/ 			applyInvalidatedModules();
/******/ 		
/******/ 			var results = currentUpdateApplyHandlers.map(function (handler) {
/******/ 				return handler(options);
/******/ 			});
/******/ 			currentUpdateApplyHandlers = undefined;
/******/ 		
/******/ 			var errors = results
/******/ 				.map(function (r) {
/******/ 					return r.error;
/******/ 				})
/******/ 				.filter(Boolean);
/******/ 		
/******/ 			if (errors.length > 0) {
/******/ 				return setStatus("abort").then(function () {
/******/ 					throw errors[0];
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			// Now in "dispose" phase
/******/ 			var disposePromise = setStatus("dispose");
/******/ 		
/******/ 			results.forEach(function (result) {
/******/ 				if (result.dispose) result.dispose();
/******/ 			});
/******/ 		
/******/ 			// Now in "apply" phase
/******/ 			var applyPromise = setStatus("apply");
/******/ 		
/******/ 			var error;
/******/ 			var reportError = function (err) {
/******/ 				if (!error) error = err;
/******/ 			};
/******/ 		
/******/ 			var outdatedModules = [];
/******/ 			results.forEach(function (result) {
/******/ 				if (result.apply) {
/******/ 					var modules = result.apply(reportError);
/******/ 					if (modules) {
/******/ 						for (var i = 0; i < modules.length; i++) {
/******/ 							outdatedModules.push(modules[i]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		
/******/ 			return Promise.all([disposePromise, applyPromise]).then(function () {
/******/ 				// handle errors in accept handlers and self accepted module load
/******/ 				if (error) {
/******/ 					return setStatus("fail").then(function () {
/******/ 						throw error;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				if (queuedInvalidatedModules) {
/******/ 					return internalApply(options).then(function (list) {
/******/ 						outdatedModules.forEach(function (moduleId) {
/******/ 							if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 						});
/******/ 						return list;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				return setStatus("idle").then(function () {
/******/ 					return outdatedModules;
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function applyInvalidatedModules() {
/******/ 			if (queuedInvalidatedModules) {
/******/ 				if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
/******/ 				Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 					queuedInvalidatedModules.forEach(function (moduleId) {
/******/ 						__webpack_require__.hmrI[key](
/******/ 							moduleId,
/******/ 							currentUpdateApplyHandlers
/******/ 						);
/******/ 					});
/******/ 				});
/******/ 				queuedInvalidatedModules = undefined;
/******/ 				return true;
/******/ 			}
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/^blob:/, "").replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl + "../";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/css loading */
/******/ 	(() => {
/******/ 		if (typeof document === "undefined") return;
/******/ 		var createStylesheet = (chunkId, fullhref, oldTag, resolve, reject) => {
/******/ 			var linkTag = document.createElement("link");
/******/ 		
/******/ 			linkTag.rel = "stylesheet";
/******/ 			linkTag.type = "text/css";
/******/ 			if (__webpack_require__.nc) {
/******/ 				linkTag.nonce = __webpack_require__.nc;
/******/ 			}
/******/ 			var onLinkComplete = (event) => {
/******/ 				// avoid mem leaks.
/******/ 				linkTag.onerror = linkTag.onload = null;
/******/ 				if (event.type === 'load') {
/******/ 					resolve();
/******/ 				} else {
/******/ 					var errorType = event && event.type;
/******/ 					var realHref = event && event.target && event.target.href || fullhref;
/******/ 					var err = new Error("Loading CSS chunk " + chunkId + " failed.\n(" + errorType + ": " + realHref + ")");
/******/ 					err.name = "ChunkLoadError";
/******/ 					err.code = "CSS_CHUNK_LOAD_FAILED";
/******/ 					err.type = errorType;
/******/ 					err.request = realHref;
/******/ 					if (linkTag.parentNode) linkTag.parentNode.removeChild(linkTag)
/******/ 					reject(err);
/******/ 				}
/******/ 			}
/******/ 			linkTag.onerror = linkTag.onload = onLinkComplete;
/******/ 			linkTag.href = fullhref;
/******/ 		
/******/ 		
/******/ 			if (oldTag) {
/******/ 				oldTag.parentNode.insertBefore(linkTag, oldTag.nextSibling);
/******/ 			} else {
/******/ 				document.head.appendChild(linkTag);
/******/ 			}
/******/ 			return linkTag;
/******/ 		};
/******/ 		var findStylesheet = (href, fullhref) => {
/******/ 			var existingLinkTags = document.getElementsByTagName("link");
/******/ 			for(var i = 0; i < existingLinkTags.length; i++) {
/******/ 				var tag = existingLinkTags[i];
/******/ 				var dataHref = tag.getAttribute("data-href") || tag.getAttribute("href");
/******/ 				if(tag.rel === "stylesheet" && (dataHref === href || dataHref === fullhref)) return tag;
/******/ 			}
/******/ 			var existingStyleTags = document.getElementsByTagName("style");
/******/ 			for(var i = 0; i < existingStyleTags.length; i++) {
/******/ 				var tag = existingStyleTags[i];
/******/ 				var dataHref = tag.getAttribute("data-href");
/******/ 				if(dataHref === href || dataHref === fullhref) return tag;
/******/ 			}
/******/ 		};
/******/ 		var loadStylesheet = (chunkId) => {
/******/ 			return new Promise((resolve, reject) => {
/******/ 				var href = __webpack_require__.miniCssF(chunkId);
/******/ 				var fullhref = __webpack_require__.p + href;
/******/ 				if(findStylesheet(href, fullhref)) return resolve();
/******/ 				createStylesheet(chunkId, fullhref, null, resolve, reject);
/******/ 			});
/******/ 		}
/******/ 		// no chunk loading
/******/ 		
/******/ 		var oldTags = [];
/******/ 		var newTags = [];
/******/ 		var applyHandler = (options) => {
/******/ 			return { dispose: () => {
/******/ 				for(var i = 0; i < oldTags.length; i++) {
/******/ 					var oldTag = oldTags[i];
/******/ 					if(oldTag.parentNode) oldTag.parentNode.removeChild(oldTag);
/******/ 				}
/******/ 				oldTags.length = 0;
/******/ 			}, apply: () => {
/******/ 				for(var i = 0; i < newTags.length; i++) newTags[i].rel = "stylesheet";
/******/ 				newTags.length = 0;
/******/ 			} };
/******/ 		}
/******/ 		__webpack_require__.hmrC.miniCss = (chunkIds, removedChunks, removedModules, promises, applyHandlers, updatedModulesList) => {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			chunkIds.forEach((chunkId) => {
/******/ 				var href = __webpack_require__.miniCssF(chunkId);
/******/ 				var fullhref = __webpack_require__.p + href;
/******/ 				var oldTag = findStylesheet(href, fullhref);
/******/ 				if(!oldTag) return;
/******/ 				promises.push(new Promise((resolve, reject) => {
/******/ 					var tag = createStylesheet(chunkId, fullhref, oldTag, () => {
/******/ 						tag.as = "style";
/******/ 						tag.rel = "preload";
/******/ 						resolve();
/******/ 					}, reject);
/******/ 					oldTags.push(oldTag);
/******/ 					newTags.push(tag);
/******/ 				}));
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = __webpack_require__.hmrS_jsonp = __webpack_require__.hmrS_jsonp || {
/******/ 			100: 0,
/******/ 			364: 0,
/******/ 			903: 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		var currentUpdatedModulesList;
/******/ 		var waitingUpdateResolves = {};
/******/ 		function loadUpdateChunk(chunkId, updatedModulesList) {
/******/ 			currentUpdatedModulesList = updatedModulesList;
/******/ 			return new Promise((resolve, reject) => {
/******/ 				waitingUpdateResolves[chunkId] = resolve;
/******/ 				// start update chunk loading
/******/ 				var url = __webpack_require__.p + __webpack_require__.hu(chunkId);
/******/ 				// create error before stack unwound to get useful stacktrace later
/******/ 				var error = new Error();
/******/ 				var loadingEnded = (event) => {
/******/ 					if(waitingUpdateResolves[chunkId]) {
/******/ 						waitingUpdateResolves[chunkId] = undefined
/******/ 						var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 						var realSrc = event && event.target && event.target.src;
/******/ 						error.message = 'Loading hot update chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 						error.name = 'ChunkLoadError';
/******/ 						error.type = errorType;
/******/ 						error.request = realSrc;
/******/ 						reject(error);
/******/ 					}
/******/ 				};
/******/ 				__webpack_require__.l(url, loadingEnded);
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		self["webpackHotUpdatequillQTable"] = (chunkId, moreModules, runtime) => {
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					currentUpdate[moduleId] = moreModules[moduleId];
/******/ 					if(currentUpdatedModulesList) currentUpdatedModulesList.push(moduleId);
/******/ 				}
/******/ 			}
/******/ 			if(runtime) currentUpdateRuntime.push(runtime);
/******/ 			if(waitingUpdateResolves[chunkId]) {
/******/ 				waitingUpdateResolves[chunkId]();
/******/ 				waitingUpdateResolves[chunkId] = undefined;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var currentUpdateChunks;
/******/ 		var currentUpdate;
/******/ 		var currentUpdateRemovedChunks;
/******/ 		var currentUpdateRuntime;
/******/ 		function applyHandler(options) {
/******/ 			if (__webpack_require__.f) delete __webpack_require__.f.jsonpHmr;
/******/ 			currentUpdateChunks = undefined;
/******/ 			function getAffectedModuleEffects(updateModuleId) {
/******/ 				var outdatedModules = [updateModuleId];
/******/ 				var outdatedDependencies = {};
/******/ 		
/******/ 				var queue = outdatedModules.map(function (id) {
/******/ 					return {
/******/ 						chain: [id],
/******/ 						id: id
/******/ 					};
/******/ 				});
/******/ 				while (queue.length > 0) {
/******/ 					var queueItem = queue.pop();
/******/ 					var moduleId = queueItem.id;
/******/ 					var chain = queueItem.chain;
/******/ 					var module = __webpack_require__.c[moduleId];
/******/ 					if (
/******/ 						!module ||
/******/ 						(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 					)
/******/ 						continue;
/******/ 					if (module.hot._selfDeclined) {
/******/ 						return {
/******/ 							type: "self-declined",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					if (module.hot._main) {
/******/ 						return {
/******/ 							type: "unaccepted",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					for (var i = 0; i < module.parents.length; i++) {
/******/ 						var parentId = module.parents[i];
/******/ 						var parent = __webpack_require__.c[parentId];
/******/ 						if (!parent) continue;
/******/ 						if (parent.hot._declinedDependencies[moduleId]) {
/******/ 							return {
/******/ 								type: "declined",
/******/ 								chain: chain.concat([parentId]),
/******/ 								moduleId: moduleId,
/******/ 								parentId: parentId
/******/ 							};
/******/ 						}
/******/ 						if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 						if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 							if (!outdatedDependencies[parentId])
/******/ 								outdatedDependencies[parentId] = [];
/******/ 							addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 							continue;
/******/ 						}
/******/ 						delete outdatedDependencies[parentId];
/******/ 						outdatedModules.push(parentId);
/******/ 						queue.push({
/******/ 							chain: chain.concat([parentId]),
/******/ 							id: parentId
/******/ 						});
/******/ 					}
/******/ 				}
/******/ 		
/******/ 				return {
/******/ 					type: "accepted",
/******/ 					moduleId: updateModuleId,
/******/ 					outdatedModules: outdatedModules,
/******/ 					outdatedDependencies: outdatedDependencies
/******/ 				};
/******/ 			}
/******/ 		
/******/ 			function addAllToSet(a, b) {
/******/ 				for (var i = 0; i < b.length; i++) {
/******/ 					var item = b[i];
/******/ 					if (a.indexOf(item) === -1) a.push(item);
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			// at begin all updates modules are outdated
/******/ 			// the "outdated" status can propagate to parents if they don't accept the children
/******/ 			var outdatedDependencies = {};
/******/ 			var outdatedModules = [];
/******/ 			var appliedUpdate = {};
/******/ 		
/******/ 			var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" + module.id + ") to disposed module"
/******/ 				);
/******/ 			};
/******/ 		
/******/ 			for (var moduleId in currentUpdate) {
/******/ 				if (__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 					var newModuleFactory = currentUpdate[moduleId];
/******/ 					/** @type {TODO} */
/******/ 					var result = newModuleFactory
/******/ 						? getAffectedModuleEffects(moduleId)
/******/ 						: {
/******/ 								type: "disposed",
/******/ 								moduleId: moduleId
/******/ 							};
/******/ 					/** @type {Error|false} */
/******/ 					var abortError = false;
/******/ 					var doApply = false;
/******/ 					var doDispose = false;
/******/ 					var chainInfo = "";
/******/ 					if (result.chain) {
/******/ 						chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 					}
/******/ 					switch (result.type) {
/******/ 						case "self-declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of self decline: " +
/******/ 										result.moduleId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of declined dependency: " +
/******/ 										result.moduleId +
/******/ 										" in " +
/******/ 										result.parentId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "unaccepted":
/******/ 							if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 							if (!options.ignoreUnaccepted)
/******/ 								abortError = new Error(
/******/ 									"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "accepted":
/******/ 							if (options.onAccepted) options.onAccepted(result);
/******/ 							doApply = true;
/******/ 							break;
/******/ 						case "disposed":
/******/ 							if (options.onDisposed) options.onDisposed(result);
/******/ 							doDispose = true;
/******/ 							break;
/******/ 						default:
/******/ 							throw new Error("Unexception type " + result.type);
/******/ 					}
/******/ 					if (abortError) {
/******/ 						return {
/******/ 							error: abortError
/******/ 						};
/******/ 					}
/******/ 					if (doApply) {
/******/ 						appliedUpdate[moduleId] = newModuleFactory;
/******/ 						addAllToSet(outdatedModules, result.outdatedModules);
/******/ 						for (moduleId in result.outdatedDependencies) {
/******/ 							if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
/******/ 								if (!outdatedDependencies[moduleId])
/******/ 									outdatedDependencies[moduleId] = [];
/******/ 								addAllToSet(
/******/ 									outdatedDependencies[moduleId],
/******/ 									result.outdatedDependencies[moduleId]
/******/ 								);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 					if (doDispose) {
/******/ 						addAllToSet(outdatedModules, [result.moduleId]);
/******/ 						appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 			currentUpdate = undefined;
/******/ 		
/******/ 			// Store self accepted outdated modules to require them later by the module system
/******/ 			var outdatedSelfAcceptedModules = [];
/******/ 			for (var j = 0; j < outdatedModules.length; j++) {
/******/ 				var outdatedModuleId = outdatedModules[j];
/******/ 				var module = __webpack_require__.c[outdatedModuleId];
/******/ 				if (
/******/ 					module &&
/******/ 					(module.hot._selfAccepted || module.hot._main) &&
/******/ 					// removed self-accepted modules should not be required
/******/ 					appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
/******/ 					// when called invalidate self-accepting is not possible
/******/ 					!module.hot._selfInvalidated
/******/ 				) {
/******/ 					outdatedSelfAcceptedModules.push({
/******/ 						module: outdatedModuleId,
/******/ 						require: module.hot._requireSelf,
/******/ 						errorHandler: module.hot._selfAccepted
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			var moduleOutdatedDependencies;
/******/ 		
/******/ 			return {
/******/ 				dispose: function () {
/******/ 					currentUpdateRemovedChunks.forEach(function (chunkId) {
/******/ 						delete installedChunks[chunkId];
/******/ 					});
/******/ 					currentUpdateRemovedChunks = undefined;
/******/ 		
/******/ 					var idx;
/******/ 					var queue = outdatedModules.slice();
/******/ 					while (queue.length > 0) {
/******/ 						var moduleId = queue.pop();
/******/ 						var module = __webpack_require__.c[moduleId];
/******/ 						if (!module) continue;
/******/ 		
/******/ 						var data = {};
/******/ 		
/******/ 						// Call dispose handlers
/******/ 						var disposeHandlers = module.hot._disposeHandlers;
/******/ 						for (j = 0; j < disposeHandlers.length; j++) {
/******/ 							disposeHandlers[j].call(null, data);
/******/ 						}
/******/ 						__webpack_require__.hmrD[moduleId] = data;
/******/ 		
/******/ 						// disable module (this disables requires from this module)
/******/ 						module.hot.active = false;
/******/ 		
/******/ 						// remove module from cache
/******/ 						delete __webpack_require__.c[moduleId];
/******/ 		
/******/ 						// when disposing there is no need to call dispose handler
/******/ 						delete outdatedDependencies[moduleId];
/******/ 		
/******/ 						// remove "parents" references from all children
/******/ 						for (j = 0; j < module.children.length; j++) {
/******/ 							var child = __webpack_require__.c[module.children[j]];
/******/ 							if (!child) continue;
/******/ 							idx = child.parents.indexOf(moduleId);
/******/ 							if (idx >= 0) {
/******/ 								child.parents.splice(idx, 1);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// remove outdated dependency from module children
/******/ 					var dependency;
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									dependency = moduleOutdatedDependencies[j];
/******/ 									idx = module.children.indexOf(dependency);
/******/ 									if (idx >= 0) module.children.splice(idx, 1);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				},
/******/ 				apply: function (reportError) {
/******/ 					// insert new code
/******/ 					for (var updateModuleId in appliedUpdate) {
/******/ 						if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
/******/ 							__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// run new runtime modules
/******/ 					for (var i = 0; i < currentUpdateRuntime.length; i++) {
/******/ 						currentUpdateRuntime[i](__webpack_require__);
/******/ 					}
/******/ 		
/******/ 					// call accept handlers
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							var module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								var callbacks = [];
/******/ 								var errorHandlers = [];
/******/ 								var dependenciesForCallbacks = [];
/******/ 								for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									var dependency = moduleOutdatedDependencies[j];
/******/ 									var acceptCallback =
/******/ 										module.hot._acceptedDependencies[dependency];
/******/ 									var errorHandler =
/******/ 										module.hot._acceptedErrorHandlers[dependency];
/******/ 									if (acceptCallback) {
/******/ 										if (callbacks.indexOf(acceptCallback) !== -1) continue;
/******/ 										callbacks.push(acceptCallback);
/******/ 										errorHandlers.push(errorHandler);
/******/ 										dependenciesForCallbacks.push(dependency);
/******/ 									}
/******/ 								}
/******/ 								for (var k = 0; k < callbacks.length; k++) {
/******/ 									try {
/******/ 										callbacks[k].call(null, moduleOutdatedDependencies);
/******/ 									} catch (err) {
/******/ 										if (typeof errorHandlers[k] === "function") {
/******/ 											try {
/******/ 												errorHandlers[k](err, {
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k]
/******/ 												});
/******/ 											} catch (err2) {
/******/ 												if (options.onErrored) {
/******/ 													options.onErrored({
/******/ 														type: "accept-error-handler-errored",
/******/ 														moduleId: outdatedModuleId,
/******/ 														dependencyId: dependenciesForCallbacks[k],
/******/ 														error: err2,
/******/ 														originalError: err
/******/ 													});
/******/ 												}
/******/ 												if (!options.ignoreErrored) {
/******/ 													reportError(err2);
/******/ 													reportError(err);
/******/ 												}
/******/ 											}
/******/ 										} else {
/******/ 											if (options.onErrored) {
/******/ 												options.onErrored({
/******/ 													type: "accept-errored",
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k],
/******/ 													error: err
/******/ 												});
/******/ 											}
/******/ 											if (!options.ignoreErrored) {
/******/ 												reportError(err);
/******/ 											}
/******/ 										}
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// Load self accepted modules
/******/ 					for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
/******/ 						var item = outdatedSelfAcceptedModules[o];
/******/ 						var moduleId = item.module;
/******/ 						try {
/******/ 							item.require(moduleId);
/******/ 						} catch (err) {
/******/ 							if (typeof item.errorHandler === "function") {
/******/ 								try {
/******/ 									item.errorHandler(err, {
/******/ 										moduleId: moduleId,
/******/ 										module: __webpack_require__.c[moduleId]
/******/ 									});
/******/ 								} catch (err1) {
/******/ 									if (options.onErrored) {
/******/ 										options.onErrored({
/******/ 											type: "self-accept-error-handler-errored",
/******/ 											moduleId: moduleId,
/******/ 											error: err1,
/******/ 											originalError: err
/******/ 										});
/******/ 									}
/******/ 									if (!options.ignoreErrored) {
/******/ 										reportError(err1);
/******/ 										reportError(err);
/******/ 									}
/******/ 								}
/******/ 							} else {
/******/ 								if (options.onErrored) {
/******/ 									options.onErrored({
/******/ 										type: "self-accept-errored",
/******/ 										moduleId: moduleId,
/******/ 										error: err
/******/ 									});
/******/ 								}
/******/ 								if (!options.ignoreErrored) {
/******/ 									reportError(err);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					return outdatedModules;
/******/ 				}
/******/ 			};
/******/ 		}
/******/ 		__webpack_require__.hmrI.jsonp = function (moduleId, applyHandlers) {
/******/ 			if (!currentUpdate) {
/******/ 				currentUpdate = {};
/******/ 				currentUpdateRuntime = [];
/******/ 				currentUpdateRemovedChunks = [];
/******/ 				applyHandlers.push(applyHandler);
/******/ 			}
/******/ 			if (!__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 				currentUpdate[moduleId] = __webpack_require__.m[moduleId];
/******/ 			}
/******/ 		};
/******/ 		__webpack_require__.hmrC.jsonp = function (
/******/ 			chunkIds,
/******/ 			removedChunks,
/******/ 			removedModules,
/******/ 			promises,
/******/ 			applyHandlers,
/******/ 			updatedModulesList
/******/ 		) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			currentUpdateChunks = {};
/******/ 			currentUpdateRemovedChunks = removedChunks;
/******/ 			currentUpdate = removedModules.reduce(function (obj, key) {
/******/ 				obj[key] = false;
/******/ 				return obj;
/******/ 			}, {});
/******/ 			currentUpdateRuntime = [];
/******/ 			chunkIds.forEach(function (chunkId) {
/******/ 				if (
/******/ 					__webpack_require__.o(installedChunks, chunkId) &&
/******/ 					installedChunks[chunkId] !== undefined
/******/ 				) {
/******/ 					promises.push(loadUpdateChunk(chunkId, updatedModulesList));
/******/ 					currentUpdateChunks[chunkId] = true;
/******/ 				} else {
/******/ 					currentUpdateChunks[chunkId] = false;
/******/ 				}
/******/ 			});
/******/ 			if (__webpack_require__.f) {
/******/ 				__webpack_require__.f.jsonpHmr = function (chunkId, promises) {
/******/ 					if (
/******/ 						currentUpdateChunks &&
/******/ 						__webpack_require__.o(currentUpdateChunks, chunkId) &&
/******/ 						!currentUpdateChunks[chunkId]
/******/ 					) {
/******/ 						promises.push(loadUpdateChunk(chunkId));
/******/ 						currentUpdateChunks[chunkId] = true;
/******/ 					}
/******/ 				};
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.hmrM = () => {
/******/ 			if (typeof fetch === "undefined") throw new Error("No browser support: need fetch API");
/******/ 			return fetch(__webpack_require__.p + __webpack_require__.hmrF()).then((response) => {
/******/ 				if(response.status === 404) return; // no update available
/******/ 				if(!response.ok) throw new Error("Failed to fetch update manifest " + response.statusText);
/******/ 				return response.json();
/******/ 			});
/******/ 		};
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	var __webpack_exports__ = __webpack_require__(574);
/******/ 	__webpack_exports__ = __webpack_exports__["default"];
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});