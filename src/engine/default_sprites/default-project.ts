import Thread from "../thread";
import PatchPenguin from "./PatchPenguin/PatchPenguin";
import Stage from "./Stage/Stage";

export const DefaultStage = new Stage({ costumeNumber: 1, id: "Stage" });

export const DefaultSprites = {
  Patch: {sprite: new PatchPenguin({
    x: 0,
    y: 30,
    direction: 90,
    costumeNumber: 1,
    size: 75,
    visible: true,
    layerOrder: 1,
    id: "Patch"
  }), threads: {}}
};