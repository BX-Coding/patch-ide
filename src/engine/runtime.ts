import EventEmitter from "events";
import { Project, Sprite, Stage } from "leopard";
import { DefaultSprites, DefaultStage } from "./default_sprites/default-project";

import { Dictionary } from "./interfaces";
import ScratchStorage from "scratch-storage";

// This class manages the state of targets and other stuff

export default class Runtime extends EventEmitter {
   leopardProject: Project;
   storage?: ScratchStorage;

   constructor() {
      super();

      this.leopardProject = new Project(DefaultStage, DefaultSprites);

      this.emit("WORKER READY");
   }

   get targets(): Dictionary<Sprite | Stage> {
      return {"stage": this.leopardProject.stage, ...this.leopardProject.sprites};
   }

   start() {
      
   }

   quit() {

   }

   async greenFlag() {

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
      return 
   }

   getSpriteById(id: string) {
      //if (this.leopardProject.sprites[id]) 
   }

   renameSprite(id: string, newName: string) {

   }

   draw() {
      
   }

   getTargetId(target: Sprite | Stage) {
      const targets = this.targets;

      const targetIds = Object.keys(targets);

      targetIds.forEach(targetId => {
         if (targets[targetId] == target) {
            return targetId;
         }
      });

      return "";
   }

   getTargetById(id: string) {
      return this.targets[id];
   }
}