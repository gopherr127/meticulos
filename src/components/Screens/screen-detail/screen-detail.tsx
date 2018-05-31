import { Component, Element, Listen, Prop, State } from '@stencil/core';
import { ENV } from '../../../environments/environment';
import { FieldMetadata, FieldTypes, Screen } from '../../../interfaces/interfaces';

@Component({
  tag: 'screen-detail'
})
export class ScreenDetail {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  fieldsList: HTMLIonListElement;
  @Prop({ connect: 'ion-router' }) nav;
  @Prop() screenId: string;
  @Prop() returnUrl = '/screens';
  @State() subtitle: string = 'Screen: ';
  @State() screen: Screen;
  @State() fields: Array<FieldMetadata> = [];
  @State() selectedFields: Array<FieldMetadata> = [];
  @State() displayLocation: boolean;
  @State() displayLinkedItems: boolean;
  @State() displayChildItems: boolean;
  @State() displayImageCapture: boolean;
  @State() displayAttachments: boolean;
  
  async componentWillLoad() {

    await this.loadScreen();
    await this.loadFields();
  }

  componentDidLoad() {

    this.fieldsList = this.el.querySelector('#fieldsList');
  }

  async navigate(url: string) {

    const navCtrl: HTMLIonRouterElement = await (this.nav as any).componentOnReady();
    navCtrl.push(url);
  }

  async loadScreen() {

    let response = await fetch(
      this.apiBaseUrl + "/screens/" + this.screenId, {
        method: "GET"
    });

    if (response.ok) {
      this.screen = await response.json();
      this.subtitle = 'Screen: ' + this.screen.name;
      this.selectedFields = this.screen.fields;
      this.displayLocation = this.screen.displayLocation;
      this.displayChildItems = this.screen.displayChildItems;
      this.displayLinkedItems = this.screen.displayLinkedItems;
      this.displayAttachments = this.screen.displayAttachments;
      this.displayImageCapture = this.screen.displayImageCapture;
    }
  }

  async loadFields() {

    let response = await fetch(
      this.apiBaseUrl + "/fields", {
      method: "GET"
    });

    if (response.ok) {
      this.fields = await response.json();
    }
  }

