import {Module} from 'react-vr-web';

export default class ControllerModule extends Module {
  constructor() {
    super('ControllerModule');
    this.disablePanner = this.disablePanner.bind(this);
    this.enablePanner = this.enablePanner.bind(this);
  }
  init(vr) {
    this.vr = vr;
  }
  disablePanner() {
    this.vr.player.controls.nonVRControls.disconnect();
  }
  enablePanner() {
    this.vr.player.controls.nonVRControls.connect();
  }
}