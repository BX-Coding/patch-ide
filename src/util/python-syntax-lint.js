import {syntaxTree} from "@codemirror/language"
import {linter} from "@codemirror/lint"

let isErrorFree = true;

const pythonLinter = (syntaxThreadCallback) => { return linter(view => {
  let diagnostics = []
  isErrorFree = true;
  syntaxTree(view.state).cursor().iterate(node => {
    if (node.type.isError) diagnostics.push({
      from: node.from,
      to: node.to,
      severity: "error",
      message: "Syntax Error",
    })
    if (diagnostics.length > 0) {
        isErrorFree = false
    }
  })
  syntaxThreadCallback(isErrorFree);

  return diagnostics
})
}

export default pythonLinter;