import { Component, Element, Prop, State, Listen } from '@stencil/core';
import { ENV } from '../../../environments/environment';
import { FieldTypes, FieldTypeMetadata } from '../../../interfaces/interfaces';


@Component({
  tag: 'field-create'
})
export class FieldCreate {
  
  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  @Prop({connect: 'ion-router'}) nav;
  @State() name: string;
  @State() showFieldOptions: boolean;
  @State() valueOptions: Array<any> = [];
  @State() fieldTypes: Array<FieldTypeMetadata> = [
    { id: FieldTypes.Textbox.toString(), name: "Textbox", supportsValueOptions: false },
    { id: FieldTypes.TextArea.toString(), name: "Text Area", supportsValueOptions: false },
    { id: FieldTypes.Number.toString(), name: "Number", supportsValueOptions: false },
    { id: FieldTypes.SingleSelectList.toString(), name: "Single-Select List", supportsValueOptions: true },
    { id: FieldTypes.MultiSelectList.toString(), name: "Multi-Select List", supportsValueOptions: true },
    { id: FieldTypes.DateSelect.toString(), name: "Date Select", supportsValueOptions: false },
    { id: FieldTypes.DateTimeSelect.toString(), name: "Date/Time Select", supportsValueOptions: false },
    { id: FieldTypes.CheckboxList.toString(), name: "Checkbox List", supportsValueOptions: true },
    { id: FieldTypes.RadioList.toString(), name: "Radio List", supportsValueOptions: true }
  ]
  public selectedFieldTypeId: string;
  public defaultValue: string;

  async navigate(url: string) {

    const navCtrl: HTMLIonRouterElement = await (this.nav as any).componentOnReady();
    navCtrl.push(url);
  }

  dismiss(data?: any) {
    
    (this.el.closest('ion-modal') as any).dismiss(data);
  }

  async handleSaveClick() {

    let stringifiedJson = JSON.stringify({
      name: this.name,
      type: this.selectedFieldTypeId,
      valueOptions: this.valueOptions,
      defaultValue: this.defaultValue
    });
    
    for (let v of this.valueOptions) {
      if (v.id.toString().startsWith("tempId_")) {
        stringifiedJson = stringifiedJson.replace(v.id.toString(), "000000000000000000000000");
      }
    }

    let response = await fetch(
      this.apiBaseUrl + "/fields", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: stringifiedJson
    });

    if (response.status === 200) {

      this.dismiss();
    }
  }
  
  @Listen('ionChange')
  handleFieldTypeChanged(event: any) {
    
    if (event.detail.value) {
      
      if (event.target.id === "fieldName") {
        
        this.name = event.detail.value;
      }
      else if (event.target.id === "fieldTypeSelect") {
        
        var selectedFieldType = this.fieldTypes.find((obj) => { 
          return obj.id === event.detail.value;
        });
        
        if (selectedFieldType) {
          this.selectedFieldTypeId = selectedFieldType.id;

          this.showFieldOptions = selectedFieldType.supportsValueOptions;

          if (this.showFieldOptions) {
            this.valueOptions = [ { id: "tempId_" + 0, name: "" } ];
          }
        }
      }
      else if (event.target.id === "defaultValue") {
        
        this.defaultValue = event.detail.value;
      }
      else if (event.target.id.toString().startsWith("tempId_")) {
        
        let tempArray = this.valueOptions;
        let tempItemId = parseInt(event.target.id.toString().replace("tempId_", ""));
        tempArray[tempItemId] = { id: "tempId_" + tempItemId, name: event.detail.value };
        this.valueOptions = tempArray;
      }
      
    }
  }

  addValueOption() {
    
    this.valueOptions = [...this.valueOptions, 
      { id: "tempId_" + this.valueOptions.length, name: "" }
    ];
  }

  render() {
    return[
      <ion-header> 

        <ion-toolbar color="secondary">
          <ion-title>Create Field</ion-title>
        </ion-toolbar>

      </ion-header>,

      <ion-content>

        <ion-item></ion-item>
        <ion-item>
          <ion-label position='fixed'>Name</ion-label>
          <ion-input id="fieldName" required debounce={ 200 } value={ this.name }></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position='fixed'>Field Type</ion-label>
          <ion-select id="fieldTypeSelect" placeholder="Select Field Type" value={ this.selectedFieldTypeId }>
            { this.fieldTypes.map(type => 
              <ion-select-option value={ type.id }>
                { type.name }
              </ion-select-option>)}
          </ion-select>
        </ion-item>

        <ion-card style={{ display: this.showFieldOptions ? 'block' : 'none' }}>
          <ion-card-header>Field Options</ion-card-header>
          <ion-card-content>
            <ion-list>
              { this.valueOptions.map(option =>
                <ion-item>
                  <ion-input id={ option.id } debounce={ 200 } value={ option.name }></ion-input>
                </ion-item>
              )}
            </ion-list>
            <ion-button onClick={ () => this.addValueOption() }>
              Add
            </ion-button>
          </ion-card-content>
        </ion-card>

        <ion-item>
          <ion-label position='fixed'>Default Value</ion-label>
          <ion-input id="defaultValue" debounce={ 200 } value={ this.defaultValue }></ion-input>
        </ion-item>

      </ion-content>,

      <ion-footer>
        <ion-buttons slot="end">
          <ion-button color="primary" fill="solid" onClick={ () => this.handleSaveClick() }>Save</ion-button>
          <ion-button color="primary" onClick={ () => this.dismiss()}>Cancel</ion-button>
        </ion-buttons>
      </ion-footer>
    ];
  }
}