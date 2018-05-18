import { Component, Element, Listen, Prop, State } from '@stencil/core';
import { PopoverController } from '@ionic/core';
import { ENV } from '../../../environments/environment';
import { Item, ItemType } from '../../../interfaces/interfaces';

@Component({
  tag: 'items-list'
})
export class ItemsList {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  itemsList: HTMLIonListElement;
  @Prop({ connect: 'ion-modal-controller' }) modalCtrl: HTMLIonModalControllerElement;
  @Prop({ connect: 'ion-popover-controller' }) popoverCtrl: PopoverController;
  @Prop() itemTypeId: string;
  @State() subtitle = 'Items';
  @State() queryText = '';
  @State() itemType: ItemType;
  @State() items: Array<Item> = [];

  async componentWillLoad() {

    await this.loadItemType();
    await this.loadItems();
  }

  componentDidLoad() {

    this.itemsList = this.el.querySelector('#itemsList');
  }

  async pushComponent(componentName: string, componentProps?: any) {

    const navCtrl = document.querySelector('ion-nav');
    navCtrl.push(componentName, componentProps);
  }
  
  async loadItemType() {

    let response = await fetch(
      this.apiBaseUrl + "/itemtypes/" + this.itemTypeId, { 
        method: "GET"
    });

    if (response.ok) {

      this.itemType = await response.json();
      this.subtitle = this.itemType.pluralName;
    }
    else {
      console.log(response);
      console.log(await response.text());
    }
  }

  @Listen('body:ionModalDidDismiss')
  async loadItems() {

    let response = await fetch(
      this.apiBaseUrl + `/items/search?typeId=${this.itemTypeId}`, {
        method: "GET"
    });

    if (response.ok) {

      this.items = await response.json();
    }
  }

  handleQrSearchClick() {

    this.pushComponent('item-qr-search');
  }

  async handleAddFabClick() {

    const modal = await this.modalCtrl.create({
      component: 'item-create',
      componentProps: {
        itemTypeId: this.itemTypeId
      }
    });
    
    await modal.present();
  }

  async handleItemClick(item: Item) {

    this.pushComponent('item-detail', {
      itemId: item.id,
      returnUrl: `/items/type/${this.itemTypeId}`
    })
  }

  async handleDeleteClick(item: Item) {

    let response = await fetch(
      this.apiBaseUrl + `/items/${item.id}`, {
        method: "DELETE"
    });

    if (response.ok) {

      await this.loadItems();
      this.itemsList.closeSlidingItems();
    }
  }

  async presentOptionsMenu(event?: any) {

    const popover = await this.popoverCtrl.create({
      component: 'items-list-options-menu', 
      componentProps : {
        itemTypeId : this.itemTypeId
      },
      ev: event
    });

    popover.present();
  }

  @Listen('ionFocus')
  async handleElementFocused(event: any) {

    if (event.target.id === "optionsMenu") {

      await this.presentOptionsMenu(event);
    }
  }

  render() {
    return [
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
            <ion-button id="createButton" fill="solid" color="primary" 
                        onClick={ () => this.handleAddFabClick() }>
              Create
            </ion-button>
            <ion-button id="optionsMenu">
              <ion-icon slot="icon-only" name="more"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>

        <ion-toolbar color="tertiary">
          <ion-searchbar value={this.queryText} placeholder="Search">
          </ion-searchbar>
          <ion-buttons slot="end">
            <ion-button onClick={ () => this.handleQrSearchClick() }>
              <ion-icon slot="icon-only" name="barcode"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>

      </ion-header>,

      <ion-content>

        <ion-list id="itemsList">
          {this.items.map(item => 
            <ion-item-sliding>
              <ion-item onClick={ () => this.handleItemClick(item) }>
                <ion-avatar slot="start" style={{ 'background-color': item.workflowNode.color ? item.workflowNode.color : 'transparent' }}>
                  <img src={this.itemType.iconUrl}/>
                </ion-avatar>
                { item.location 
                ? <ion-label>
                    <h2>{item.name}</h2>
                    <p>{item.workflowNode.name} - {item.location.name}</p>
                  </ion-label>
                : <ion-label>
                    <h2>{item.name}</h2>
                    <p>{item.workflowNode.name}</p>
                  </ion-label>
                }
              </ion-item>
              <ion-item-options>
                <ion-item-option color="danger" onClick={ () =>
                    this.handleDeleteClick(item)
                  }>
                  Delete
                </ion-item-option>
              </ion-item-options>
            </ion-item-sliding>
          )}
          <ion-item disabled></ion-item>
          <ion-item disabled></ion-item>
        </ion-list>

        <ion-fab id="fabSection" horizontal="end" vertical="bottom" slot="fixed">
          <ion-fab-button onClick={ () => this.handleAddFabClick() }>Create</ion-fab-button>
        </ion-fab>

      </ion-content>
    ];
  }
}