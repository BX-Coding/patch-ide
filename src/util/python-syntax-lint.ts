import { syntaxTree } from "@codemirror/language";
import { Diagnostic, linter } from "@codemirror/lint";
import { EditorView, ViewUpdate } from "@codemirror/view";
import { VmError } from "../components/EditorPane/types";

let isSyntaxErrorFree = true;

const pythonLinter = (
  syntaxThreadCallback: (...props: any) => any,
  getDiagnostics: () => VmError[]
) => {
  return linter((view) => {
    let doc = view.state.doc;
    let diagnostics: Diagnostic[] = getDiagnostics().map((error: VmError) => {
      const shiftedLineNumber = Math.min(error.lineNumber, doc.lines);
      const lowerBoundedLineNumber = Math.max(shiftedLineNumber, 1);

      return {
        from: doc.line(lowerBoundedLineNumber).from,
        to: doc.line(lowerBoundedLineNumber).to,
        severity: error.fresh ? "error" : "warning",
        message: error.message,
      };
    });
    isSyntaxErrorFree = true;
    syntaxTree(view.state)
      .cursor()
      .iterate((node) => {
        if (node.type.isError)
          diagnostics.push({
            from: node.from,
            to: node.to,
            severity: "error",
            message: "Syntax Error",
          });
        if (diagnostics.length > 0) {
          isSyntaxErrorFree = false;
        }
      });

    // set diagnostics to runtime errors if there are remaining syntax errors
    // if (runtimeErrorDiagnostics.length > 0 && !isSyntaxErrorFree) {
    //   diagnostics = runtimeErrorDiagnostics
    // } else {
    //   diagnostics = diagnostics.concat(runtimeErrorDiagnostics)
    // }

    syntaxThreadCallback(isSyntaxErrorFree);

    return diagnostics;
  });
};

export default pythonLinter;
