import EventEmitter from "events";
import { Color, Costume, Project, Sound, Sprite, Stage, Trigger } from "leopard";
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
import _ from "lodash";
import { createVMAsset } from "../lib/file-uploader";
import patchAssetStorage from "./storage/storage";

// This class manages the state of targets and other stuff

export type RuntimeState = {
    sprites: SerializedSprite[],
    stage: SerializedStage,
    globalVariables: Dictionary<GlobalVariable>
}

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

        this._sprites = {};
        this._stage = {stage: defaultStage, threads: {}};

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
                        this.targets[targetId].triggers.push(new Trigger(Trigger.KEY_PRESSED, { key: triggerEventOption.toLowerCase() }, (() => { threads[threadId].startThread() }) as GeneratorFunction))
                        break;
                    case "event_whenthisspriteclicked":
                        this.targets[targetId].triggers.push(new Trigger(Trigger.CLICKED, (() => { threads[threadId].startThread() }) as GeneratorFunction))
                        break;
                    case "control_start_as_clone":
                        this.targets[targetId].triggers.push(new Trigger(Trigger.CLONE_START, (() => { threads[threadId].startThread() }) as GeneratorFunction))
                        break;
                    case "event_whentouchingobject":
                        console.log("when_touching trigger not supported.");
                        break;
                    case "event_whenstageclicked":
                        this.getTargetForStage().triggers.push(new Trigger(Trigger.CLICKED, (() => { threads[threadId].startThread() }) as GeneratorFunction))
                        break;
                    case "event_whenbackdropswitchesto":
                        this.targets[targetId].triggers.push(new Trigger(Trigger.BACKDROP_CHANGED, { backdrop: triggerEventOption }, (() => { threads[threadId].startThread() }) as GeneratorFunction))
                        break;
                    case "event_whengreaterthan":
                        this.targets[targetId].triggers.push(new Trigger(Trigger.LOUDNESS_GREATER_THAN, (() => { threads[threadId].startThread() }) as GeneratorFunction))
                        break;
                    case "event_whenbroadcastreceived":
                        this.targets[targetId].triggers.push(new Trigger(Trigger.BROADCAST, (() => { threads[threadId].startThread() }) as GeneratorFunction))
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
        displayName = "",
        id?: string
    ) {
        const newThread = new Thread(
            this,
            this.getTargetById(targetId),
            script,
            triggerEventId,
            option,
            displayName
        );

        if (id) {
            if (this.getThreadById(id)) {
                console.error(`Trying to add a thread with id ${id}, but that id is already taken. Using ${newThread.id} instead.`);
            } else {
                newThread.id = id;
            }
        }

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
        const placeholderFunc = (target: Sprite | Stage, ...args: []) => { console.log("Calling function that couldn't be found: " + opcode + (target as Sprite).x) };
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

    static serializeSpriteBase(target: Sprite | Stage, threads: Dictionary<Thread>): SerializedSpriteBase {
        return {
            costumeNumber: target.costumeNumber,
            //layerOrder: sprite._layerOrder,
            costumes: target.getCostumes().map(costume => {
                return {
                    name: costume.name,
                    center: costume.center,
                    id: costume.id
                }
            }),
            sounds: target.getSounds().map(sound => {
                return {
                    name: sound.name,
                    id: sound.id
                }
            }),
            effects: {
                color: target.effects.color,
                fisheye: target.effects.fisheye,
                whirl: target.effects.whirl,
                pixelate: target.effects.pixelate,
                mosaic: target.effects.mosaic,
                brightness: target.effects.brightness,
                ghost: target.effects.ghost
            },
            audioEffects: {
                pan: target.audioEffects.pan,
                pitch: target.audioEffects.pitch,
                volume: target.audioEffects.volume
            },
            id: target.id,
            threads: Object.keys(threads).map(threadId => {
                return {
                    script: threads[threadId].script,
                    trigger: threads[threadId].triggerEvent,
                    triggerOption: threads[threadId].triggerEventOption,
                    id: threads[threadId].id,
                    displayName: threads[threadId].displayName
                }
            })
        }
    }

    static serializeSprite(sprite: Sprite, threads: Dictionary<Thread>): SerializedSprite {
        return {
            x: sprite.x,
            y: sprite.y,
            direction: sprite.direction,
            rotationStyle: sprite.rotationStyle.description ?? "ALL_AROUND",
            size: sprite.size,
            visible: sprite.visible,
            penDown: sprite.penDown,
            penSize: sprite.penSize,
            penColor: {
                h: sprite.penColor.h,
                s: sprite.penColor.s,
                v: sprite.penColor.v,
                a: sprite.penColor.a
            },
            ...this.serializeSpriteBase(sprite, threads)
        }
    }

    static serializeStage(stage: Stage, threads: Dictionary<Thread>): SerializedStage {
        return this.serializeSpriteBase(stage, threads);
    }

    static deserializeSprite(serialized: SerializedSprite): [Sprite, typeof serialized.threads] {
        const sprite = new Sprite({
            x: serialized.x,
            y: serialized.y,
            direction: serialized.direction,
            rotationStyle: Symbol.for(serialized.rotationStyle),
            size: serialized.size,
            visible: serialized.visible,
            costumeNumber: serialized.costumeNumber,
            id: serialized.id
        });

        sprite.penDown = serialized.penDown;
        sprite.penSize = serialized.penSize;
        sprite.penColor = new Color(
            serialized.penColor.h,
            serialized.penColor.s,
            serialized.penColor.v,
            serialized.penColor.a
        );

        // Assets aren't added into patchAssetStorage here; they must be added into patchAssetStorage before
        // running this function.

        // Load costumes
        serialized.costumes.forEach(costume => {
            sprite.addCostume(new Costume(costume.name, patchAssetStorage.loadAsset(costume.id), costume.center, costume.id));
        })

        // Load sounds
        serialized.sounds.forEach(sound => {
            sprite.addSound(new Sound(sound.name, patchAssetStorage.loadAsset(sound.id), sound.id));
        })

        // Deserialize effects
        sprite.effects.color = serialized.effects.color;
        sprite.effects.fisheye = serialized.effects.fisheye;
        sprite.effects.whirl = serialized.effects.whirl;
        sprite.effects.pixelate = serialized.effects.pixelate;
        sprite.effects.mosaic = serialized.effects.mosaic;
        sprite.effects.brightness = serialized.effects.brightness;
        sprite.effects.ghost = serialized.effects.ghost;

        // Deserialize audio effects
        sprite.audioEffects.pan = serialized.audioEffects.pan;
        sprite.audioEffects.pitch = serialized.audioEffects.pitch;
        sprite.audioEffects.volume = serialized.audioEffects.volume;

        return [sprite, serialized.threads];
    }

    static deserializeStage(serialized: SerializedStage): [Stage, typeof serialized.threads] {
        const stage = new Stage({
            costumeNumber: serialized.costumeNumber,
            id: serialized.id,
            width: 600,
            height: 400
        });

        // Assets aren't added into patchAssetStorage here; they must be added into patchAssetStorage before
        // running this function.

        // Load costumes
        serialized.costumes.forEach(costume => {
            stage.addCostume(new Costume(costume.name, patchAssetStorage.loadAsset(costume.id), costume.center, costume.id));
        })

        // Load sounds
        serialized.sounds.forEach(sound => {
            stage.addSound(new Sound(sound.name, patchAssetStorage.loadAsset(sound.id), sound.id));
        })

        // Deserialize effects
        stage.effects.color = serialized.effects.color;
        stage.effects.fisheye = serialized.effects.fisheye;
        stage.effects.whirl = serialized.effects.whirl;
        stage.effects.pixelate = serialized.effects.pixelate;
        stage.effects.mosaic = serialized.effects.mosaic;
        stage.effects.brightness = serialized.effects.brightness;
        stage.effects.ghost = serialized.effects.ghost;

        // Deserialize audio effects
        stage.audioEffects.pan = serialized.audioEffects.pan;
        stage.audioEffects.pitch = serialized.audioEffects.pitch;
        stage.audioEffects.volume = serialized.audioEffects.volume;

        return [stage, serialized.threads];
    }

    serialize(): RuntimeState {
        // The properties to keep from SpriteBase (sprites and stage):
        // TODO: add in watchers, _vars
        // _costumeNumber, _layerOrder, costumes, sounds, effects, audioEffects, id
        //
        // The properties to keep from Stage:
        // (none)
        //
        // The properties to keep from Sprite:
        // _x, _y, _direction, rotationStyle, size, visible, _penDown, penSize, _penColor

        const serializedSprites = Object.keys(this._sprites).filter(value => this._sprites[value].sprite.isOriginal).map(spriteId => {
            return Runtime.serializeSprite(this._sprites[spriteId].sprite, this._sprites[spriteId].threads);
        });

        const serializedStage = Runtime.serializeStage(this._stage.stage, this._stage.threads);

        const serializedRuntime = {
            sprites: serializedSprites,
            stage: serializedStage,
            globalVariables: this._globalVariables
        };

        return serializedRuntime;
    }

    deserialize(serialized: RuntimeState) {
        const newSprites = serialized.sprites.map(sprite => Runtime.deserializeSprite(sprite));
        const newStage = Runtime.deserializeStage(serialized.stage);

        this.stopAll();
        delete this.leopardProject;
        this.leopardProject = undefined;

        if (this.renderTarget instanceof HTMLElement) {
            while (this.renderTarget.firstChild) {
                // Using firstChild in the while statement and lastChild in the removeChild() function is intentional for performance reasons.
                this.renderTarget.removeChild(this.renderTarget.lastChild!);
            }
        } else if (this.renderTarget) {
            // When passing in renderTarget, a '#' is added to the beginning so Leopard recognizes it.
            // We need to remove that to use document.getElementById().
            const renderTarget = document.getElementById(this.renderTarget.substring(1));

            if (renderTarget != null) {
                while (renderTarget.firstChild) {
                    // Using firstChild in the while statement and lastChild in the removeChild() function is intentional for performance reasons.
                    renderTarget.removeChild(renderTarget.lastChild!);
                }
            }
        }

        this._sprites = {};
        this._stage = { stage: newStage[0], threads: {} };
        newStage[1].forEach(newThread => this.addThread("Stage", newThread.script, newThread.trigger, newThread.triggerOption, newThread.displayName, newThread.id));

        newSprites.forEach(newSpriteObj => {
            const newSprite = newSpriteObj[0];
            this._sprites[newSprite.id] = { sprite: newSprite, threads: {} };

            newSpriteObj[1].forEach(newThread => this.addThread(newSprite.id, newThread.script, newThread.trigger, newThread.triggerOption, newThread.displayName, newThread.id));
        })

        this._globalVariables = serialized.globalVariables;

        this.leopardProject = new Project(
            this.getTargetForStage(),
            this.sprites
        );

        this.renderTarget && this.leopardProject.attach(this.renderTarget);
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

export interface SerializedSpriteBase {
    costumeNumber: number;
    //layerOrder: number;
    costumes: {
        name: string,
        center: { x: number, y: number },
        id: string
    }[];
    sounds: {
        name: string,
        id: string
    }[];
    effects: {
        color: number,
        fisheye: number,
        whirl: number,
        pixelate: number,
        mosaic: number,
        brightness: number,
        ghost: number
    };
    audioEffects: {
        pan: number,
        pitch: number,
        volume: number
    };
    id: string;
    threads: {
        script: string,
        trigger: string,
        triggerOption: string,
        id: string,
        displayName: string
    }[];
}

export interface SerializedSprite extends SerializedSpriteBase {
    x: number;
    y: number;
    direction: number;
    rotationStyle: string; // "ALL_AROUND" | "LEFT_RIGHT" | "DONT_ROTATE";
    size: number;
    visible: boolean;
    penDown: boolean;
    penSize: number;
    penColor: {
        h: number,
        s: number,
        v: number,
        a: number
    }
}

export interface SerializedStage extends SerializedSpriteBase {
    // this is empty for now; Stage doesn't have any additional properties we need to serialize.
}