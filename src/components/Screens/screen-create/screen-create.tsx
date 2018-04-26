import { Component, Element, Prop, State, Listen } from '@stencil/core';
import { ENV } from '../../../environments/environment';
import { FieldMetadata, FieldTypes } from '../../../interfaces/interfaces';

@Component({
  tag: 'screen-create'
})
export class ScreenCreate {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  fieldsList: HTMLIonListElement;
  @Prop({ connect: 'ion-router' }) nav;
  @State() name: string;
  @State() fields: Array<FieldMetadata> = [];
  @State() selectedFields: Array<FieldMetadata> = [];
  
  async componentWillLoad() {
    
    await this.loadFields();
  }

  componentDidLoad() {

    this.fieldsList = this.el.querySelector('#fieldsList');
  }

  async navigate(url: string) {

    const navCtrl: HTMLIonRouterElement = await (this.nav as any).componentOnReady();
    navCtrl.push(url);
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
          fields: this.selectedFields
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
            <ion-input id="screenName" required debounce={ 200 } value={ this.name }></ion-input>
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