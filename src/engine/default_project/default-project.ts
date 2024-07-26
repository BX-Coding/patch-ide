import { Stage as StageBase, Costume, Sprite, Trigger} from "leopard";
import patchAssetStorage from "../storage/storage";

export const defaultStage = new StageBase({ costumeNumber: 1, id: "Stage" });

/*defaultStage.addCostume(
  new Costume("backdrop1", "/project_assets/backdrop1.svg", {
    x: 125.00153898879995,
    y: 156.4825870646767,
  }, "backdrop1")
);*/

const patchPenguin = new Sprite({
  x: 0,
  y: 30,
  direction: 90,
  costumeNumber: 1,
  size: 75,
  visible: true,
  id: "Patch"
});

/*patchPenguin.addCostume(
  new Costume("costume1", "/project_assets/costume1.png", {
    x: 200,
    y: 250,
  }, "costume1")
);*/

function *whenGreenFlagClicked() {
  patchPenguin.costume = "costume1";
  patchPenguin.visible = false;
}

patchPenguin.triggers = [new Trigger(Trigger.GREEN_FLAG, whenGreenFlagClicked as GeneratorFunction)];

export const defaultSprites = {
  Patch: {
    sprite: patchPenguin,
    threads: {},
  },
};
