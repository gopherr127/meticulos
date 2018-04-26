import { Component, Element, Listen, Prop, State } from '@stencil/core';
import { ENV } from '../../../environments/environment';
import { ItemType } from '../../../interfaces/interfaces';

@Component({
  tag: 'item-types-list'
})
export class ItemTypesList {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  itemTypesList: HTMLIonListElement;
  @Prop({ connect: 'ion-modal-controller' }) modalCtrl: HTMLIonModalControllerElement;
  @Prop() subtitle = 'Items';
  @State() queryText = '';
  @State() itemTypes: Array<ItemType> = [];

  async componentWillLoad() {

    await this.loadItemTypes();
  }
  
  @Listen('body:ionModalDidDismiss')
  async loadItemTypes() {

    let response = await fetch(
      this.apiBaseUrl + "/itemtypes", { 
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
    });

    this.itemTypes = await response.json();
  } 

  componentDidLoad() {

    this.itemTypesList = this.el.querySelector('#itemTypesList');
  }

  async handleAddFabClick() {

    const modal = await this.modalCtrl.create({
      component: 'item-type-create'
    });
    
    await modal.present();
  }

  async handleDeleteClick(itemType: ItemType) {

    let response = await fetch(
      this.apiBaseUrl + "/itemtypes/" + itemType.id, {
        method: "DELETE"
    });

    if (response.ok) {
      
      await this.loadItemTypes();
      this.itemTypesList.closeSlidingItems();
    }
  }

  render() {
    return[
      <ion-header>

        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-title>Meticulos</ion-title>
        </ion-toolbar>

        <ion-toolbar color="secondary">
          <ion-title>{ this.subtitle }</ion-title>
          <ion-buttons slot="end">
            <ion-button>
              <ion-icon slot="icon-only" name="more"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>

        <ion-toolbar color="tertiary">
          <ion-searchbar value={this.queryText} placeholder="Search">
          </ion-searchbar>
        </ion-toolbar>

      </ion-header>,

      <ion-content>

        <ion-list id="itemTypesList">
          {this.itemTypes.map(itemType => 
            <ion-item-sliding>
              <ion-item href={`/item-types/${itemType.id}`}>
                <ion-avatar slot="start">
                  <img src={itemType.iconUrl}/>
                </ion-avatar>
                <h2>{itemType.name}</h2><p></p>
              </ion-item>
              <ion-item-options>
                <ion-item-option color="danger" onClick={ () =>
                    this.handleDeleteClick(itemType)
                  }>
                  Delete
                </ion-item-option>
              </ion-item-options>
            </ion-item-sliding>
          )}
          <ion-item disabled></ion-item>
          <ion-item disabled></ion-item>
        </ion-list>

        <ion-fab horizontal="end" vertical="bottom" slot="fixed">
          <ion-fab-button onClick={ () => this.handleAddFabClick() }>Add</ion-fab-button>
        </ion-fab>

      </ion-content>
    ];
  }
}