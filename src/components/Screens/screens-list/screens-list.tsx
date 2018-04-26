import { Component, Element, Listen, Prop, State } from '@stencil/core';
import { ENV } from '../../../environments/environment';
import { Screen } from '../../../interfaces/interfaces';

@Component({
  tag: 'screens-list'
})
export class ScreensList {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  screensList: HTMLIonListElement;
  @Prop({ connect: 'ion-modal-controller' }) modalCtrl: HTMLIonModalControllerElement;
  @Prop() subtitle = 'Screens';
  @State() queryText = '';
  @State() screens: Array<Screen> = [];

  async componentWillLoad() {

    await this.loadScreens();
  }

  componentDidLoad() {

    this.screensList = this.el.querySelector('#screensList');
  }

  @Listen('body:ionModalDidDismiss')
  async loadScreens() {

    let response = await fetch(
      this.apiBaseUrl + "/screens", { 
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
    });

    if (response.ok) {
      this.screens = await response.json();
    }
    else {
      console.log(response);
    }
  } 

  async handleAddFabClick() {

    const modal = await this.modalCtrl.create({
      component: 'screen-create'
    });
    
    await modal.present();
  }

  async handleDeleteClick(screen: Screen) {

    let response = await fetch(
      this.apiBaseUrl + "/screens/" + screen.id, {
        method: "DELETE"
    });

    if (response.ok) {
      await this.loadScreens();

      this.screensList.closeSlidingItems();
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

        <ion-list id="screensList">
          {this.screens.map(screen => 
            <ion-item-sliding>
              <ion-item href={`/screens/${screen.id}`}>
                <h2>{ screen.name }</h2>
              </ion-item>
              <ion-item-options>
                <ion-item-option color="danger" onClick={ () =>
                    this.handleDeleteClick(screen) }>
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