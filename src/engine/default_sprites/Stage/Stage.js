import {
  Stage as StageBase,
  Trigger,
  Watcher,
  Costume,
  Color
} from "leopard";

export default class Stage extends StageBase {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("backdrop1", "/backdrop1.svg", {
        x: 125.00153898879995,
        y: 156.4825870646767
      }),
      new Costume("scratchCat", "/scratchCat.png", {
        x: 402,
        y: 160
      }),
      new Costume("gobo", "/gobo.png", { x: 294, y: 86.5 }),
      new Costume("giga", "/giga.png", { x: 344, y: 145 }),
      new Costume("blank", "/blank.svg")
    ];

    this.triggers = [new Trigger(Trigger.CLICKED, this.whenstageclicked)];
  }

  *whenstageclicked() {
    this.costume = "random backdrop";
  }
}
