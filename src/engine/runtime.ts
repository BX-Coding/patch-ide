import EventEmitter from "events";
import { Project, Sprite, Stage } from "leopard";
import { DefaultSprites, DefaultStage } from "./default_sprites/default-project";

import { Dictionary } from "./interfaces";
import ScratchStorage from "scratch-storage";
import { Thread } from "../components/EditorPane/types";

// This class manages the state of targets and other stuff

export default class Runtime extends EventEmitter {
   leopardProject?: Project;
   storage?: ScratchStorage;
   protected _sprites: Dictionary<{sprite: Sprite, threads: Dictionary<Thread>}>;
   stage: Stage;

   constructor() {
      super();

      //this.leopardProject = new Project(DefaultStage, DefaultSprites);

      this.emit("WORKER READY");

      this._sprites = DefaultSprites;
      this.stage = DefaultStage;
      console.log(this._sprites);
   }

   get targets(): Dictionary<Sprite | Stage> {
      return {"Stage": this.stage, ...this.sprites};
   }

   get sprites(): Dictionary<Sprite> {
      return Object.fromEntries(Object.keys(this._sprites).map(id => [id, this._sprites[id].sprite]));
   }

   start() {
      
   }

   quit() {

   }

   async greenFlag() {
      //this.leopardProject = new Project(this.stage, this.sprites);
      this.leopardProject?.greenFlag();
   }

   stopAll() {

   }

   dispose() {

   }

   attachAudioEngine(engine: any) {

   }

   attachV2BitmapAdapter(adapter: any) {

   }

   attachRenderer(renderer: any) {
      //this.leopardProject.attach(renderer);
   }

   attachStorage(storage: ScratchStorage) {
      this.storage = storage;
   }

   getTargetForStage() {
      return this.stage;
   }

   getSpriteById(id: string) {
      //if (this.leopardProject.sprites[id]) 
   }

   renameSprite(id: string, newName: string) {

   }

   draw() {
      
   }

   getTargetById(id: string) {
      return this.targets[id];
   }

   getTargetThreads(id: string) {
      return this._sprites[id].threads;
   }
}