import { Component, Element, Event, EventEmitter, Listen, Prop, State } from '@stencil/core';
import { Item } from '../../../interfaces/interfaces';

@Component({
  tag: 'linkeditems-field'
})
export class LinkedItemsField {

  @Element() el: any;
  @Event() linkedItemClicked: EventEmitter;
  @Event() linkedItemAdded: EventEmitter;
  @Event() linkedItemRemoved: EventEmitter;
  @Prop() linkedItems: string;
  @Prop({ connect: 'ion-modal-controller' }) modalCtrl: HTMLIonModalControllerElement;
  @State() items: Array<Item> = [];
  @State() addedItems: Array<Item> = [];
  @State() removedItems: Array<Item> = [];
  linkedItemsList: HTMLIonListElement;

  componentWillLoad() {

    this.items = (this.linkedItems)
      ? JSON.parse(this.linkedItems)
      : [];
  }

  componentDidLoad() {

    this.linkedItemsList = this.el.querySelector('#linkedItemsList');
  }

  handleLinkedItemClick(linkedItem: Item) {

    this.linkedItemClicked.emit(linkedItem);
  }

  async handleLinkedItemsAddClick() {

    const modal = await this.modalCtrl.create({
      component: 'item-search'
    });

    await modal.present();
  }

  handleLinkedItemRemove(linkedItem: Item) {

    this.items = this.items.filter((item) => {
      return item.id != linkedItem.id;
    })
    this.removedItems = [...this.removedItems, linkedItem];
    this.linkedItemsList.closeSlidingItems();
    this.linkedItemRemoved.emit(linkedItem);
  }

  @Listen('body:ionModalDidDismiss')
  modalDidDismiss(event: any) {
    
    if (event.detail) {

      this.items = [...this.items, event.detail.data];
      this.addedItems = [...this.addedItems, event.detail.data];
      this.linkedItemAdded.emit(event.detail.data);
    }
  }

  render() {
    return (
      <ion-card>
        <ion-card-header no-padding>
          <ion-item>
            <ion-label>
              Linked Items
            </ion-label>
            <ion-button slot="end"  color="secondary"
                        onClick={ () => this.handleLinkedItemsAddClick() }>
              Add
            </ion-button>
          </ion-item>
        </ion-card-header>
        <ion-card-content>
          <ion-list id="linkedItemsList">
          {this.items.map(linkedItem => 
            <ion-item-sliding>
              <ion-item onClick={ () => this.handleLinkedItemClick(linkedItem) }>
                <ion-avatar slot="start">
                  <img src={linkedItem.type.iconUrl}/>
                </ion-avatar>
                { linkedItem.location 
                ? <ion-label>
                    <h2>{linkedItem.name}</h2>
                    <p>{linkedItem.workflowNode.name} - {linkedItem.location.name}</p>
                  </ion-label>
                : <ion-label>
                    <h2>{linkedItem.name}</h2>
                    <p>{linkedItem.workflowNode.name}</p>
                  </ion-label>
                }
              </ion-item>
              <ion-item-options>
                <ion-item-option color="danger" 
                                 onClick={ () => this.handleLinkedItemRemove(linkedItem) }>
                  Remove
                </ion-item-option>
              </ion-item-options>
            </ion-item-sliding>
          )}
          </ion-list>
        </ion-card-content>
      </ion-card>
    );
  }
}