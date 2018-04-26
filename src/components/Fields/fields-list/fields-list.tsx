import { Component, Listen, Prop, State } from '@stencil/core';
import { Field } from '../../../interfaces/interfaces';
import { ENV } from '../../../environments/environment';

@Component({
  tag: 'fields-list'
})
export class FieldsList {

  @Prop() subtitle = 'Fields';
  @Prop() returnUrl = '/';
  @State() queryText = '';
  @State() fields: Array<Field> = [];
  public apiBaseUrl: string = new ENV().apiBaseUrl();

  async componentWillLoad() {

    await this.loadFields();
  }
  
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

  handleAddFabClick() {

  }

  async handleFieldDelete(field: Field) {

    let response = await fetch(
      this.apiBaseUrl + "/fields/" + field.id, {
        method: "DELETE"
    });

    if (response.ok) {
      await this.loadFields();
    }

    let listElement = document.querySelector('ion-list') as HTMLIonListElement;
    listElement.closeSlidingItems();
  }
  
  @Listen('ionInput')
  searchbarChanged(event: any) {
    this.queryText = event.target.value;
    this.loadFields(); //TODO: Add search filter, e.g. this.loadFields(queryText);
  }

  render() {
    return[
      <ion-header>

        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
            <ion-back-button defaultHref={this.returnUrl}></ion-back-button>
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

        <ion-list>
          {this.fields.map(field => 
            <ion-item-sliding>
              <ion-item href={`/fields/${field.id}`}>
                <h2>{ field.name }</h2>
              </ion-item>
              <ion-item-options>
                <ion-item-option color="danger" onClick={ () =>
                    this.handleFieldDelete(field) }>
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