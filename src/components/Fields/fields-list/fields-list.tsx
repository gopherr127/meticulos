import { Component, Element, Listen, Prop, State } from '@stencil/core';
import { Field } from '../../../interfaces/interfaces';
import { ENV } from '../../../environments/environment';

@Component({
  tag: 'fields-list'
})
export class FieldsList {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  fieldsList: HTMLIonListElement;
  @Prop({ connect: 'ion-modal-controller' }) modalCtrl: HTMLIonModalControllerElement;
  @Prop() subtitle = 'Fields';
  @State() queryText = '';
  @State() fields: Array<Field> = [];

  async componentWillLoad() {

    await this.loadFields();
  }

  componentDidLoad() {

    this.fieldsList = this.el.querySelector('#fieldsList');
  }

  @Listen('body:ionModalDidDismiss')
  async loadFields() {

    let response = await fetch(
      this.apiBaseUrl + "/fields", { 
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
    });

    if (response.ok) {
      this.fields = await response.json();
    }
    else {
      console.log(response);
    }
  } 

  async handleAddFabClick() {

    const modal = await this.modalCtrl.create({
      component: 'field-create'
    });
    
    await modal.present();
  }

  async handleDeleteClick(field: Field) {

    let response = await fetch(
      this.apiBaseUrl + "/fields/" + field.id, {
        method: "DELETE"
    });

    if (response.ok) {
      await this.loadFields();

      this.fieldsList.closeSlidingItems();
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
        </ion-toolbar>

      </ion-header>,

      <ion-content>

        <ion-list id="fieldsList">
          {this.fields.map(field => 
            <ion-item-sliding>
              <ion-item href={`/fields/${field.id}`}>
                <h2>{ field.name }</h2>
              </ion-item>
              <ion-item-options>
                <ion-item-option color="danger" onClick={ () =>
                    this.handleDeleteClick(field) }>
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