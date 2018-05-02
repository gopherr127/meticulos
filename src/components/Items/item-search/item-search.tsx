import { Component, Element, State } from '@stencil/core';
import { ENV } from '../../../environments/environment';
import { Item } from '../../../interfaces/interfaces';

@Component({
  tag: 'item-search'
})
export class ItemSearch {

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
  
  dismiss(data?: any) {
    
    (this.el.closest('ion-modal') as any).dismiss(data);
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

  handleQrSearchClick() {

    this.pushComponent('item-qr-search');
  }

  render() {
    return [
      <ion-header>

        <ion-toolbar color="secondary">
          <ion-title>Select Item</ion-title>
          <ion-buttons slot="end">
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
            <ion-item onClick={ () => this.dismiss(item) }>
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