import EventEmitter from "events";

//import JSZip from "jszip";

//import { get } from "http";

//import lodash from "lodash";

//import "canvas-toBlob";

/*import sb3 from "./serialization/sb3.mjs";
import sb2 from "./serialization/sb2.mjs";

import { loadCostume } from "./import/load-costume.mjs";
import { loadSound } from "./import/load-sound.mjs";

import PrimProxy from "./worker/prim-proxy.js";
import ScratchConverter from "./conversion/scratch-conversion.mjs";*/

//const { isUndefined } = lodash;

const KEY_NAME: Dictionary<string> = {
    SPACE: 'space',
    LEFT: 'left arrow',
    UP: 'up arrow',
    RIGHT: 'right arrow',
    DOWN: 'down arrow',
    ENTER: 'enter',
    ANY: 'any'
};

const RESERVED_NAMES = ["_mouse_", "_stage_", "_edge_", "_myself_", "_random_"];

import Runtime from "./runtime";
import { Costume, Sound, Sprite, Stage } from "leopard";

import { Dictionary } from "./interfaces";
import { SpriteJson } from "../components/EditorPane/old-types";
import Thread from "./thread";
import PrimProxy from "./worker/prim-proxy";
import patchAssetStorage from "./storage/storage";
import JSZip from "jszip";
import { GlobalVariable } from "../store/variableEditorStore";

/**
 * Handles connections between blocks, stage, and extensions.
 * @constructor
 */
export default class VirtualMachine extends EventEmitter {
    runtime: Runtime;
    editingTarget: Sprite | Stage | null;
    protected _ready: boolean = false;
    public get ready(): boolean { return this._ready };

    constructor() {
        super();

        /**
         * VM runtime, to store blocks, I/O devices, sprites/targets, etc.
         * @type {!Runtime}
         */
        //this.runtime = new Runtime(this.startHats.bind(this));
        this.runtime = new Runtime();
        this.runtime.on("WORKER READY", () => {
            this.emit("VM READY");
        });
        this.runtime.on("RUNTIME ERROR", (threadId, message, lineNumber, type) => {
            this.emit("RUNTIME ERROR", threadId, message, lineNumber, type);
        });
        this.runtime.on("COMPILE TIME ERROR", (threadId, message, lineNumber, type) => {
            this.emit("COMPILE TIME ERROR", threadId, message, lineNumber, type);
        });

        this.runtime.on(Runtime.TARGETS_UPDATE, () => this.emitTargetsUpdate(true));

        this.editingTarget = null;
    }

    /**
     * "Green flag" handler - start all threads starting with a green flag.
     */
    async greenFlag() {
        await this.runtime.greenFlag();
    }

    /**
     * Stop all threads and running activities.
     */
    stopAll() {
        this.runtime.stopAll();
    }

    /**
     * Clear out current running project data.
     */
    clear() {
        this.runtime.dispose();
    }

    attachRenderTarget(renderer: string | HTMLElement) {
        this.runtime.attachRenderTarget(renderer);
    }

    /**
     * Emit metadata about available targets.
     * An editor UI could use this to display a list of targets and show
     * the currently editing one.
     * @param {bool} triggerProjectChange If true, also emit a project changed event.
     * Disabled selectively by updates that don't affect project serialization.
     * Defaults to true.
     */
    emitTargetsUpdate(triggerProjectChange: any) {
        const targets = this.getAllRenderedTargets();
        if (typeof triggerProjectChange === "undefined") triggerProjectChange = true;
        this.emit("targetsUpdate", {
            // [[target id, human readable target name], ...].
            targetList: Object.keys(targets)
                .filter(
                    // Don't report clones.
                    (targetId) => targets[targetId] instanceof Sprite && (targets[targetId] as Sprite).isOriginal
                )
                /*.map((target) => target.toJSON())*/,
            // Currently editing target id.
            editingTarget: this.editingTarget ? this.editingTarget.id : null,
        });
        if (triggerProjectChange) {
            this.runtime.emitProjectChanged();
        }
    }

