import { Pane } from "tweakpane";


class ConfigPanel {

  private pane: Pane;
  private params: any;

  constructor(params: any) {
    // const Pane = require('tweakpane').Pane;
    this.pane = new Pane({
      title: "Snowflake",
    });
    this.params = params;
    this.buildConfigPanel();
  }

  private buildConfigPanel() {
    this.pane.addInput(this.params, "prenom");
    let folder = this.pane.addFolder({
      title: "Global",
      expanded: false,
    });
    folder.addInput(this.params, "branches", { min: 1, max: 10, step: 1 });
    folder.addInput(this.params, "constructLines");

    folder = this.pane.addFolder({
      title: "Core",
      expanded: true,
    });
    folder.addInput(this.params, "inputStartCore", {
      min: 0x0,
      max: 0xf,
      step: 1,
    });
    folder.addInput(this.params, "inputLengthCore", {
      min: 0x0,
      max: 0xf,
      step: 1,
    });
    folder.addInput(this.params, "inputAngleCore", {
      min: 0x0,
      max: 0xf,
      step: 1,
    });
    folder.addInput(this.params, "inputInternalCoreSpikes", {
      min: 0x0,
      max: 0x15,
      step: 1,
    });

    folder = this.pane.addFolder({
      title: "Intermediate",
      expanded: true,
    });
    folder.addInput(this.params, "inputIntermediateSpikes", {
      min: 0x0,
      max: 0xf,
      step: 1,
    });
    folder.addInput(this.params, "inputStartLengthIntermediate", {
      min: 0x0,
      max: 0xf,
      step: 1,
    });
    folder.addInput(this.params, "inputStopLengthIntermediate", {
      min: 0x0,
      max: 0xf,
      step: 1,
    });

    folder = this.pane.addFolder({
      title: "Ending",
      expanded: true,
    });
    folder.addInput(this.params, "inputAngleRatioEnding", {
      min: 0x0,
      max: 0xf,
      step: 1,
    });
    folder.addInput(this.params, "inputSizeEnding", {
      min: 0x0,
      max: 0xf,
      step: 1,
    });
  }

  public refresh() {
    this.pane.refresh();
  }
}

module.exports = ConfigPanel;
