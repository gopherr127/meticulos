import { Component, Element, State, Listen } from '@stencil/core';
import { ENV } from '../../../environments/environment';
import { FieldMetadata, FieldTypes } from '../../../interfaces/interfaces';

@Component({
  tag: 'screen-create'
})
export class ScreenCreate {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  fieldsList: HTMLIonListElement;
  @State() name: string;
  @State() fields: Array<FieldMetadata> = [];
  @State() selectedFields: Array<FieldMetadata> = [];
  @State() displayLocation: boolean;
  @State() displayLinkedItems: boolean;
  @State() displayChildItems: boolean;
  @State() displayImageCapture: boolean;
  @State() displayAttachments: boolean;
  
  async componentWillLoad() {
    
    await this.loadFields();
  }

  componentDidLoad() {

    this.fieldsList = this.el.querySelector('#fieldsList');
  }

  dismiss(data?: any) {
    
    (this.el.closest('ion-modal') as any).dismiss(data);
  }

  async loadFields() {

    let response = await fetch(
      this.apiBaseUrl + "/fields", {
      method: "GET"
    });

    this.fields = await response.json();
  }

  async handleSaveClick() {

    let response = await fetch(
      this.apiBaseUrl + "/screens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: this.name,
          fields: this.selectedFields,
          displayLocation: this.displayLocation,
          displayLinkedItems: this.displayLinkedItems,
          displayChildItems: this.displayChildItems,
          displayImageCapture: this.displayImageCapture,
          displayAttachments: this.displayAttachments
        })
    });

    if (response.ok) {
      
      this.dismiss();
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
  handleItemTypeChanged(event: any) {

    if (event.target.id === "screenName") {

      this.name = event.detail.value;
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
      this.displayLocation = event.detail.data;
    }
    else if (event.target.id === "displayLinkedItemsCheckbox") {
      this.displayLinkedItems = event.detail.data;
    }
    else if (event.target.id === "displayChildItemsCheckbox") {
      this.displayChildItems = event.detail.data;
    }
    else if (event.target.id === "displayImageCaptureCheckbox") {
      this.displayImageCapture = event.detail.data;
    }
    else if (event.target.id === "displayAttachmentsCheckbox") {
      this.displayAttachments = event.detail.data;
    }
  }

  render() {
    return[
      <ion-header> 

        <ion-toolbar color="secondary">
          <ion-title>Create Screen</ion-title>
        </ion-toolbar>

      </ion-header>,

      <ion-content>

        <ion-item></ion-item>
        <ion-item>
          <ion-label position='fixed'>Name</ion-label>
          <ion-input id="screenName" debounce={ 200 } value={ this.name }></ion-input>
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
                  </ion-select-option>)
                }
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

      <ion-footer>
        <ion-buttons slot="end">
          <ion-button color="primary" fill="solid" onClick={ () => this.handleSaveClick() }>Save</ion-button>
          <ion-button color="primary" onClick={ () => this.dismiss()}>Cancel</ion-button>
        </ion-buttons>
      </ion-footer>
    ];
  }
}