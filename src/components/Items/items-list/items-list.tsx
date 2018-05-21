import { Component, Element, Listen, Prop, State } from '@stencil/core';
import { PopoverController } from '@ionic/core';
import { ENV } from '../../../environments/environment';
import { Item, ItemType } from '../../../interfaces/interfaces';

@Component({
  tag: 'items-list',
  styleUrl: 'items-list.css'
})
export class ItemsList {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  itemsList: HTMLIonListElement;
  @Prop({ connect: 'ion-modal-controller' }) modalCtrl: HTMLIonModalControllerElement;
  @Prop({ connect: 'ion-popover-controller' }) popoverCtrl: PopoverController;
  @Prop() itemTypeId: string;
  @Prop() parentId: string;
  @Prop() displayNavMode: boolean;
  @State() selectedParentId: string;
  @State() selectedViewMode: string;
  @State() isInNavViewMode: boolean;
  @State() subtitle = 'Items';
  @State() queryText = '';
  @State() itemType: ItemType;
  @State() items: Array<Item> = [];

  async componentWillLoad() {

    if (this.displayNavMode) {
      this.isInNavViewMode = this.displayNavMode;
    }

    this.selectedParentId = this.parentId ? this.parentId : '000000000000000000000000';
    
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

    let url = `${this.apiBaseUrl}/items/search?typeId=${this.itemTypeId}`;

    if (this.isInNavViewMode) {
      url += `&parentId=${this.selectedParentId}`;
    }

    if (this.queryText && this.queryText != '') {
      url += `&name=${this.queryText}`;
    }

    let response = await fetch(
      url, {
        method: "GET"
    });

    if (response.ok) {

      this.items = await response.json();
    }
  }

  handleQrSearchClick() {

    this.pushComponent('item-qr-search');
  }

  async handleCreateItemClick() {

    let compProps = this.isInNavViewMode
    ? {
      itemTypeId: this.itemTypeId,
      parentId: this.selectedParentId
    }
    : {
      itemTypeId: this.itemTypeId
    };

    const modal = await this.modalCtrl.create({
      component: 'item-create',
      componentProps: compProps
    });
    
    await modal.present();
  }

  async handleItemClick(item: Item) {

    if (this.isInNavViewMode) {

      this.pushComponent('items-list', {
        itemTypeId: this.itemTypeId,
        parentId: item.id,
        displayNavMode: this.isInNavViewMode
      });
    }
    else {

      this.pushComponent('item-detail', {
        itemId: item.id,
        returnUrl: `/items/type/${this.itemTypeId}`
      })
    }
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

  async toggleViewModel(displayNavMode: boolean) {

    this.isInNavViewMode = displayNavMode;
    await this.loadItems();
    
    // When switching to Flat List, going back to Nav
    // should start back at the top of the nav "tree"
    if (!this.isInNavViewMode) {
      this.selectedParentId = '000000000000000000000000';
    }
  }

  @Listen('ionFocus')
  async handleElementFocused(event: any) {

    if (event.target.id === "optionsMenu") {

      await this.presentOptionsMenu(event);
    }
  }

  @Listen('ionChange')
  async handleFieldValueChange(event: any) {
    if (event.detail) {
      if (event.target.id === "itemsListSearchbar") {
        await this.loadItems();
      }
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

        {this.itemType.allowNestedItems
        ? <ion-toolbar color="secondary">
            <ion-title slot="start">{ this.subtitle }</ion-title>
            <ion-buttons slot="end">
              <ion-button id="viewAsListButton" 
                          onClick={ () => this.toggleViewModel(false) }
                          fill={ !this.isInNavViewMode ? 'solid' : 'outline'} >
                Flat List
              </ion-button>
              <ion-button id="viewAsNavButton" 
                          onClick={ () => this.toggleViewModel(true) }
                          fill={ this.isInNavViewMode ? 'solid' : 'outline'}>
                Navigation
              </ion-button>
              <ion-button id="createButton" fill="solid" color="primary" 
                          onClick={ () => this.handleCreateItemClick() }>
                Create
              </ion-button>
              <ion-button id="optionsMenu">
                <ion-icon slot="icon-only" name="more"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        : <ion-toolbar color="secondary">
            <ion-title slot="start">{ this.subtitle }</ion-title>
            <ion-buttons slot="end">
              <ion-button id="createButton" fill="solid" color="primary" 
                          onClick={ () => this.handleCreateItemClick() }>
                Create
              </ion-button>
              <ion-button id="optionsMenu">
                <ion-icon slot="icon-only" name="more"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>}
        

        <ion-toolbar color="tertiary">
          <ion-searchbar id="itemsListSearchbar" value={this.queryText} 
                         placeholder="Search" debounce={500}>
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
          <ion-fab-button onClick={ () => this.handleCreateItemClick() }>Create</ion-fab-button>
        </ion-fab>

      </ion-content>
    ];
  }
}