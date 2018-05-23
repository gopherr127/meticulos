import { Component, Listen, Method, Prop, State } from '@stencil/core';
import { ENV } from '../../../environments/environment';
import { FieldMetadata } from '../../../interfaces/interfaces';

@Component({
  tag: 'function-set-field-value'
})
export class FunctionSetFieldValue {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Prop() functionArgs: any;
  @State() fields: Array<FieldMetadata> = [];
  public fieldId: string;
  public fieldValue: string;

  async componentWillLoad() {

    await this.loadFields();

    if (this.functionArgs) {
      let args = JSON.parse(this.functionArgs);
      this.fieldId = args.fieldId;
      this.fieldValue = args.fieldValue;
    }
  }

  async loadFields() {

    let response = await fetch(
      this.apiBaseUrl + "/fields", {
      method: "GET"
    });

    this.fields = await response.json();
  }

  @Method()
  getFunctionArgs() {

    return JSON.stringify({
      "fieldId": this.fieldId,
      "fieldValue": this.fieldValue
    });
  }

  @Listen('ionChange')
  handleFieldValueChange(event: any) {

    if (event.detail) {
      if (event.target.id === 'fieldSelect') {

        this.fieldId = event.detail.value;
      }
      else if (event.target.id === 'fieldValue') {

        this.fieldValue = event.detail.value;
      }
    }
  }

  render() {
    return (
      <ion-card>
        <ion-card-content>
          <ion-item>
            <ion-label>Field to Update</ion-label>
            <ion-select id="fieldSelect" value={ this.fieldId }>
              { this.fields.map(field => 
                <ion-select-option value={ field.id }>
                  { field.name }
                </ion-select-option>)
              }
            </ion-select>
          </ion-item>
          <ion-item>
            <ion-label>Value</ion-label>
            <ion-input id='fieldValue' debounce={300} 
                       value={this.fieldValue}></ion-input>
          </ion-item>
        </ion-card-content>
      </ion-card>
    )
  }
}