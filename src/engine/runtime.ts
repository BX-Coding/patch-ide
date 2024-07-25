import EventEmitter from "events";
import { Project, Sprite, Stage, Trigger } from "leopard";
import {
    defaultSprites,
    defaultStage,
} from "./default_project/default-project";

import { Dictionary } from "./interfaces";
import Thread from "./thread";
import BlockFunctions from "./blocks";
import PatchWorker from "./worker/patch-worker";
import { GlobalVariable } from "../store/variableEditorStore";
import PatchLinker from "./linker/patch-linker";

// This class manages the state of targets and other stuff

export default class Runtime extends EventEmitter {
    leopardProject?: Project;
    protected _sprites: Dictionary<{
        sprite: Sprite;
        threads: Dictionary<Thread>;
    }>;
    protected _stage: { stage: Stage; threads: Dictionary<Thread> };
    protected renderTarget?: string | HTMLElement;
    patchWorker: PatchWorker;
    runtimeErrors: any[];
    compileTimeErrors: any[];
    workerLoadPromise: Promise<void>;
    workerLoaded: boolean;
    _globalVariables: Dictionary<GlobalVariable>;

    constructor() {
        super();

        this._globalVariables = {};

        this._sprites = defaultSprites;
        this._stage = { stage: defaultStage, threads: {} };

        this.leopardProject = new Project(
            this.getTargetForStage(),
            this.sprites
        );

        this.runtimeErrors = [];
        this.compileTimeErrors = [];
        this.patchWorker = new PatchWorker((threadId: any, message: any, lineNumber: any, type: string) => {
            if (type === "RuntimeError") {
                this.runtimeErrors.push({ threadId, message, lineNumber, type });
                this.emit("RUNTIME ERROR", { threadId, message, lineNumber, type });
            } else if (type === "CompileTimeError") {
                this.compileTimeErrors.push({ threadId, message, lineNumber, type });
                this.emit("COMPILE TIME ERROR", { threadId, message, lineNumber, type });
            }
        });
        this.workerLoaded = false;
        this.workerLoadPromise = this.patchWorker.loadWorker().then(() => {
            this.workerLoaded = true;
            this.emit("WORKER READY");
            console.log("Worker ready.");
            // In React, the constructor runs twice for some reason. Only add a thread the first time.
            !Object.keys(this._sprites["Patch"].threads).length &&
                this.addThread(
                    "Patch",
                    "",
                    "event_whenflagclicked",
                    "",
                    "Thread 0"
                );

            !Object.keys(this._stage.threads).length &&
                this.addThread(
                    "Stage",
                    "",
                    "event_whenflagclicked",
                    "",
                    "Thread 0"
                );
        });

        console.log(this);
    }

    get targets(): Dictionary<Sprite | Stage> {
        return { Stage: this._stage.stage, ...this.sprites };
    }

    addTarget(target: Sprite | Stage) {
        if (target instanceof Stage) {
            if (this._stage) {
                console.error("Can't add a stage; one already exists.");
                return "";
            } else {
                this._stage = { stage: target, threads: {} };
                return "Stage";
            }
        } else {
            if (target.id && target.id != "") {
                this._sprites[target.id] = { sprite: target, threads: {} };

                return target.id;
            } else {
                console.warn("No id on the target to add. Creating a new one.");

                const tryId = "Sprite";
                let tryNumber = 1;

                while (this.getTargetById(tryId + tryNumber.toString())) {
                    tryNumber++;
                }

                const newId = tryId + tryNumber;

                target.id = newId;
                this._sprites[newId] = { sprite: target, threads: {} };

                return newId;
            }
        }
    }

    get sprites(): Dictionary<Sprite> {
        return Object.fromEntries(
            Object.keys(this._sprites).map((id) => [
                id,
                this._sprites[id].sprite,
            ])
        );
    }

