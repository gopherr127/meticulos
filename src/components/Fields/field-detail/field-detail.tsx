import { Component, Prop, State } from '@stencil/core';
import { ENV } from '../../../environments/environment';
import { Field } from '../../../interfaces/interfaces';

@Component({
  tag: 'field-detail'
})
export class FieldDetail {

  @Prop() fieldId: string;
  @Prop() returnUrl = '/fields';
  @State() subtitle: string = 'Field: ';
  @State() field: Field;
  public apiBaseUrl: string = new ENV().apiBaseUrl();
  
  async componentWillLoad() {

    console.log(this.fieldId);
    await this.loadField();
  }

  async loadField() {

    let response = await fetch(
      this.apiBaseUrl + "/fields/" + this.fieldId, {
        method: "GET"
    });

    if (response.status === 200)
    {
      this.field = await response.json();
      this.subtitle = 'Field: ' + this.field.name;

      // var fieldTypeId = this.field.type;
      // this.selectedFieldType = this.fieldTypeInfo.fieldTypes.find((item) => {
      //   return item.id === fieldTypeId;
      // });
      // this.fieldTypeName = ft.name;
      // this.showFieldOptions = ft.supportsValueOptions;

      // if (this.field.valueOptions) {
      //   this.valueOptions = this.field.valueOptions;
      // }
    }
  }

  
  render() {
    return[
      <ion-header>

        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
            <ion-back-button defaultHref={ this.returnUrl }></ion-back-button>
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

      </ion-header>,

      <ion-content>

        
      </ion-content>
    ];
  }
}