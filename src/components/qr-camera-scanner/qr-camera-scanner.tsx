import { Component, Prop, Event, EventEmitter, Method } from '@stencil/core';
import ZXing from '@zxing/library';

@Component({
  tag: 'qr-camera-scanner'
})
export class QrCameraScanner {

  @Prop() instructionText: string;
  private codeReader: ZXing.BrowserQRCodeReader;
  @Event() qrCodeScanned: EventEmitter;

  @Method()
  resetReader() {

    this.codeReader.reset();
  }

  componentDidLoad() {

    this.codeReader = new ZXing.BrowserQRCodeReader();
    
    this.codeReader.decodeFromInputVideoDevice(undefined, 'video')
      .then((result : any) => {
        
        this.resetReader();
        this.qrCodeScanned.emit(result.text);
      })
      .catch((error) => {
        console.log("Error occurred during QR scanning:");
        console.log(error);
      })
  }

  render () {
    return (
      <ion-card>
        <ion-card-content>
          <p>{ this.instructionText }</p>
          <video id="video" autoplay></video>
        </ion-card-content>
      </ion-card>
    );
  }
}