    async greenFlag() {
        //this.leopardProject?.greenFlag();
        await this.stopAll();
        for (let targetId of ["Stage", ...Object.keys(this._sprites)]) {
            const threads = this.getTargetThreads(targetId);
            
            const threadIds = Object.keys(threads);

            this.targets[targetId].triggers = [];

            threadIds.forEach(threadId => {
                const triggerEvent = threads[threadId].triggerEvent;
                const triggerEventOption = threads[threadId].triggerEventOption;

                switch (triggerEvent) {
                    case "event_whenkeypressed":
                        this.targets[targetId].triggers.push(new Trigger(Trigger.KEY_PRESSED, {key: triggerEventOption.toLowerCase()}, (() => {threads[threadId].startThread()}) as GeneratorFunction))
                        break;
                    case "event_whenthisspriteclicked":
                        this.targets[targetId].triggers.push(new Trigger(Trigger.CLICKED, (() => {threads[threadId].startThread()}) as GeneratorFunction))
                        break;
                    case "control_start_as_clone":
                        this.targets[targetId].triggers.push(new Trigger(Trigger.CLONE_START, (() => {threads[threadId].startThread()}) as GeneratorFunction))
                        break;
                    case "event_whentouchingobject":
                        console.log("when_touching trigger not supported.");
                        break;
                    case "event_whenstageclicked":
                        this.getTargetForStage().triggers.push(new Trigger(Trigger.CLICKED, (() => {threads[threadId].startThread()}) as GeneratorFunction))
                        break;
                    case "event_whenbackdropswitchesto":
                        this.targets[targetId].triggers.push(new Trigger(Trigger.BACKDROP_CHANGED, {backdrop: triggerEventOption}, (() => {threads[threadId].startThread()}) as GeneratorFunction))
                        break;
                    case "event_whengreaterthan":
                        this.targets[targetId].triggers.push(new Trigger(Trigger.LOUDNESS_GREATER_THAN, (() => {threads[threadId].startThread()}) as GeneratorFunction))
                        break;
                    case "event_whenbroadcastreceived":
                        this.targets[targetId].triggers.push(new Trigger(Trigger.BROADCAST, (() => {threads[threadId].startThread()}) as GeneratorFunction))
                        break;
                }
            });
        }
        this.startHats("event_whenflagclicked");
    }

    stopAll() {
        Object.keys(this.targets).forEach(targetId => {
            const threads = this.getTargetThreads(targetId);

            Object.keys(threads).forEach(threadId => {
                threads[threadId].stopThread();
            });
        })
    }

    dispose() { }

    attachRenderTarget(renderTarget: string | HTMLElement) {
        this.renderTarget = renderTarget;
        this.leopardProject?.attach(renderTarget);
    }

    getTargetForStage() {
        return this._stage.stage;
    }

    renameSprite(id: string, newName: string) {
        if (!this._sprites[id]) {
            console.warn(`Sprite ${id} doesn't exist; can't rename it.`);
            return null;
        }

        if (this.targets[newName]) {
            console.warn(`Trying to rename/change id of sprite ${id} to ${newName}, but that name/id is already taken.`);
        } else if (newName == "Stage") {
            console.warn(`Trying to rename ${id} to "Stage" but naming a sprite "Stage" isn't allowed.`)
        } else {
            // TODO: consider renaming all references to this sprite as well (in python code and stuff)
            this._sprites[newName] = this._sprites[id];
            this._sprites[newName].sprite.id = newName;
            delete this._sprites[id];

            this.emit(Runtime.TARGETS_UPDATE)
        }

        return null;
    }

    getTargetById(id: string) {
        return this.targets[id];
    }

    getTargetThreads(id: string) {
        return id == "Stage" ? this._stage.threads : this._sprites[id]?.threads;
    }

    getThreadSprite(id: string) {
        const spriteIds = Object.keys(this._sprites);

        for (const spriteId of spriteIds) {
            if (this._sprites[spriteId].threads[id]) return spriteId;
        }

        return undefined;
    }

    async startHats(hat: string, option?: string) {
        const executionPromises: Promise<void>[] = [];

        Object.keys(this.targets).forEach((targetId) => {
            const threads = this.getTargetThreads(targetId);

            const threadIds = Object.keys(threads);

            threadIds.forEach((threadId) => {
                if ((threads[threadId].triggerEvent == hat) && (option ? (threads[threadId].triggerEventOption == option) : true)) {
                    executionPromises.push(threads[threadId].startThread());
                }
            })
        });

        await Promise.all(executionPromises);
    }

    getThreadById(id: string) {
        const spriteId = this.getThreadSprite(id);

        if (spriteId) return this._sprites[spriteId].threads[id];

        console.log("Thread " + id + " not found.");

        return undefined;
    }

    deleteThread(id: string) {
        const spriteId = this.getThreadSprite(id);

        if (spriteId) { delete this._sprites[spriteId].threads[id]; return 0; }

        console.log("Thread " + id + " not found; couldn't delete it.");

        return -1;
    }

