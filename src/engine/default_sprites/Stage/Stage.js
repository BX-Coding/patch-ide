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
        y: 156.4825870646767,
      }),
    ];

    // this.triggers = [new Trigger(Trigger.CLICKED, this.whenstageclicked)];
  }

  // *whenstageclicked() {
  //   this.costume = "random backdrop";
  // }
}
