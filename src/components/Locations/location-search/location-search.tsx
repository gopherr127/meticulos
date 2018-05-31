import { Component, Element, Event, EventEmitter, State } from '@stencil/core';
import { ENV } from '../../../environments/environment';
import { ItemLocation } from '../../../interfaces/interfaces';

@Component({
  tag: 'location-search'
})
export class LocationSearch {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  @Event() locationSelected: EventEmitter;
  @State() queryText = '';
  public locations: Array<ItemLocation> = [];
  
  async componentWillLoad() {

    await this.loadLocations();
  }

  async handleLocationClick(location: ItemLocation) {
    
    this.dismiss(location);
  }

  dismiss(data?: any) {
    
    if (data) {
      this.locationSelected.emit(data);
    }
    (this.el.closest('ion-modal') as any).dismiss();
  }

  async loadLocations() {

    let response = await fetch(
      this.apiBaseUrl + "/itemlocations", {
        method: "GET"
    });

    this.locations = await response.json();
  }
  
  render() {
    return[
      <ion-header>

        <ion-toolbar color="secondary">
          <ion-title>Select Location</ion-title>
        </ion-toolbar>

        <ion-toolbar color="tertiary">
          <ion-searchbar value={this.queryText} placeholder="Search">
          </ion-searchbar>
        </ion-toolbar>

      </ion-header>,

      <ion-content>

        <ion-list>
          {this.locations.map(location =>
            <ion-item onClick={ () => this.handleLocationClick(location) }>
              <ion-label>
                <h2>{ location.name }</h2>
              </ion-label>
            </ion-item>
          )}
          <ion-item disabled></ion-item>
          <ion-item disabled></ion-item>
        </ion-list>

      </ion-content>
    ];
  }
}