    async addThread(
        targetId: string,
        script: string,
        triggerEventId: string,
        option: string,
        displayName = ""
    ) {
        const newThread = new Thread(
            this,
            this.getTargetById(targetId),
            script,
            triggerEventId,
            option,
            displayName
        );
        const threadId = newThread.id;
        if (targetId == "Stage") {
            this._stage.threads[threadId] = newThread;
        } else {
            this._sprites[targetId].threads[threadId] = newThread;
        }
        await newThread.loadPromise;
        return threadId;
    }

    updateThreadScript(threadId: string, script: string) {
        const thread = this.getThreadById(threadId);
        thread && thread.updateThreadScript(script);
    }

    updateThreadTriggerEvent(threadId: string, eventTrigger: string) {
        const thread = this.getThreadById(threadId);
        thread && thread.updateThreadTriggerEvent(eventTrigger);
    }

    updateThreadTriggerEventOption(threadId: string, eventTriggerOption: string) {
        const thread = this.getThreadById(threadId);
        thread && thread.updateThreadTriggerEventOption(eventTriggerOption);
    }

    emitProjectChanged() {
        this.emit(Runtime.PROJECT_CHANGED);
    }

    getOpcodeFunction(opcode: string) {
        const placeholderFunc = (target: Sprite | Stage, ...args: []) => {console.log("Calling function that couldn't be found: " + opcode + (target as Sprite).x)};
        return BlockFunctions[opcode] ?? placeholderFunc;
    }

    updateGlobalVariable(name: string, value: any) {
        this._globalVariables[String(name)] = value;
        this.patchWorker.loadGlobalVariable(String(name), value);
    }

    removeGlobalVariable(name: string) {
        delete this._globalVariables[String(name)];
    }

    getGlobalVariables() {
        return Object.keys(this._globalVariables).map((name) => ({ name, value: this._globalVariables[name] }));
    }

    static get STAGE_WIDTH() {
        return 480;
    }

    static get STAGE_HEIGHT() {
        return 360;
    }

    static get PROJECT_START() {
        return "PROJECT_START";
    }

    static get PROJECT_STOP_ALL() {
        return "PROJECT_STOP_ALL";
    }

    static get STOP_FOR_TARGET() {
        return "STOP_FOR_TARGET";
    }

    static get PROJECT_LOADED() {
        return "PROJECT_LOADED";
    }

    static get PROJECT_CHANGED() {
        return "PROJECT_CHANGED";
    }

    static get TARGETS_UPDATE() {
        return "TARGETS_UPDATE";
    }

    static get MONITORS_UPDATE() {
        return "MONITORS_UPDATE";
    }

    static get BLOCKSINFO_UPDATE() {
        return "BLOCKSINFO_UPDATE";
    }

    static get RUNTIME_STARTED() {
        return "RUNTIME_STARTED";
    }

    static get RUNTIME_DISPOSED() {
        return "RUNTIME_DISPOSED";
    }

    static get MAX_CLONES() {
        return 50;
    }

    static get RENDER_INTERVAL() {
        return 1000 / 60;
    }

    static get HATS() {
        return {
            control_start_as_clone: {
                label: "When I Start As Clone",
                restartExistingThreads: false,
            },
            event_whenflagclicked: {
                label: "When Flag Clicked",
                restartExistingThreads: true,
            },
            event_whenkeypressed: {
                label: "When Key Pressed",
                restartExistingThreads: false,
            },
            event_whenthisspriteclicked: {
                label: "When This Sprite Clicked",
                restartExistingThreads: true,
            },
            event_whentouchingobject: {
                label: "When Touching",
                restartExistingThreads: false,
                edgeActivated: true,
            },
            event_whenstageclicked: {
                label: "When Stage Clicked",
                restartExistingThreads: true,
            },
            event_whenbackdropswitchesto: {
                label: "When Backdrop Switches To",
                restartExistingThreads: true,
            },
            event_whengreaterthan: {
                label: "When Greater Than",
                restartExistingThreads: false,
                edgeActivated: true,
            },
            event_whenbroadcastreceived: {
                label: "When Broadcast Received",
                restartExistingThreads: true,
            },
        } as Dictionary<{ restartExistingThreads: boolean, label: string }>;
    }
}
