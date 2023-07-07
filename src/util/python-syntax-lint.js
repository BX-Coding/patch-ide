import {syntaxTree} from "@codemirror/language"
import {linter} from "@codemirror/lint"

let isSyntaxErrorFree = true;

const pythonLinter = (syntaxThreadCallback, pyatchVM, threadId) => { return linter(view => {
  const runtimeErrors = pyatchVM.getRuntimeErrors().filter((error) => error.threadId === threadId);
  const compileTimeErrors = pyatchVM.getCompileTimeErrors().filter((error) => error.threadId === threadId);
  const vmErrors = runtimeErrors.concat(compileTimeErrors);
  let diagnostics = []
  isSyntaxErrorFree = true;
  syntaxTree(view.state).cursor().iterate(node => {
    if (node.type.isError) diagnostics.push({
      from: node.from,
      to: node.to,
      severity: "error",
      message: "Syntax Error",
    })
    if (diagnostics.length > 0) {
        isSyntaxErrorFree = false
    }
  })
  let doc = view.state.doc;
  const runtimeErrorDiagnostics = vmErrors.map((error) => {
    const shiftedLineNumber = Math.min(error.lineNumber, doc.lines);
    return {
      from: doc.line(shiftedLineNumber).from,
      to: doc.line(shiftedLineNumber).to,
      severity: "error",
      message: error.message,
      }
  });
  diagnostics = diagnostics.concat(runtimeErrorDiagnostics);
  syntaxThreadCallback(isSyntaxErrorFree);

  return diagnostics
})
}

export default pythonLinter;