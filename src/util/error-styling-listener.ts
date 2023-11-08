import { syntaxTree } from "@codemirror/language"
import { Diagnostic, forEachDiagnostic, linter } from "@codemirror/lint"
import { EditorView, ViewUpdate } from "@codemirror/view"
import { useEffect, useState } from "react"
import { EditorState } from "../store"


const warningLinter = (patchVM: any, threadId: string) => {

    const [edited, setEdited] = useState(false)
    return (
        EditorView.updateListener.of((view: ViewUpdate) => {
            let diagnostics: Diagnostic[] = []
            const runtimeErrors = patchVM.getRuntimeErrors().filter((error: any) => error.threadId === threadId);
            const compileTimeErrors = patchVM.getCompileTimeErrors().filter((error: any) => error.threadId === threadId);
            const vmErrors = runtimeErrors.concat(compileTimeErrors);
            let doc = view.state.doc;



            if (vmErrors.length > 0) {
                let diagnostics: Diagnostic[] = []

                const runtimeErrorDiagnostics = vmErrors.map((error: any) => {
                    const shiftedLineNumber = Math.min(error.lineNumber, doc.lines);
                    return {
                        from: doc.line(shiftedLineNumber).from,
                        to: doc.line(shiftedLineNumber).to,
                        severity: "warning",
                        message: error.message,
                    }
                })
                console.log("runtimeErrorDiagnostics: ", runtimeErrorDiagnostics)
                diagnostics = runtimeErrorDiagnostics
                return diagnostics

            }
        })
    )
}
export default warningLinter