  async handleSaveClick() {

    let scrn = {
      name: this.screen.name,
      fields: this.selectedFields,
      displayLocation: this.displayLocation,
      displayLinkedItems: this.displayLinkedItems,
      displayChildItems: this.displayChildItems,
      displayImageCapture: this.displayImageCapture,
      displayAttachments: this.displayAttachments
    };
    console.log("scrn:");
    console.log(scrn);

    let response = await fetch(
      this.apiBaseUrl + "/screens/" + this.screenId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: this.screen.name,
          fields: this.selectedFields,
          displayLocation: this.displayLocation,
          displayLinkedItems: this.displayLinkedItems,
          displayChildItems: this.displayChildItems,
          displayImageCapture: this.displayImageCapture,
          displayAttachments: this.displayAttachments
        })
    });

    if (response.ok) {
      
      //this.navigate("/screens");
    }
  }

  handleFieldRequireClick(field: FieldMetadata) {

    field.isRequired = !field.isRequired;
    
    this.selectedFields = this.selectedFields.map(fld => 
      (fld.id === field.id) ? field : fld
    );
    
    this.fieldsList.closeSlidingItems();
  }

  async handleFieldDeleteClick(field: any) {

    this.selectedFields = this.selectedFields.filter((item) => {
      return item.id != field.id;
    });

    this.fieldsList.closeSlidingItems();
  }
  
  @Listen('ionChange')
  handleFieldChanged(event: any) {

    console.log(event);

    if (event.target.id === "screenName") {

      this.screen.name = event.detail.value;
    }
    else if (event.target.id === "fieldSelect" && event.detail.value) {
      
      // Note: only field reference is needed; server will re-select details
      let newField: FieldMetadata = {
        id: event.detail.value,
        name: event.detail.text,
        type: FieldTypes.Textbox,
        isRequired: false,
        defaultValue: '',
        valueOptions: []
      };

      this.selectedFields = [...this.selectedFields, newField];

      // THIS IS NOT WORKING, ALLOWING SAME FIELD TO BE SELECTED MANY TIMES
      // Remove the selected item from the list of field options
      // this.fields = this.fields.filter((item) => {
      //   return (item.id != event.detail.value);
      // });

      let fieldSelect = document.getElementById('fieldSelect') as HTMLIonSelectElement;
      fieldSelect.value = null;
    }
    else if (event.target.id === "displayLocationCheckbox") {
      this.displayLocation = event.detail.checked;
    }
    else if (event.target.id === "displayLinkedItemsCheckbox") {
      this.displayLinkedItems = event.detail.checked;
    }
    else if (event.target.id === "displayChildItemsCheckbox") {
      this.displayChildItems = event.detail.checked;
    }
    else if (event.target.id === "displayImageCaptureCheckbox") {
      this.displayImageCapture = event.detail.checked;
    }
    else if (event.target.id === "displayAttachmentsCheckbox") {
      this.displayAttachments = event.detail.checked;
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
            <ion-button id="optionsMenu">
              <ion-icon slot="icon-only" name="more"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>

        <ion-toolbar id="headerSection" color="tertiary">
            <ion-button slot="start" color="primary" fill="solid" 
                        onClick={ () => this.handleSaveClick() }>Save</ion-button>
        </ion-toolbar>

      </ion-header>,

      <ion-content>

        <ion-item></ion-item>
          <ion-item>
            <ion-label position='fixed'>Name</ion-label>
            <ion-input id="screenName" required debounce={ 200 } value={ this.screen.name }></ion-input>
          </ion-item>

          <ion-card>
            <ion-card-header no-padding>
              <ion-item>
                <ion-label>Selected Fields</ion-label>
              </ion-item>
            </ion-card-header>
            <ion-card-content>
              <ion-list id="fieldsList">
                { this.selectedFields.map(field => 
                  <ion-item-sliding>
                    <ion-item>
                      <h2>{ field.name }</h2>
                      <ion-icon style={{ display: field.isRequired ? 'block' : 'none' }} name="star" slot="end"></ion-icon>
                    </ion-item>
                    <ion-item-options>
                      { field.isRequired
                        ? <ion-item-option color="primary" onClick={ () =>
                            this.handleFieldRequireClick(field)
                          }>
                          Optional
                        </ion-item-option>
                          : <ion-item-option color="primary" onClick={ () =>
                            this.handleFieldRequireClick(field)
                          }>
                          Required
                        </ion-item-option>
                      }
                      <ion-item-option color="danger" onClick={ () =>
                          this.handleFieldDeleteClick(field)
                        }>
                        Delete
                      </ion-item-option>
                    </ion-item-options>
                  </ion-item-sliding>
                )}
              </ion-list>

              <ion-item>
                <ion-select id="fieldSelect">
                  { this.fields.map(field => 
                    <ion-select-option value={ field.id }>
                      { field.name }
                    </ion-select-option>)}
                </ion-select>
              </ion-item>
            </ion-card-content>
          </ion-card>

          <ion-card>
            <ion-card-header no-padding>
              <ion-item>
                <ion-label>Screen Options</ion-label>
              </ion-item>
            </ion-card-header>
            <ion-card-content>
              <ion-list>
                <ion-item>
                  <ion-label>Display Location</ion-label>
                  <ion-checkbox id="displayLocationCheckbox" 
                                checked={ this.displayLocation }></ion-checkbox>
                </ion-item>
                <ion-item>
                  <ion-label>Display Linked Items</ion-label>
                  <ion-checkbox id="displayLinkedItemsCheckbox" 
                                checked={ this.displayLinkedItems }></ion-checkbox>
                </ion-item>
                <ion-item>
                  <ion-label>Display Child Items</ion-label>
                  <ion-checkbox id="displayChildItemsCheckbox" 
                                checked={ this.displayChildItems }></ion-checkbox>
                </ion-item>
                <ion-item>
                  <ion-label>Display Image Capture</ion-label>
                  <ion-checkbox id="displayImageCaptureCheckbox" 
                                checked={ this.displayImageCapture }></ion-checkbox>
                </ion-item>
                <ion-item>
                  <ion-label>Display Atachments</ion-label>
                  <ion-checkbox id="displayAttachmentsCheckbox" 
                                checked={ this.displayAttachments }></ion-checkbox>
                </ion-item>
              </ion-list>
            </ion-card-content>
          </ion-card>

      </ion-content>,

      <ion-footer id="footerSection">
        <ion-buttons slot="end">
          <ion-button color="primary" fill="solid" onClick={ () => this.handleSaveClick() }>Save</ion-button>
          <ion-button color="primary" onClick={ () => this.navigate('/screens')}>Cancel</ion-button>
        </ion-buttons>
      </ion-footer>
    ];
  }
}