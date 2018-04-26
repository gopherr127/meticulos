import { Component, Prop, State, Listen, Method } from '@stencil/core';
import { ENV } from '../../../environments/environment';
import { FieldMetadata } from '../../../interfaces/interfaces';

@Component({
  tag: 'function-field-required'
})
export class FunctionFieldRequired {

  @Prop() functionArgs: any;
  @State() fields: Array<FieldMetadata> = [];
  public apiBaseUrl: string = new ENV().apiBaseUrl();

  public selectedFields: Array<string> = [];

  async componentWillLoad() {

    await this.loadFields();

    if (this.functionArgs) {
      let args = JSON.parse(this.functionArgs);
      this.selectedFields = args.requiredFieldIds;
    }
  }

  async loadFields() {

    let response = await fetch(
      this.apiBaseUrl + "/fields", {
      method: "GET"
    });

    this.fields = await response.json();
  }

  @Listen('ionChange')
  handleSelection(event: any) {

    this.selectedFields = event.detail.value;
  }

  @Method()
  getFunctionArgs() {

    return JSON.stringify({
      requiredFieldIds: this.selectedFields
    });
  }

  render() {
    return (
      <ion-card>
      <ion-card-content>
        <ion-item>
          <ion-label position='fixed'>Required Fields</ion-label>
          <ion-select id="fieldSelect" multiple value={ this.selectedFields }>
            { this.fields.map(field => 
              <ion-select-option value={ field.id }>
                { field.name }
              </ion-select-option>)
            }
          </ion-select>
        </ion-item>
      </ion-card-content>
      </ion-card>
    )
  }
}