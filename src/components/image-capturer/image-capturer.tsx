import { Component, Element, Event, EventEmitter, Prop, State } from '@stencil/core';
import { ENV } from '../../environments/environment';
import { ItemImage } from '../../interfaces/interfaces';

@Component({
  tag: 'image-capturer'
})
export class ImageCapturer {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  @Event() itemImageCaptured: EventEmitter;
  @Prop() targetItemId: string;
  @Prop() imageFileName: string;
  @State() imageName: string;
  @State() videoEl: HTMLVideoElement;
  @State() snapshotEl: any;
  mediaConstraints: any = {
    audio: false,
    video: {
      facingMode: {
        ideal: "environment"
      }
    }
  };

  componentWillLoad() {
    
    this.imageName = this.imageFileName && this.imageFileName.indexOf('.png') > 0
      ? this.imageFileName
      : `image_${this.generateGuid()}.png`;
  }

  componentDidLoad() {

    this.videoEl = document.querySelector('video');
    let vid = this.videoEl;
    this.snapshotEl = document.getElementById('snapshot');
    
    navigator.mediaDevices.getUserMedia(this.mediaConstraints)
      .then(function(mediaStream) {
        
        vid.srcObject = mediaStream;
        vid.onloadedmetadata = function(e) {
          vid.play();
          if (!e) { console.log(e); }
        };
      })
      .catch(function(err) { 
        console.log(err.name + ": " + err.message); 
      });
  }

  generateGuid() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+S4()+S4()+S4()+S4()+S4()+S4());
  }

  async takeSnapshot() {

    var hidden_canvas = document.querySelector('canvas'),
        context = hidden_canvas.getContext('2d');

    var width = this.videoEl.videoWidth,
        height = this.videoEl.videoHeight;

    if (width && height) {

        // Setup a canvas with the same dimensions as the video.
        hidden_canvas.width = width;
        hidden_canvas.height = height;

        // Make a copy of the current frame in the video on the canvas.
        context.drawImage(this.videoEl, 0, 0, width, height);

        // Turn the canvas image into a dataURL that can be used as a src for our photo.
        var imageData = hidden_canvas.toDataURL('image/png');
        var fileMetadata = 'data:image/png;base64,';
        imageData = imageData.replace(fileMetadata, '');

        let newImage: ItemImage = {
          targetItemId: this.targetItemId,
          fileName: this.imageName,
          url: '',
          imageData: imageData,
          fileMetadata: fileMetadata
        };

        this.videoEl.pause();

        try {
          // Stop the video input stream
          var mediaStream = this.videoEl.srcObject as any;
          var track = mediaStream.getTracks()[0];
          if (track) {
            track.stop();
          }
        } catch {}

        this.dismiss(newImage);
    }
  }
  
  dismiss(data?: any) {

    if (data) {

      this.itemImageCaptured.emit(data);
    }
    (this.el.closest('ion-modal') as any).dismiss();
  }

  render() {
    return[
      <ion-header>
        <ion-toolbar color="secondary">
          <ion-title>Capture Image</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content>
        
        <ion-card>
          <ion-card-content>
            <video id="video" autoplay></video>
            <img id="snapshot"/>
            <canvas></canvas>
          </ion-card-content>
        </ion-card>

        <ion-fab horizontal="center" vertical="bottom" slot="fixed">
          <ion-fab-button onClick={ () => this.takeSnapshot() }>
            <ion-icon name="camera"></ion-icon>
          </ion-fab-button>
        </ion-fab>

      </ion-content>,

      <ion-footer>
        <ion-buttons slot="end">
          <ion-button color="primary" onClick={ () => this.dismiss()}>Cancel</ion-button>
        </ion-buttons>
      </ion-footer>
    ];
  }
}