import { Component, Prop, State, Listen } from '@stencil/core';

@Component({
  tag: 'imagecapture-field'
})
export class ImageCaptureField {

  @Prop({ connect: 'ion-modal-controller' }) modalCtrl: HTMLIonModalControllerElement;
  @State() dataUrl: any;

  async captureImage() {

    const modal = await this.modalCtrl.create({
      component: 'image-capturer'
    });
    
    await modal.present();
  }
  
  @Listen('body:ionModalDidDismiss')
  async modalDidDismiss(event: CustomEvent) {

    if (event && event.detail && event.detail.data) {

      this.dataUrl = event.detail.data;
    }
  }

  render() {
    return (
      <ion-card>
        <ion-card-header no-padding>
          <ion-item>
            <ion-label>Image</ion-label>
            <ion-button slot="end" onClick={() => this.captureImage() }>Capture</ion-button>
          </ion-item>
        </ion-card-header>
        <ion-card-content>
          <img id="snapshot" src={ this.dataUrl }/>
        </ion-card-content>
      </ion-card>
    );
  }
}