    /**
     * Emit an Blockly/scratch-blocks compatible XML representation
     * of the current editing target's blocks.
     */
    emitWorkspaceUpdate() {
        // Create a list of broadcast message Ids according to the stage variables
        const stageVariables = this.runtime.getTargetForStage().vars as Dictionary<any>;
        const messageIds = [];
        // eslint-disable-next-line no-restricted-syntax
        // TODO: re-implement this once broadcasts are figured out
        /*for (const varId in stageVariables) {
            if (stageVariables[varId].type === Variable.BROADCAST_MESSAGE_TYPE) {
                messageIds.push(varId);
            }
        }
        // Anything left in messageIds is not referenced by a block, so delete it.
        for (let i = 0; i < messageIds.length; i++) {
            const id = messageIds[i];
            delete (this.runtime.getTargetForStage().vars as Dictionary<any>)[id];
        }*/
        const globalVarMap = { ...this.runtime.getTargetForStage().vars } as Dictionary<any>;
        const localVarMap = (this.editingTarget instanceof Stage) ? Object.create(null) : { ...this.editingTarget?.vars };

        const globalVariables = Object.keys(globalVarMap).map((k) => globalVarMap[k]);
        const localVariables = Object.keys(localVarMap).map((k) => localVarMap[k]);

        const xmlString = `<xml xmlns="http://www.w3.org/1999/xhtml">
                            <variables>
                                ${globalVariables.map((v) => v.toXML()).join()}
                                ${localVariables.map((v) => v.toXML(true)).join()}
                            </variables>
                        </xml>`;

        this.emit("workspaceUpdate", { xml: xmlString });
    }

    /**
     * Install `deserialize` results: zero or more targets after the extensions (if any) used by those targets.
     * @param {Array.<Target>} targets - the targets to be installed
     * @param {ImportedExtensionsInfo} extensions - metadata about extensions used by these targets
     * @param {boolean} wholeProject - set to true if installing a whole project, as opposed to a single sprite.
     * @returns {Promise} resolved once targets have been installed
     */
    /*installTargets(targets: Array<Target>, extensions: ImportedExtensionsInfo, wholeProject: boolean): Promise<any> {
        const extensionPromises = [];

        extensions.extensionIDs.forEach((extensionID) => {
            if (!this.extensionManager.isExtensionLoaded(extensionID)) {
                const extensionURL = extensions.extensionURLs.get(extensionID) || extensionID;
                extensionPromises.push(this.extensionManager.loadExtensionURL(extensionURL));
            }
        });

        // eslint-disable-next-line no-param-reassign
        targets = targets.filter((target) => !!target);

        return Promise.all(extensionPromises).then(() => {
            targets.forEach((target) => {
                this.runtime.addTarget(target);
                /** @type RenderedTarget *//* target.updateAllDrawableProperties();
// Ensure unique sprite name
if (target.isSprite()) this.renameSprite(target.id, target.getName());
});
// Sort the executable targets by layerOrder.
// Remove layerOrder property after use.
this.runtime.executableTargets.sort((a, b) => a.layerOrder - b.layerOrder);
targets.forEach((target) => {
// eslint-disable-next-line no-param-reassign
delete target.layerOrder;
});

// Select the first target for editing, e.g., the first sprite.
if (wholeProject && targets.length > 1) {
// eslint-disable-next-line prefer-destructuring
this.editingTarget = targets[1];
} else {
// eslint-disable-next-line prefer-destructuring
this.editingTarget = targets[0];
}

if (!wholeProject) {
this.editingTarget.fixUpVariableReferences();
}

// Update the VM user's knowledge of targets and blocks on the workspace.
this.emitTargetsUpdate(false /* Don't emit project change *//*);
        // this.emitWorkspaceUpdate();
        this.runtime.setEditingTarget(this.editingTarget);
        // this.runtime.ioDevices.cloud.setStage(this.runtime.getTargetForStage());
    });
    }*/

    async installTargets(targets: (Sprite | Stage)[], wholeProject: boolean) {
        // TODO: implement this
    }

    addSprite(sprite: Sprite | SpriteJson, name: string) {
        // TODO: implement this
    }

