import { Component, Listen } from '@stencil/core';

@Component({
  tag: 'item-qr-search'
})
export class ItemQrSearch {

  @Listen('qrCodeScanned')
  handleQrCodeScanned(scanInfo: any) {

    const navCtrl = document.querySelector('ion-nav');
    navCtrl.setRoot('item-detail', { 
      itemId: scanInfo.detail 
    });
  }

  handleCancelClick() {

    const scannerElem = document.querySelector('qr-camera-scanner');
    scannerElem.resetReader();
    const navCtrl = document.querySelector('ion-nav');
    navCtrl.pop();
  }

  render() {
    return[
      <ion-header>

        <ion-toolbar color="secondary">
          <ion-title>Item Search</ion-title>
        </ion-toolbar>

      </ion-header>,

      <ion-content>

        <qr-camera-scanner instructionText="Scan a QR Code to view a Plan Item."></qr-camera-scanner>

      </ion-content>,

      <ion-footer>
        <ion-buttons slot="end">
          <ion-button color="primary" onClick={ () => this.handleCancelClick()}>Cancel</ion-button>
        </ion-buttons>
      </ion-footer>
    ];
  }
}