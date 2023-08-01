import {syntaxTree} from "@codemirror/language"
import {Diagnostic, linter} from "@codemirror/lint"

let isSyntaxErrorFree = true;

const pythonLinter = (syntaxThreadCallback: (...props: any) => any, patchVM: any, threadId: string) => { return linter(view => {
  const runtimeErrors = patchVM.getRuntimeErrors().filter((error: any) => error.threadId === threadId);
  const compileTimeErrors = patchVM.getCompileTimeErrors().filter((error: any) => error.threadId === threadId);
  const vmErrors = runtimeErrors.concat(compileTimeErrors);
  let diagnostics: Diagnostic[] = []
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
  const runtimeErrorDiagnostics = vmErrors.map((error: any) => {
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