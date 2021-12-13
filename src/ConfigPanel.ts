import { Pane } from "tweakpane";
import type { SnowflakeInputProps } from "./Snowflake";


export class ConfigPanel {

  private pane: Pane;
  private paramsLegacy: any;
  private params: SnowflakeInputProps;

  constructor(params: SnowflakeInputProps) {
    this.pane = new Pane({
      title: "Snowflake",
    });
    this.params = params;
    this.buildConfigPanel();
    this.pane.hidden = true;
  }

  private buildConfigPanel() {
    this.pane.addInput(this.params, "name");
    let folder = this.pane.addFolder({
      title: "Global",
      expanded: false,
    });
    folder.addInput(this.params, "branches", { min: 1, max: 10, step: 1 });

    folder = this.pane.addFolder({
      title: "Core",
      expanded: true,
    });
    folder.addInput(this.params.core, "start", {
      min: 0x0,
      max: 0xf,
      step: 1,
    });
    folder.addInput(this.params.core, "angle", {
      min: 0x0,
      max: 0xf,
      step: 1,
    });
    folder.addInput(this.params.core, "length", {
      min: 0x0,
      max: 0xf,
      step: 1,
    });
    folder.addInput(this.params.core, "spikes", {
      min: 0x0,
      max: 0x15,
      step: 1,
    });

    folder = this.pane.addFolder({
      title: "Intermediate",
      expanded: true,
    });
    folder.addInput(this.params.intermediate, "spikes", {
      min: 0x0,
      max: 0xf,
      step: 1,
    });
    folder.addInput(this.params.intermediate, "startLength", {
      min: 0x0,
      max: 0xf,
      step: 1,
    });
    folder.addInput(this.params.intermediate, "stopLength", {
      min: 0x0,
      max: 0xf,
      step: 1,
    });

    folder = this.pane.addFolder({
      title: "Ending",
      expanded: true,
    });
    folder.addInput(this.params.ending, "angleRatio", {
      min: 0x0,
      max: 0xf,
      step: 1,
    });
    folder.addInput(this.params.ending, "length", {
      min: 0x0,
      max: 0xf,
      step: 1,
    });
  }

  public refresh() {
    this.pane.refresh();
  }

  public show() {
    this.pane.hidden = false;
  }

  // public hide() {
  //   this.pane.hidden = false;
  // }
}

