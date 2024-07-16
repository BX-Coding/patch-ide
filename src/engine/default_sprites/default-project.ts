import PatchPenguin from "./PatchPenguin/PatchPenguin";
import Stage from "./Stage/Stage";

export const DefaultStage = new Stage({ costumeNumber: 1 });

export const DefaultSprites = {
  PatchPenguin: new PatchPenguin({
    x: 0,
    y: 30,
    direction: 90,
    costumeNumber: 1,
    size: 75,
    visible: true,
    layerOrder: 1
  })
};