    /**
     * Add a sprite, this could be .sprite2 or .sprite3. Unpack and validate
     * such a file first.
     * @param {string | object} input A json string, object, or ArrayBuffer representing the project to load.
     * @return {!Promise} Promise that resolves after targets are installed.
     */
    /*addSprite(input) {
        const errorPrefix = "Sprite Upload Error:";
        if (typeof input === "object" && !(input instanceof ArrayBuffer) && !ArrayBuffer.isView(input)) {
            // If the input is an object and not any ArrayBuffer
            // or an ArrayBuffer view (this includes all typed arrays and DataViews)
            // turn the object into a JSON string, because we suspect
            // this is a project.json as an object
            // validate expects a string or buffer as input
            // TODO not sure if we need to check that it also isn't a data view
            // eslint-disable-next-line no-param-reassign
            input = JSON.stringify(input);
        }

        // eslint-disable-next-line no-async-promise-executor
        const validationPromise = new Promise(async (resolve, reject) => {
            // The second argument of true below indicates to the parser/validator
            // that the given input should be treated as a single sprite and not
            // an entire project
            // eslint-disable-next-line consistent-return
            validate(input, true, (error, res) => {
                if (error) return reject(error);
                resolve(res);
            });
        });

        return validationPromise
            .then((validatedInput) => {
                const { projectVersion } = validatedInput[0];
                if (projectVersion === 2) {
                    return this._addSprite2(validatedInput[0], validatedInput[1]);
                }
                if (projectVersion === 3) {
                    return this._addSprite3(validatedInput[0], validatedInput[1]);
                }
                // eslint-disable-next-line prefer-promise-reject-errors
                return Promise.reject(`${errorPrefix} Unable to verify sprite version.`);
            })
            .then(() => this.runtime.emitProjectChanged())
            .catch((error) => {
                // Intentionally rejecting here (want errors to be handled by caller)
                if (error.hasOwnProperty("validationError")) {
                    return Promise.reject(JSON.stringify(error));
                }
                // eslint-disable-next-line prefer-promise-reject-errors
                return Promise.reject(`${errorPrefix} ${error}`);
            });
    }*/

    /**
     * Add a single sprite from the "Sprite2" (i.e., SB2 sprite) format.
     * @param {object} sprite Object representing 2.0 sprite to be added.
     * @param {?ArrayBuffer} zip Optional zip of assets being referenced by json
     * @returns {Promise} Promise that resolves after the sprite is added
     */
    /*_addSprite2(sprite, zip) {
        // Validate & parse

        return sb2.deserialize(sprite, this.runtime, true, zip).then(({ targets, extensions }) => this.installTargets(targets, extensions, false));
    }*/

    /**
     * Add a single sb3 sprite.
     * @param {object} sprite Object rperesenting 3.0 sprite to be added.
     * @param {?ArrayBuffer} zip Optional zip of assets being referenced by target json
     * @returns {Promise} Promise that resolves after the sprite is added
     */
    /*_addSprite3(sprite, zip) {
        // Validate & parse
        return sb3.deserialize(sprite, this.runtime, zip, true).then(({ targets, extensions }) => this.installTargets(targets, extensions, false));
    }*/

    /**
     * Rename a sprite.
     * @param {string} targetId ID of a target whose sprite to rename.
     * @param {string} newName New name of the sprite.
     */
    renameSprite(targetId: string, newName: string) {
        this.runtime.renameSprite(targetId, newName);
    }

