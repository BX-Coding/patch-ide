import safeUid from "./util/safe-uid";
import { Sprite, Stage } from "leopard";
import Runtime from "./runtime";
import { BlockFunctionType } from "./blocks";
import PatchWorker from "./worker/patch-worker";

/**
 * A thread is just a queue of all the block operations requested by the worker
 * @constructor
 */
export default class Thread {
    target: Sprite | Stage;
    runtime: Runtime;

    status: number;
    id: string;
    //blockUtility: any;
    script: string;
    triggerEvent: string;
    triggerEventOption: string;
    loadPromise: Promise<boolean> | boolean;
    interruptThread: boolean;
    running: boolean;
    displayName: string;
    worker: PatchWorker;

    /**
     * How rapidly we try to step threads by default, in ms.
     */
    static get THREAD_STEP_INTERVAL() {
        return 1000 / 60;
    }

    constructor(runtime: Runtime, target: Sprite | Stage, script: string, triggerEventId: string, triggerEventOption: string, displayName: string) {
        this.target = target;
        this.runtime = runtime;
        this.worker = runtime.patchWorker;

        this.status = 0;

        /**
         * A unique ID for this target.
         * @type {string}
         */
        this.id = safeUid();

        //this.blockUtility = new BlockUtility(this.target, this.runtime, this);

        this.script = script;
        this.triggerEvent = triggerEventId;
        this.triggerEventOption = triggerEventOption;
        this.displayName = displayName;

        this.loadPromise = this.loadThread(this.script);

        this.interruptThread = false;
        this.running = false;
    }

    async loadThread(script: string) {
        // I'm leaving the old code below for reference

        // Confirm worker is loaded
        await this.runtime.workerLoadPromise;

        // Reset Error Messages
        this.runtime.compileTimeErrors = this.runtime.compileTimeErrors.filter((error) => error.threadId !== this.id);
        this.runtime.runtimeErrors = this.runtime.runtimeErrors.filter((error) => error.threadId !== this.id);

        // Stop the current running thread
        const wasRunning = this.running;
        if (this.running) {
            await this.stopThread();
        }

        this.loadPromise = await this.worker.loadThread(this.id, script, this.runtime._globalVariables);

        // Restart the thread if it was running
        if (wasRunning) {
            await this.startThread();
        }

        return this.loadPromise;
    }

    async startThread() {
        // I'm leaving the old code below for reference
        // If the last load had no syntax errors run it
        console.log(this.script);
        if (this.loadPromise) {
            // If the thread is already running, restart it
            if (this.running) {
                await this.stopThread();
            }
            this.interruptThread = false;
            this.runtime.runtimeErrors = this.runtime.runtimeErrors.filter((error) => error.threadId !== this.id);
            this.running = true;
            await this.worker.startThread(this.id, this.executeBlock);
            this.running = false;
        }
    }

    async stopThread() {
        // I'm leaving the old code below for reference
        if (this.running) {
            this.interruptThread = true;
            await this.worker.stopThread(this.id);
            this.running = false;
            this.interruptThread = false;
        }
    }

    async updateThreadScript(script: string) {
        await this.loadThread(script);
        this.script = script;
    }

    async updateThreadTriggerEvent(triggerEventId: string) {
        this.triggerEvent = triggerEventId;
    }

    async updateThreadTriggerEventOption(triggerEventOption: string) {
        this.triggerEventOption = triggerEventOption;
    }

    async executePrimitive(blockFunction: BlockFunctionType, args: any[]) {
        // I'm leaving the old code below for reference
        const tick = async (resolve: (arg0: { id: string; result?: any; }) => void) => {
            if (this.interruptThread) {
                resolve({ id: "InterruptThread" });
                return;
            }
            if (this.status !== Thread.STATUS_YIELD_TICK && this.status !== Thread.STATUS_RUNNING) {
                resolve({ id: "ResultValue", result: null });
                return;
            }

            this.status = Thread.STATUS_RUNNING;
            const result = blockFunction(this, args);

            if (this.interruptThread) {
                resolve({ id: "InterruptThread" });
                return;
            }
            if (this.status !== Thread.STATUS_YIELD_TICK) {
                resolve({ id: "ResultValue", result });
                return;
            }
            setTimeout(tick.bind(this, resolve), Thread.THREAD_STEP_INTERVAL);
        };
        const returnValue = await new Promise(tick);
        return returnValue;
    }

    executeBlock = async (opcode: any, args: any) => {
        // I'm leaving the old code below for reference
        this.status = Thread.STATUS_RUNNING;
        const blockFunction = this.runtime.getOpcodeFunction(opcode);
        const result = await this.executePrimitive(blockFunction, args);
        return result;
    };

    done() {
        // I'm leaving the old code below for reference
        return this.status === Thread.STATUS_DONE;
    }

    /**
     * Thread status for initialized or running thread.
     * This is the default state for a thread - execution should run normally,
     * stepping from block to block.
     * @const
     */
    static get STATUS_RUNNING() {
        return 0;
    }

    /**
     * Threads are in this state when a primitive is waiting on a promise;
     * execution is paused until the promise changes thread status.
     * @const
     */
    static get STATUS_PROMISE_WAIT() {
        return 1;
    }

    /**
     * Thread status for yield.
     * @const
     */
    static get STATUS_YIELD() {
        return 2;
    }

    /**
     * Thread status for a single-tick yield. This will be cleared when the
     * thread is resumed.
     * @const
     */
    static get STATUS_YIELD_TICK() {
        return 3;
    }

    /**
     * Thread status for a finished/done thread.
     * Thread is in this state when there are no more blocks to execute.
     * @const
     */
    static get STATUS_DONE() {
        return 4;
    }

    /**
     * Thread is done with everything in its block queue
     * Idling waiting for a new message
     * @const
     */
    static get STATUS_IDLE() {
        return 5;
    }

    /**
     * Get the status of this thread.
     */
    getStatus() {
        return this.status;
    }

    /**
     * Set the status of this thread.
     */
    setStatus(newStatus: number) {
        this.status = newStatus;
    }

    yield() {
        this.setStatus(Thread.STATUS_YIELD);
    }

    yieldTick() {
        this.setStatus(Thread.STATUS_YIELD_TICK);
    }

    endThread() {
        this.setStatus(Thread.STATUS_DONE);
    }
}