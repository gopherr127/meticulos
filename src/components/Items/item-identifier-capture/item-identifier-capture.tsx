import { Component, Element, Listen, State } from '@stencil/core';
// import { ENV } from '../../../environments/environment';
// import { ItemIdentifier } from '../../../interfaces/interfaces';

@Component({
  tag: 'item-identifier-capture'
})
export class ItemIdentifierCapture {

  @Element() el: any;
  @State() segment = 'barcode';
  
  @Listen('ionChange')
  handleSegmentChanged(event: any) {
    this.segment = event.target.value;
  }

  dismiss(data?: any) {

    (this.el.closest('ion-modal') as any).dismiss(data);
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-segment value={ this.segment }>
            <ion-segment-button value="barcode">
              Barcode
            </ion-segment-button>
            <ion-segment-button value="rfid">
              RFID Tag
            </ion-segment-button>
          </ion-segment>
        </ion-toolbar>
      </ion-header>,

      <ion-content>
      </ion-content>
    ];
  }
}