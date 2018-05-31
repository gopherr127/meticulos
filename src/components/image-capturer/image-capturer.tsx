import { Component, Element, Prop, State } from '@stencil/core';
import { ENV } from '../../environments/environment';

@Component({
  tag: 'image-capturer'
})
export class ImageCapturer {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  @Prop() imageFileName: string;
  @State() imageName: string;
  @State() videoEl: HTMLVideoElement;
  @State() snapshotEl: any;

  componentWillLoad() {
    
    this.imageName = this.imageFileName && this.imageFileName.indexOf('.png') > 0
      ? this.imageFileName
      : `image_${new Date().valueOf()}.png`;
  }

  componentDidLoad() {

    this.videoEl = document.querySelector('video');
    let vid = this.videoEl;
    this.snapshotEl = document.getElementById('snapshot');
    var constraints = { audio: false, video: true }; 

    navigator.mediaDevices.getUserMedia(constraints)
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

  async takeSnapshot(event: any) {

    event.preventDefault();

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
        var dataUrl = hidden_canvas.toDataURL('image/png');
        dataUrl = dataUrl.replace('data:image/png;base64,', '');
        this.videoEl.pause();

        let response = await fetch(
          `${this.apiBaseUrl}/itemimages`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            fileName: this.imageName,
            imageData: dataUrl
          })
        });

        if (response.ok) {

          this.dismiss(dataUrl);
        }
        else {
          console.log(await response.text());
        }
    }
  }
  
  dismiss(data?: any) {

    (this.el.closest('ion-modal') as any).dismiss(data);
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
          <ion-fab-button onClick={ (ev) => this.takeSnapshot(ev) }>
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