    /**
     * Delete a sprite and all its clones.
     * @param {string} targetId ID of a target whose sprite to delete.
     * @return {Function} Returns a function to restore the sprite that was deleted
     */
    deleteSprite(targetId: string): Function {
        /*const target = this.runtime.getTargetById(targetId);
        if (target) {
            const targetIndexBeforeDelete = this.runtime.targets.map((t) => t.id).indexOf(target.id);
            if (!target.isSprite()) {
                throw new Error("Cannot delete non-sprite targets.");
            }
            const { sprite } = target;
            if (!sprite) {
                throw new Error("No sprite associated with this target.");
            }
            // Remove monitors from the runtime state and remove the
            // target-specific monitored blocks (e.g. local variables)
            const currentEditingTarget = this.editingTarget;
            this.runtime.disposeTarget(target);
            if (sprite === currentEditingTarget) {
                const nextTargetIndex = Math.min(this.runtime.targets.length - 1, targetIndexBeforeDelete);
                if (this.runtime.targets.length > 0) {
                    this.setEditingTarget(this.runtime.targets[nextTargetIndex].id);
                } else {
                    this.editingTarget = null;
                }
            }
            /* for (let i = 0; i < sprite.clones.length; i++) {
                const clone = sprite.clones[i];
                // Ensure editing target is switched if we are deleting it.
                this.runtime.disposeTarget(sprite.clones[i]);
                if (clone === currentEditingTarget) {
                    const nextTargetIndex = Math.min(this.runtime.targets.length - 1, targetIndexBeforeDelete);
                    if (this.runtime.targets.length > 0){
                        this.setEditingTarget(this.runtime.targets[nextTargetIndex].id);
                    } else {
                        this.editingTarget = null;
                    }
                } *//*
}
// Sprite object should be deleted by GC.
target.updateAllDrawableProperties();
this.emitTargetsUpdate();*/

        // TODO: implement this

        return () => { };
    }

    setEditingTarget(target: string | Sprite | Stage) {
        if (typeof target == "string")
            this.editingTarget = this.getTargetById(target);
        else
            this.editingTarget = target;

        this.emitTargetsUpdate(false /* Don't emit project change */);
        //this.emitWorkspaceUpdate();
    }

    async duplicateSprite(targetId: string) {
        const target = this.runtime.getTargetById(targetId);
        if (!target) {
            throw new Error("No target with the provided id.");
        } else if (!(target instanceof Sprite)) {
            throw new Error("Cannot duplicate non-sprite targets.");
        }
        const newTarget = target.createClone();

        this.runtime.addTarget(newTarget);
        // TODO: implement this next line (probably involves the _layerOrder variable);
        // This function is implemented in rendered-target in the old patch vm/scratch vm
        //newTarget.goBehindOther(target);
        this.setEditingTarget(newTarget.id);
    }

    async addCostume(md5ext: string, costumeObject: Costume, optTargetId?: string, optVersion?: string) {
        const target = optTargetId ? this.runtime.getTargetById(optTargetId) : this.editingTarget;
        if (target) {
            target.addCostume(costumeObject);
            target.costume = costumeObject;
            return;
        }
        // If the target cannot be found by id, return a rejected promise
        return Promise.reject();
    }

    async addSound(soundObject: Sound, optTargetId?: string) {
        const target = optTargetId ? this.runtime.getTargetById(optTargetId) : this.editingTarget;
        if (target) {
            target.addSound(soundObject);
        }
        // If the target cannot be found by id, return a rejected promise
        return Promise.reject();
    }

    getEventLabels(): Dictionary<string> {
        const hats = Runtime.HATS;
        const eventLabels: Dictionary<string> = {};
        Object.keys(hats).forEach((hatId) => {
            eventLabels[hatId] = hats[hatId].label;
        });
        return eventLabels;
    }

    getBackdropNames() {
        const target = this.getTargetForStage();
        const costumes = target.getCostumes();
        const names = [];
        for (let i = 0; i < costumes.length; i++) {
            names.push(costumes[i].name);
        }
        return names;
    }

    getSpriteNames() {
        const targets = this.getAllRenderedTargets();
        const targetNames = Object.keys(targets).map((targetId) => targets[targetId].id);
        return targetNames;
    }

    getKeyboardOptions() {
        const characterKeys = Array.from(Array(26), (e, i) => String.fromCharCode(65 + i));
        const scratchKeys = Object.keys(KEY_NAME).map((keyId) => KEY_NAME[keyId].toUpperCase());

        return characterKeys.concat(scratchKeys);
    }

