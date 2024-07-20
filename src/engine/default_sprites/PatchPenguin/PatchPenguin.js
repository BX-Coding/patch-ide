import {
  Sprite,
  Trigger,
  Watcher,
  Costume,
  Color
} from "leopard";

export default class PatchPenguin extends Sprite {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("costume1", "/costume1.png", {
        x: 200,
        y: 250
      }),
    ];

    this.triggers = [
      new Trigger(Trigger.CLICKED, this.whenthisspriteclicked),
      new Trigger(Trigger.GREEN_FLAG, this.whenGreenFlagClicked)
    ];

    // this.vars.myVariable = 1;
    // this.vars.myList = ["one", "two", "three", "four"];

    // this.watchers.myVariable = new Watcher({
    //   label: "My Variable",
    //   value: () => this.vars.myVariable,
    //   x: 5,
    //   y: 5
    // });
    // this.watchers.myVariableLarge = new Watcher({
    //   label: "My Variable",
    //   style: "large",
    //   value: () => this.vars.myVariable,
    //   x: 5,
    //   y: 30
    // });
    // this.watchers.myVariableSlider = new Watcher({
    //   label: "My Variable",
    //   style: "slider",
    //   value: () => this.vars.myVariable,
    //   setValue: value => {
    //     this.vars.myVariable = value;
    //   },
    //   x: 5,
    //   y: 60
    // });

    // this.watchers.myList = new Watcher({
    //   label: "My List",
    //   value: () => this.vars.myList,
    //   x: 150,
    //   y: 5
    // });
    // this.watchers.myListLarge = new Watcher({
    //   label: "My List",
    //   style: "large",
    //   value: () => this.vars.myList,
    //   x: 250,
    //   y: 100,
    //   width: 200,
    //   height: 80
    // });
    // this.watchers.myListSlider = new Watcher({
    //   label: "My List",
    //   style: "slider",
    //   value: () => this.vars.myList,
    //   setValue: value => {
    //     this.vars.myList = value;
    //   },
    //   x: 150,
    //   y: 200,
    //   width: 200
    // });

    this.visible = true;
  }

  // *whenthisspriteclicked() {
  //   this.costume = this.costumeNumber + 1;
  //   this.vars.myVariable++;
  //   this.vars.myList.push("another");
  // }

  *whenGreenFlagClicked() {
    this.costume = "costume1";
    this.visible = false
  }
}
