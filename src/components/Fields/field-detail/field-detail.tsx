import { Component, Listen, Prop, State } from '@stencil/core';
import { ENV } from '../../../environments/environment';
import { Field, FieldTypes } from '../../../interfaces/interfaces';

@Component({
  tag: 'field-detail'
})
export class FieldDetail {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Prop({ connect: 'ion-router' }) nav;
  @Prop() fieldId: string;
  @Prop() returnUrl = '/fields';
  @State() subtitle: string = 'Field: ';
  @State() field: Field;
  @State() fieldTypeName: string;
  @State() showFieldOptions: boolean;
  @State() valueOptions: Array<any> = [];
  public fieldTypes: Array<any> = [
    { id: FieldTypes.Textbox, name: "Textbox", supportsValueOptions: false },
    { id: FieldTypes.TextArea, name: "Text Area", supportsValueOptions: false },
    { id: FieldTypes.Number, name: "Number", supportsValueOptions: false },
    { id: FieldTypes.SingleSelectList, name: "Single-Select List", supportsValueOptions: true },
    { id: FieldTypes.MultiSelectList, name: "Multi-Select List", supportsValueOptions: true },
    { id: FieldTypes.DateSelect, name: "Date Select", supportsValueOptions: false },
    { id: FieldTypes.DateTimeSelect, name: "Date/Time Select", supportsValueOptions: false },
    { id: FieldTypes.CheckboxList, name: "Checkbox List", supportsValueOptions: true },
    { id: FieldTypes.RadioList, name: "Radio List", supportsValueOptions: true }
  ]

  async componentWillLoad() {

    await this.loadField();
  }

  async navigate(url: string) {

    const navCtrl: HTMLIonRouterElement = await (this.nav as any).componentOnReady();
    navCtrl.push(url);
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

      var fieldTypeId = this.field.type;
      var ft = this.fieldTypes.find((item) => {
        return item.id === fieldTypeId;
      });
      this.fieldTypeName = ft.name;
      this.showFieldOptions = ft.supportsValueOptions;

      if (this.field.valueOptions) {
        this.valueOptions = this.field.valueOptions;
      }
    }
  }

  async handleSaveClick() {

    let stringifiedJson = JSON.stringify({
      name: this.field.name,
      type: this.field.type,
      valueOptions: this.valueOptions,
      defaultValue: this.field.defaultValue
    });

    for (let v of this.valueOptions) {
      if (v.id.toString().startsWith("tempId_")) {
        stringifiedJson = stringifiedJson.replace(v.id.toString(), "000000000000000000000000");
      }
    }
    
    let response = await fetch(
      this.apiBaseUrl + "/fields/" + this.field.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: stringifiedJson
    });

    if (response.status === 200) {

      this.navigate("/fields");
    }
  }

  async handleFieldOptionDeleteClick(fieldOption: any) {

    this.valueOptions = this.valueOptions.filter((item) => {
      return item.id != fieldOption.id;
    })

    let listElement = document.querySelector('ion-list') as HTMLIonListElement;
    listElement.closeSlidingItems();
  }
  
  addValueOption() {
    
    this.valueOptions = [...this.valueOptions, {
      id: "tempId_" + this.valueOptions.length,
      name: ""
    }];
  }

  @Listen('ionInput')
  handleInput(event: any) {

    if (event.target.id === "fieldName") {
      this.field.name = event.detail.target.value;
    }
    else if (event.target.id === "defaultValue") {
      this.field.defaultValue = event.detail.target.value;
    }
    else if (event.target.id.toString().startsWith("tempId_")) {
      let tempArray = this.valueOptions;
      let tempItemId = parseInt(event.target.id.toString().replace("tempId_", ""));
      tempArray[tempItemId] = { id: "tempId_" + tempItemId, name: event.detail.target.value };
      this.valueOptions = tempArray;
    }
    else if (event.target.id) {
      let itemIndex = this.valueOptions.findIndex((obj) => { 
        return obj.id === event.target.id;
      });
      this.valueOptions[itemIndex].name = event.detail.target.value;
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

        <ion-item></ion-item>
          <ion-item>
            <ion-label position='fixed'>Name</ion-label>
            <ion-input id="fieldName" required debounce={ 200 } value={ this.field.name }></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position='fixed'>Field Type</ion-label>
            <ion-input disabled value={ this.fieldTypeName }></ion-input>
          </ion-item>
          <ion-card style={{ display: this.showFieldOptions ? 'block' : 'none' }}>
            <ion-card-header>Field Options</ion-card-header>
            <ion-card-content>
              <ion-list>
                { this.valueOptions.map(option =>
                  <ion-item-sliding>
                    <ion-item>
                      <ion-input id={ option.id } debounce={ 200 } value={ option.name }></ion-input>
                    </ion-item>
                    <ion-item-options>
                      <ion-item-option color="danger" onClick={ () =>
                          this.handleFieldOptionDeleteClick(option)
                        }>
                        Delete
                      </ion-item-option>
                    </ion-item-options>
                  </ion-item-sliding>
                )}
              </ion-list>
              <ion-button onClick={ () => this.addValueOption() }>
                Add
              </ion-button>
            </ion-card-content>
          </ion-card>

          <ion-item>
            <ion-label position='fixed'>Default Value</ion-label>
            <ion-input id="defaultValue" debounce={ 200 } value={ this.field.defaultValue }></ion-input>
          </ion-item>
        
      </ion-content>,

      <ion-footer>
        <ion-buttons slot="end">
          <ion-button color="primary" fill="solid" onClick={ () => this.handleSaveClick() }>Save</ion-button>
          <ion-button color="primary" onClick={ () => this.navigate('/fields')}>Cancel</ion-button>
        </ion-buttons>
      </ion-footer>
    ];
  }
}