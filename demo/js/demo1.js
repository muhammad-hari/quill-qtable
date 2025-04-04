import QuilQtable from 'src/quill-qtable.js'
// import better-table styles file
import 'src/assets/quill-qtable.scss'

Quill.register({
  'modules/qtable': QuilQtable
}, true)

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
        bindings: QuilQtable.keyboardBindings
      }
    }
  })

  let tableModule = quill.getModule('qtable')
  document.body.querySelector('#insert-table')
    .onclick = () => {
      tableModule.insertTable(3, 3)
    }

  document.body.querySelector('#get-table')
    .onclick = () => {
      console.log(tableModule.getTable())
    }

  document.body.querySelector('#get-contents')
    .onclick = () => {
      console.log(quill.getContents())
    }
}
