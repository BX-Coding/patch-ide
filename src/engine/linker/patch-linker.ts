import _ from "lodash";
import linkConstants from "./linker-constants";
import PrimProxy from "../worker/prim-proxy";

/**
 * @fileoverview
 * @author Elliot Roe
 *
 * Class for linking the raw python code inputted through the editor for each target to template that can be run in a single web worker.
 * This code is almost definitely not safe. Eventually, each targets python code will be executed in a separate worker.
 */
class PatchLinker {
    private _baseImports: string[];
    
    constructor() {
        this._baseImports = [];
    }

    /**
     * Set the base imports for the linker.
     * @param {string[]} imports
     * @returns {void}
     */
    set setBaseImports(imports: string[]) {
        this._baseImports = imports;
    }

    /**
     * Generates the method header for a target aysnc function.
     * @param {string} targetId - The id of the target.
     * @returns {string} - The method header for the target async function.
     */
    generateAsyncFuncHeader(targetId: string): string {
        return `${linkConstants.async_func_header + targetId}(${linkConstants.vm_proxy}):\n`;
    }

    /**
     * Generates comment header that signifies the beginning of a target's threads
     * @param {string} targetId - The id of the target.
     * @returns {string} - comment header
     */
    generateTargetHeader(targetId: string): string {
        return `## -- ${targetId} -- ##\n\n`;
    }

    /**
     * Generates the line of python code to unpack all the pyatch api primitives
     * @returns {string} - the line of python
     */
    registerProxyPrims(functionNames: string[]): string {
        let registerPrimsCode = "";
        functionNames.forEach((name) => {
            registerPrimsCode += `${linkConstants.python_tab_char + name} = ${linkConstants.vm_proxy}.${name}\n`;
        });

        return registerPrimsCode;
    }

    /**
     * Checks if the given functions are called within the provided Python code.
     *
     * @param {string[]} functionNames - An array of function names to check.
     * @param {string} pythonCode - A string containing the Python code to search for function calls.
     * @returns {string[]} - An array of function names that were called within the Python code.
     */
    getFunctionCalls(functionNames: string[], pythonCode: string): string[] {
        const calledFunctions: string[] = [];
        functionNames.forEach((functionName) => {
            const regex = new RegExp(`(^|\\W)${functionName}\\(`);
            if (regex.test(pythonCode)) {
                calledFunctions.push(functionName);
            }
        });
        return calledFunctions;
    }

    /**
     * Generates the line of python code to unpack all the pyatch api primitives
     * @returns {string} - the line of python
     */
    generateGlobalsAssignments(globalVars: { [x: string]: any; }): string {
        let snippet = "";
        Object.keys(globalVars).forEach((name) => {
            const value = globalVars[name];
            const valueValidated = typeof value !== "number" ? `'${value}'` : `${value}`;
            snippet += `${name} = ${valueValidated}\n`;
        });

        return snippet;
    }

    /**
     * Generates the line of python code to unpack all the pyatch api primitives
     * @returns {string} - the line of python
     */
    registerGlobalsImports(globalVariables: {}): string {
        let snippet = "";
        if (globalVariables) {
            Object.keys(globalVariables).forEach((name) => {
                snippet += `${linkConstants.python_tab_char}global ${name}\n`;
            });
        }

        return snippet;
    }

    /**
     * Adds the "async" keyword before all function definitions in python and returns a list
     * of function names that is did this proccess to.
     *
     * @param {string} pythonCode - A string containing the Python code to modify.
     * @returns {string[]} - The names of the functions that the async keyword was added to in their definitions.
     */
    addAsyncToFunctionDefinitions(pythonCode: string) {
        // eslint-disable-next-line prefer-regex-literals
        const regex = new RegExp(`(?<!\\basync\\s*)def\\s+(\\w+)`, "g");
        const newAwaitFunctions: string[] = [];
        const asyncedCode = pythonCode.replace(regex, (match, functionName) => {
            newAwaitFunctions.push(functionName);
            return `async def ${functionName}`;
        });
        return { asyncedCode, newAwaitFunctions };
    }

    /**
     * Adds the "await" keyword before certain function names in the provided Python code.
     *
     * @param {string} pythonCode - A string containing the Python code to modify.
     * @param {string[]} functionNames - An array of function names to add "await" before.
     * @returns {string} - The modified Python code with "await" added before specified function names.
     */
    addAwaitToPythonFunctions(pythonCode: string, functionNames: string[]): string {
        let modifiedCode = pythonCode;
        if (functionNames.length !== 0) {
            const regex = new RegExp(`(?<!\\b(await|def)\\s*)\\b(${functionNames.join("|")})(?=\\()`, "g");
            modifiedCode = pythonCode.replace(regex, "await $&");
        }
        return modifiedCode;
    }

    wrapThreadCode(threadId: string, script: string, globalVariables: object, calledPatchPrimitiveFunctions: any[]) {
        const passedCode = script || "pass";
        const { asyncedCode, newAwaitFunctions } = this.addAsyncToFunctionDefinitions(passedCode);
        const awaitedCode = this.addAwaitToPythonFunctions(asyncedCode, calledPatchPrimitiveFunctions.concat(newAwaitFunctions));
        const tabbedCode = awaitedCode.replaceAll("\n", `\n${linkConstants.python_tab_char}`);

        const header = this.generateAsyncFuncHeader(threadId);
        const registerPrimsSnippet = this.registerProxyPrims(calledPatchPrimitiveFunctions);
        const registerGlobalsImports = this.registerGlobalsImports(globalVariables);

        return `${header + registerGlobalsImports + registerPrimsSnippet + linkConstants.python_tab_char + tabbedCode}\n\n`;
    }

    /**
     * BAD FUNCTION PLEASE REFACTOR FOR FALL MVP
     */
    generateInterruptSnippet() {
        return `def throw_interrupt_error():\n${linkConstants.python_tab_char}raise RuntimeError("Thread Interrupted")\n\n`;
    }

    /**
     * Generate the fully linked executable python code.
     * @param {String} threadId - the id of the thread.
     * @param {String} script - the python code to be executed.
     * @param {Object} globalVariables - the global variables to be passed to the thread.
     *
     */
    generatePython(threadId: string, script: string, globalVariables: object) {
        const calledPatchPrimitiveFunctions = this.getFunctionCalls(PrimProxy.getPrimNames(), script);
        return this.wrapThreadCode(threadId, script, globalVariables, calledPatchPrimitiveFunctions);
    }

    /**
     * Generate the error transform function for a thread. This will be used to calculate the correct user facing line numbers.
     * @param {String} threadId - the id of the thread.
     * @param {String} script - the python code to be executed.
     * @param {Object} globalVariables - the global variables to be passed to the thread.
     *
     */
    generateErrorTransform(script: string, globalVariables: object): (threadId: string, message: any, lineNumber: number) => [string, string, number] {
        const calledPatchPrimitiveFunctions = this.getFunctionCalls(PrimProxy.getPrimNames(), script);
        const primitiveFunctionLines = (calledPatchPrimitiveFunctions ?? []).length;
        const globalVariableLines = Object.keys(globalVariables ?? {}).length;
        const headerLine = 1;
        return (_threadId: string, _message: any, _lineNumber: number) => [_threadId, _message, _lineNumber - primitiveFunctionLines - globalVariableLines - headerLine];
    }
}
export default PatchLinker;