    // There is 100% a better way to implement this
    getEventOptionsMap(eventId: string) {
        return ({
            event_whenflagclicked: null,
            event_whenkeypressed: this.getKeyboardOptions(),
            event_whenthisspriteclicked: null,
            event_whentouchingobject: this.getSpriteNames(),
            event_whenstageclicked: null,
            event_whenbackdropswitchesto: this.getBackdropNames(),
            event_whengreaterthan: null,
            event_whenbroadcastreceived: "Free Input",
        } as Dictionary<any | null>)[eventId];
    }

    serializeRuntime() {
        return this.runtime.serialize();
    }

    async zipProject() {
        const projectJson = this.serializeRuntime();
        const projectJsonString = JSON.stringify(projectJson);
        const zip = new JSZip();

        /** Example for adding in an asset:
         * zip.file("{scratch provided asset filename}", {the data});
         */

        // This may be needed once custom sprites are added.
        /*this.runtime.targets.forEach((target) => {
                    if (target instanceof RenderedTarget) {
                        target.getCostumes().forEach((costume) => {
                            console.log(costume);
                            if (!zip.files[costume.md5]) {
                                zip.file(costume.md5, new Blob([costume.asset.data]));
                            }
                        });
                    }
                });*/

        const assetIds = patchAssetStorage.assetIds;

        for (const assetId of assetIds) {
            const url = patchAssetStorage.loadAsset(assetId);
            const assetType = patchAssetStorage.getAssetType(assetId);

            let ext = ""

            if (assetType == "VectorImage") {
                ext = "svg";
            } else if (assetType == "BitmapImage") {
                
            }
        }

        zip.file("project.json", new Blob([projectJsonString], { type: "text/plain" }));
        const zippedProject = await zip.generateAsync({ type: "blob" }).then((content) => content);
        return zippedProject;

        // TODO: implement this
    }

    /**
     * Downloads a zip file containing all project data with the following
     * naming template "[project name].ptch2"
     *
     * @returns {Blob} A Blob object representing the zip file
     */
    async downloadProject() {//: Blob {
        const zippedProject = await this.zipProject();

        // https://stackoverflow.com/questions/19327749/javascript-blob-filename-without-link
        const a = document.createElement("a");
        document.body.appendChild(a);
        // TODO: is this needed?
        //a.style = "display: none";
        const url = window.URL.createObjectURL(zippedProject);
        a.href = url;
        a.download = "project.ptch2";
        a.click();
        window.URL.revokeObjectURL(url);
    }

    /**
     * Converts a .sb3 scratch project to a .ptch2 patch project
     *
     * @param {ArrayBuffer} scratchData - An ArrayBuffer object generated from
     * a valid Scratch (.sb3) project file
     * @returns {ArrayBuffer} An ArrayBuffer object representing a Patch (.ptch2) project file
     */
    async scratchToPatch(scratchData: ArrayBuffer) {//: ArrayBuffer {
        /*const converter = new ScratchConverter(scratchData);
        return converter.getPatchArrayBuffer().then((buf) => buf);*/

        // TODO: implement this

        return new ArrayBuffer(0);
    }

    /**
     * Restores the state of the VM from a ArrayBuffer object that has been generated from a
     * valid Patch Project .ptch2 file.
     *
     * @param {ArrayBuffer | JSON} projectData - A ArrayBuffer object generated from
     * a valid Patch Project .ptch2 file
     */
    async loadProject(projectData: any, isJson = false) {
        let zip;
        let jsonData = projectData;

        // Check if project data is a json object
        if (!isJson) {
            zip = await JSZip.loadAsync(projectData).then((newZip) => newZip);

            // https://stackoverflow.com/questions/40223259/jszip-get-content-of-file-in-zip-from-file-input
            const jsonDataString = await zip.files["project.json"].async("text").then((text) => text);
            if (!jsonDataString) {
                console.warn("No project.json file. Is your project corrupted?");
                return null;
            }
            jsonData = JSON.parse(jsonDataString);

            // Import costumes and sounds

            for (const file of Object.keys(JSZip.files)) {
                const filenameSplit = file.split('.');
                const ext = filenameSplit.pop();
                const id = filenameSplit.join();

                if (ext == "png" || ext == "jpg" || ext == "bmp") {
                    patchAssetStorage.addAsset(id, await JSZip.files[file].async("blob"), "BitmapImage");
                } else if (ext == "svg") {
                    patchAssetStorage.addAsset(id, await JSZip.files[file].async("blob"), "VectorImage");
                } else if (ext == "wav" || ext == "mp3" || ext == "aac" || ext == "ogg" || ext == "flac") {
                    patchAssetStorage.addAsset(id, await JSZip.files[file].async("blob"), "Sound");
                }
            }
        }

        

        this._ready = false;
        this.editingTarget = null;

        this.clear();
        this.runtime.deserialize(jsonData);

        const returnVal: { globalVariables: GlobalVariable[] } = { globalVariables: Object.keys(this.runtime._globalVariables).map(key => this.runtime._globalVariables[key]) };

        await this.runtime.workerLoadPromise;

        return returnVal;
    }

