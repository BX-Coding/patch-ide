import EventEmitter from "events";
import { Project, Sprite, Stage } from "leopard";
import {
    DefaultSprites,
    DefaultStage,
} from "./default_sprites/default-project";

import { Dictionary } from "./interfaces";
import ScratchStorage from "scratch-storage";
import Thread from "./thread";

// This class manages the state of targets and other stuff

export default class Runtime extends EventEmitter {
    leopardProject?: Project;
    storage?: ScratchStorage;
    protected _sprites: Dictionary<{
        sprite: Sprite;
        threads: Dictionary<Thread>;
    }>;
    protected _stage: { stage: Stage; threads: Dictionary<Thread> };
    protected renderTarget?: string | HTMLElement;

    constructor() {
        super();

        this._sprites = DefaultSprites;
        this._stage = { stage: DefaultStage, threads: {} };

        this.leopardProject = new Project(
            this.getTargetForStage(),
            this.sprites
        );

        // In React, the constructor runs twice for some reason. Only add a thread the first time.
        !Object.keys(this._sprites["Patch"].threads).length &&
            this.addThread(
                "Patch",
                "",
                "event_whenflagclicked",
                "",
                "Thread 0"
            );

        this.emit("WORKER READY");
    }

    static get STAGE_WIDTH() { return 480; }

    static get STAGE_HEIGHT() { return 360; }

    static get PROJECT_START() { return "PROJECT_START"; }

    static get PROJECT_STOP_ALL() { return "PROJECT_STOP_ALL"; }

    static get STOP_FOR_TARGET() { return "STOP_FOR_TARGET"; }

    static get PROJECT_LOADED() { return "PROJECT_LOADED"; }

    static get PROJECT_CHANGED() { return "PROJECT_CHANGED"; }

    static get TARGETS_UPDATE() { return "TARGETS_UPDATE"; }

    static get MONITORS_UPDATE() { return "MONITORS_UPDATE"; }

    static get BLOCKSINFO_UPDATE() { return "BLOCKSINFO_UPDATE"; }

    static get RUNTIME_STARTED() { return "RUNTIME_STARTED" }

    static get RUNTIME_DISPOSED() { return "RUNTIME_DISPOSED"; }

    static get MAX_CLONES() { return 50; }

    static get RENDER_INTERVAL() { return 1000 / 60; }

    get targets(): Dictionary<Sprite | Stage> {
        return { Stage: this._stage.stage, ...this.sprites };
    }

    get sprites(): Dictionary<Sprite> {
        return Object.fromEntries(
            Object.keys(this._sprites).map((id) => [
                id,
                this._sprites[id].sprite,
            ])
        );
    }

    start() {}

    quit() {}

    async greenFlag() {
        //this.leopardProject = new Project(this.stage, this.sprites);
        this.leopardProject?.greenFlag();
    }

    stopAll() {}

    dispose() {}

    attachAudioEngine(engine: any) {}

    attachV2BitmapAdapter(adapter: any) {}

    attachRenderTarget(renderTarget: string | HTMLElement) {
        this.renderTarget = renderTarget;
        this.leopardProject?.attach(renderTarget);
    }

    attachStorage(storage: ScratchStorage) {
        this.storage = storage;
    }

    getTargetForStage() {
        return this._stage.stage;
    }

    getSpriteById(id: string) {
        //if (this.leopardProject.sprites[id])
    }

    renameSprite(id: string, newName: string) {}

    draw() {}

    getTargetById(id: string) {
        return this.targets[id];
    }

    getTargetThreads(id: string) {
        return id == "Stage" ? this._stage.threads : this._sprites[id]?.threads;
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

    emitProjectChanged() {
        this.emit(Runtime.PROJECT_CHANGED);
    }
}
