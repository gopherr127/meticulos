import { Component, Event, EventEmitter, Prop, State } from '@stencil/core';
import { ItemIdentifier } from '../../../interfaces/interfaces';

@Component({
  tag: 'item-identifiers'
})
export class ItemIdentifiers {
  
  @Event() itemIdentifierAdded: EventEmitter;
  @Prop({ connect: 'ion-modal-controller' }) modalCtrl: HTMLIonModalControllerElement;
  @Prop() itemId: string;
  @Prop() itemIdentifiers: string;
  @State() identifiers: Array<ItemIdentifier> = [];

  componentWillLoad() {
    
    this.identifiers = this.itemIdentifiers
      ? JSON.parse(this.itemIdentifiers)
      : [];
  }

  async presentIdentifierCapture() {

    const modal = await this.modalCtrl.create({
      component: 'item-identifier-capture'
    });
    
    await modal.present();
  }

  render() {
    return (
      <ion-card>
        <ion-card-header no-padding>
            <ion-item>
              <ion-label>
                Barcodes &amp; Tags
              </ion-label>
              <ion-button slot="end" color="secondary"
                          onClick={ () => this.presentIdentifierCapture() }>
                Associate
              </ion-button>
            </ion-item>
        </ion-card-header>
        <ion-card-content>
          <ion-list id="itemIdentifiersList">
            {this.identifiers.map(identifier =>
              <ion-item-sliding>
                <ion-item>
                  <ion-label>
                    { identifier.identifier }
                  </ion-label>
                </ion-item>
              </ion-item-sliding>
            )}
          </ion-list>
        </ion-card-content>
      </ion-card>
    );
  }
}