import { Component, Element, Prop, State } from '@stencil/core';
import { ENV } from '../../../environments/environment';
import { Item, ItemType } from '../../../interfaces/interfaces';

@Component({
  tag: 'items-list'
})
export class ItemsList {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  itemsList: HTMLIonListElement;
  @Prop({ connect: 'ion-router' }) router;
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

  async loadItems() {

    let response = await fetch(
      this.apiBaseUrl + `/items/search?typeId=${this.itemTypeId}`, {
        method: "GET"
    });

    if (response.ok) {

      this.items = await response.json();
    }
  }

  async navigate(url: string) {

    const routerCtrl: HTMLIonRouterElement = await (this.router as any).componentOnReady();
    routerCtrl.push(url);
  }

  async handleAddFabClick() {

    this.navigate(`/items/create/${ this.itemTypeId }`);
  }

  async handleDeleteClick(item: Item) {

    let response = await fetch(
      this.apiBaseUrl + `/items/${item.id}`, {
        method: "DELETE"
    });

    if (response.ok) {

      this.itemsList.closeSlidingItems();
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
            <ion-button>
              <ion-icon slot="icon-only" name="more"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>

        <ion-toolbar color="tertiary">
          <ion-searchbar value={this.queryText} placeholder="Search">
          </ion-searchbar>
          <ion-buttons slot="end">
            <ion-button>
              <ion-icon slot="icon-only" name="barcode"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>

      </ion-header>,

      <ion-content>

        <ion-list id="itemsList">
          {this.items.map(item => 
            <ion-item-sliding>
              <ion-item href={`/item-types/${item.id}`}>
                <ion-avatar slot="start">
                  <img src={this.itemType.iconUrl}/>
                </ion-avatar>
                <h2>{item.name}</h2><p></p>
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

        <ion-fab horizontal="end" vertical="bottom" slot="fixed">
          <ion-fab-button onClick={ () => this.handleAddFabClick() }>Add</ion-fab-button>
        </ion-fab>

      </ion-content>
    ];
  }
}