    async addThread(targetId: any, script: any, triggerEventId: any, option: any, displayName = ""): Promise<string> {
        const newThreadId = await this.runtime.addThread(targetId, script, triggerEventId, option, displayName);
        return newThreadId;
    }

    getThread(targetId: string, threadId: string): Thread {
        return this.runtime.getTargetThreads(targetId)[threadId];
    }

    deleteThread(threadId: any) {
        this.runtime.deleteThread(threadId);
    }

    getThreadById(threadId: any) {
        return this.runtime.getThreadById(threadId);
    }

    getThreadsForTarget(targetId: any) {
        return this.runtime.getTargetThreads(targetId);
    }

    getAllRenderedTargets() {
        return this.runtime.targets;
    }

    getTargetById(id: string) {
        return this.runtime.getTargetById(id);
    }

    getTargetIds() {
        return Object.keys(this.getAllRenderedTargets());
    }

    getTargetForStage() {
        return this.runtime.getTargetForStage();
    }

    updateThreadScript(threadId: any, script: any) {
        this.runtime.updateThreadScript(threadId, script);
    }

    updateThreadTriggerEvent(threadId: any, eventTrigger: any) {
        this.runtime.updateThreadTriggerEvent(threadId, eventTrigger);
    }

    updateThreadTriggerEventOption(threadId: any, eventTriggerOption: any) {
        this.runtime.updateThreadTriggerEventOption(threadId, eventTriggerOption);
    }

    updateGlobalVariable(name: any, value: any) {
        this.runtime.updateGlobalVariable(name, value);
    }

    removeGlobalVariable(name: any) {
        this.runtime.removeGlobalVariable(name);
    }

    getGlobalVariables() {
        return this.runtime.getGlobalVariables();
    }

    isLoaded() {
        return this.runtime.workerLoaded;
    }

    getApiInfo() {
        return PrimProxy.patchApi;
    }

    getDynamicFunctionInfo(functionName: any) {
        return PrimProxy.getDynamicFunctionInfo(functionName, this);
    }

    getRuntimeErrors() {
        return this.runtime.runtimeErrors;
    }

    getCompileTimeErrors() {
        return this.runtime.compileTimeErrors;
    }

    /**
     * Get all messagesIds that are currently being listened for by threads
     */
    getAllBroadcastMessages() {
        const messages: string[] = [];
        const targetIds = Object.keys(this.getAllRenderedTargets());
        targetIds.forEach((targetId) => {
            const threads = this.runtime.getTargetThreads(targetId);
            Object.keys(threads).forEach((threadId) => {
                const thread = threads[threadId];
                if (thread.triggerEvent === "event_whenbroadcastreceived") {
                    messages.push(thread.triggerEventOption);
                }
            });
        });
        return messages;
    }

    /*
 * @type {Array<object>} Array of all costumes and sounds currently in the runtime
 */
    /*get assets () {
        return this.runtime.targets.reduce((acc: string | any[], target: { sprite: { sounds: any[]; costumes: any[]; }; }) => (
            acc
                .concat(target.sprite.sounds.map((sound: { asset: any; }) => sound.asset))
                .concat(target.sprite.costumes.map((costume: { asset: any; }) => costume.asset))
        ), []);
    }*/
}
