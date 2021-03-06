import { Component, Element, Listen, State } from '@stencil/core';
import { ENV } from '../../../environments/environment';
import { Item } from '../../../interfaces/interfaces';

@Component({
  tag: 'items-search'
})
export class ItemsSearch {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  @State() queryText = '';
  @State() items: Array<Item> = [];

  async componentWillLoad() {

    await this.loadItems();
  }

  async pushComponent(componentName: string, componentProps?: any) {

    const navCtrl = document.querySelector('ion-nav');
    navCtrl.push(componentName, componentProps);
  }
  
  async loadItems() {

    let response = await fetch(
      this.apiBaseUrl + `/items`, {
        method: "GET"
    });

    if (response.ok) {

      this.items = await response.json();
    }
  }

  async handleItemClick(item: Item) {

    this.pushComponent('item-detail', {
      itemId: item.id
    })
  }

  async filterItemsList() {

    if (!this.queryText || this.queryText === "") {

      await this.loadItems();
    }
    else {

      let response = await fetch(
        this.apiBaseUrl + `/items/search?name=${this.queryText}`, {
          method: "GET"
      });

      if (response.ok) {

        this.items = await response.json();
      }
    }
  }

  @Listen('ionChange')
  handleFieldChange(event: any) {

    if (event && event.detail) {

      this.queryText = event.detail.value;
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
          <ion-title>Items Search</ion-title>
          <ion-buttons slot="end">
            <ion-button id="optionsMenu">
              <ion-icon slot="icon-only" name="more"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>

        <ion-toolbar color="tertiary">
          <ion-searchbar debounce={500} value={this.queryText} placeholder="Search">
          </ion-searchbar>
          <ion-buttons slot="end">
            <ion-button id="goButton" fill="solid" color="primary" 
                        onClick={ () => this.filterItemsList() }>
              Search
            </ion-button>
          </ion-buttons>
        </ion-toolbar>

      </ion-header>,

      <ion-content>

        <ion-list id="itemsList">
          {this.items.map(item => 
            <ion-item onClick={ () => this.handleItemClick(item) }>
              <ion-avatar slot="start" style={{ 'background-color': item.workflowNode.color ? item.workflowNode.color : 'transparent' }}>
                <img src={item.type.iconUrl}/>
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
          )}
          <ion-item disabled></ion-item>
          <ion-item disabled></ion-item>
        </ion-list>

      </ion-content>
    ];
  }
}