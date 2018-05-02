import { Component, Element, State } from '@stencil/core';
import { ENV } from '../../../environments/environment';
import { Screen } from '../../../interfaces/interfaces';

@Component({
  tag: 'screen-search'
})
export class ScreenSearch {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  @State() queryText = '';
  public screens: Array<Screen> = [];
  public selectedScreen: Screen;
  
  async componentWillLoad() {

    await this.loadScreens();
  }

  dismiss(data?: any) {
    
    (this.el.closest('ion-modal') as any).dismiss(data);
  }

  async loadScreens() {

    let response = await fetch(
      this.apiBaseUrl + "/screens", {
        method: "GET"
    });

    this.screens = await response.json();
  }
  
  render() {
    return[
      <ion-header>

        <ion-toolbar color="secondary">
          <ion-title>Select Screen</ion-title>
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

        <ion-list>
          {this.screens.map(screen =>
            <ion-item onClick={ () => this.dismiss(screen) }>
              <ion-label>
                <h2>{ screen.name }</h2>
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