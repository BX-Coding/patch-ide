import Thread from "../thread";
import PatchPenguin from "./PatchPenguin/PatchPenguin";
// import Stage from "./Stage/Stage";
import { Stage,Costume } from "leopard";

export const defaultStage = new Stage({ costumeNumber: 1, id: "Stage" });
defaultStage.setCostumes([
  new Costume("backdrop1", "/backdrop1.svg", {
    x: 125.00153898879995,
    y: 156.4825870646767,
  }),
])

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