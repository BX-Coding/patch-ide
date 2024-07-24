import Worker from "web-worker";
import _ from "lodash";
import WorkerMessages from "./worker-messages";
import InterruptError from "./errors/interruptError";
import PrimProxy from "./prim-proxy";
import PatchLinker from "../linker/patch-linker";
import uid from "../util/safe-uid";
import { Dictionary } from "../interfaces";
import { GlobalVariable } from "../../store/variableEditorStore";

type ErrorCallbackType = (threadId: string, message: any, lineNumber: number, type: string) => void;

type LoadingPromiseType = { resolve: (value?: any) => void; reject: (reason?: any) => void; }

type BlockOperationCallbackType = (opcode: string, args: any) => Promise<{ id: string; result?: any; }>;

class PatchWorker {
    _worker: Worker;
    _blockOPCallbackMap: Dictionary<BlockOperationCallbackType>;
    _errorCallback: ErrorCallbackType;
    _threadErrorCallbackMap: Dictionary<any>;
    _threadInterruptMap: Dictionary<any>;
    _pyodidePromiseResolve?: (value?: any) => void;
    _loadingPromiseMap: Dictionary<LoadingPromiseType>;
    _threadPromiseMap: Dictionary<any>;
    patchLinker: PatchLinker;
    _pythonInterruptBuffer: any;
    
    constructor(errorCallback: ErrorCallbackType) {
        //this._worker = new Worker(new URL("./pyodide-web.worker.ts", import.meta.url), { type: "module" });
        this._worker = new Worker(new URL("./pyodide-web.worker.ts", import.meta.url), { type: "module" });

        this._worker.onmessage = this.handleWorkerMessage.bind(this);
        this._blockOPCallbackMap = {};
        this._errorCallback = errorCallback;
        this._threadErrorCallbackMap = {};

        this._threadInterruptMap = {};

        this._pyodidePromiseResolve = undefined;
        this._loadingPromiseMap = {};
        this._threadPromiseMap = {};

        this.patchLinker = new PatchLinker();
    }

    handleWorkerMessage(event: MessageEvent<any>) {
        if (event.data.id === WorkerMessages.ToVM.PyodideLoaded) {
            this._pyodidePromiseResolve && this._pyodidePromiseResolve();
        } else if (event.data.id === WorkerMessages.ToVM.PromiseLoaded) {
            const { loadPromiseId } = event.data;
            this._loadingPromiseMap[loadPromiseId!].resolve();
        } else if (event.data.id === WorkerMessages.ToVM.BlockOP) {
            const { threadId, opCode, args, token } = event.data;
            this._blockOPCallbackMap[threadId!](opCode, args).then((result) => {
                this.postResultValue(result, token);
            });
        } else if (event.data.id === WorkerMessages.ToVM.ThreadDone) {
            const { threadId } = event.data;
            this._threadPromiseMap[threadId!].resolve();
        } else if (event.data.id === WorkerMessages.ToVM.PythonError) {
            const { threadId, message, lineNumber, type } = event.data;
            if (this._threadErrorCallbackMap[threadId!]) {
                this._threadErrorCallbackMap[threadId!](threadId, message, lineNumber, type);
                if (type === "CompileTimeError") {
                    const { loadPromiseId } = event.data;
                    this._loadingPromiseMap[loadPromiseId!].reject();
                }
            } else {
                this._errorCallback(threadId, message, lineNumber, type);
            }
        }
    }

    async loadPyodide() {
        const initMessage = {
            id: WorkerMessages.FromVM.InitPyodide,
            interruptBuffer: this._pythonInterruptBuffer,
        };
        await new Promise((resolve, reject) => {
            this._pyodidePromiseResolve = resolve;
            this._worker.postMessage(initMessage);
            setTimeout(() => {
                console.warn("Pyodide is taking long to load. This may be due to a slow network connection. Please try again.");
            }, 10000);
        });
    }

    async loadWorker() {
        await this.loadPyodide();
        await this.loadInterruptFunction();
    }

    async loadGlobal(script: string, threadId = "") {
        await this._worker;
        const loadPromiseId = uid();
        const message = {
            id: WorkerMessages.FromVM.LoadGlobal,
            script,
            loadPromiseId,
            threadId,
        };

        return new Promise((resolve, reject) => {
            this._loadingPromiseMap[loadPromiseId] = { resolve, reject };
            this._worker.postMessage(message);
        });
    }

    async loadInterruptFunction() {
        const script = this.patchLinker.generateInterruptSnippet();
        await this.loadGlobal(script);
    }

    async loadThread(threadId: string, script: string, globalVaraibles: Dictionary<GlobalVariable>) {
        const wrappedScript = this.patchLinker.generatePython(threadId, script, globalVaraibles);
        const transformError = this.patchLinker.generateErrorTransform(script, globalVaraibles);
        this._threadErrorCallbackMap[threadId] = (...args: any[]) => this._errorCallback(...transformError(args[0], args[1], args[2]), args[3]);
        let success = true;
        try {
            await this.loadGlobal(wrappedScript, threadId);
        } catch (e) {
            success = false;
        }
        return success;
    }

    async loadGlobalVariable(name: string, value: any) {
        const script = this.patchLinker.generateGlobalsAssignments({ [name]: value });
        await this.loadGlobal(script);
    }

    async startThread(threadId: string, blockOpertationCallback: BlockOperationCallbackType) {
        const threadPromise = new Promise((resolve, reject) => {
            this._threadPromiseMap[threadId] = { ...this._threadPromiseMap[threadId], threadPromise: null, resolve, reject };
        });
        this._threadPromiseMap[threadId] = { ...this._threadPromiseMap[threadId], threadPromise };

        this._blockOPCallbackMap[threadId] = blockOpertationCallback;

        const message = {
            id: WorkerMessages.FromVM.StartThread,
            threadId,
        };
        this._worker.postMessage(message);
        await threadPromise;
    }

    async stopThread(threadId: string) {
        if (this._threadPromiseMap[threadId]) {
            const endThreadPromise = this._threadPromiseMap[threadId].threadPromise;
            await endThreadPromise;
        }
    }

    /**
     * Post a ResultValue message to a worker in reply to a particular message.
     * The outgoing message's reply token will be copied from the provided message.
     * @param {object} message The originating message to which this is a reply.
     * @param {*} value The value to send as a result.
     * @private
     */
    postResultValue(value: any, token: any) {
        this._worker.postMessage({
            id: WorkerMessages.FromVM.ResultValue,
            value,
            token,
        });
    }

    async terminate() {
        this._worker.terminate();
    }

    postMessage(message: any) {
        this._worker.postMessage(message);
    }
}

export default PatchWorker;
