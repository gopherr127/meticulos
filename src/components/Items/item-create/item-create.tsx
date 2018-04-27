import { Component, Listen, Prop, State } from '@stencil/core';
import { ToastController } from '@ionic/core';
import { ENV } from '../../../environments/environment';
import * as FormValidator from '../../../services/form-validation-service';
import { Item, ItemType, Screen, FieldMetadata, FieldTypes, FieldValue } from '../../../interfaces/interfaces';

@Component({
  tag: 'item-create'
})
export class ItemCreate {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Prop({ connect: 'ion-router' }) nav;
  @Prop({ connect: 'ion-toast-controller' }) toastCtrl: ToastController;
  @Prop() itemTypeId: string;
  @Prop() returnUrl = '/';
  @State() subtitle: string = 'Create Item';
  @State() item: Item;
  @State() itemType: ItemType;
  @State() createScreen: Screen;
  @State() name: string;
  @State() fieldMetadata: Array<FieldMetadata> = [];
  @State() fieldValues: Array<FieldValue> = []
  
  async componentWillLoad() {

    await this.loadItemType();
  }

  async componentDidLoad() {

    // Possible race condition in trying to load fields
    // when the screen and metadata has not yet completed.
    await this.addFieldsFromMetadata();
  }

  async loadItemType() {

    let response = await fetch(
      this.apiBaseUrl + "/itemtypes/" + this.itemTypeId, { 
        method: "GET"
    });

    if (response.ok) {

      this.itemType = await response.json();
      this.subtitle = `Create ${this.itemType.pluralName}`;
      await this.loadCreateScreen();
    }
  }

  async loadCreateScreen() {

    let response = await fetch(
      this.apiBaseUrl + `/screens/${ this.itemType.createScreenId }`, {
        method: "GET"
    });

    if (response.ok) {

      this.createScreen = await response.json();
      this.fieldMetadata = this.createScreen.fields;
    }
  }

  async addFieldsFromMetadata() {

    let fieldsListEl = document.getElementById("fieldsList");
    fieldsListEl.innerHTML = "";
    
    for (let fieldMeta of this.fieldMetadata) {

      if (fieldMeta.defaultValue) {
        // Store default field values to be saved
        let newFV: FieldValue = {
          fieldId: fieldMeta.id,
          fieldName: fieldMeta.name,
          value: fieldMeta.defaultValue
        };

        this.fieldValues.push(newFV);
      }
      
      switch (fieldMeta.type) {
        case FieldTypes.Textbox:
          var txtNode = document.createElement("textbox-field");
          txtNode.setAttribute("field-id", fieldMeta.id);
          txtNode.setAttribute("field-name", fieldMeta.name);
          txtNode.setAttribute("debounce", '200');
          if (fieldMeta.isRequired) {
            txtNode.setAttribute("is-required", 'true');
          }
          if (fieldMeta.defaultValue) {
            txtNode.setAttribute("field-value", fieldMeta.defaultValue);
          }
          fieldsListEl.appendChild(txtNode);
          break;

        case FieldTypes.TextArea:
          var txtAreaNode = document.createElement("textarea-field");
          txtAreaNode.setAttribute("field-id", fieldMeta.id);
          txtAreaNode.setAttribute("field-name", fieldMeta.name);
          txtAreaNode.setAttribute("debounce", '200');
          if (fieldMeta.isRequired) {
            txtAreaNode.setAttribute("is-required", 'true');
          }
          if (fieldMeta.defaultValue) {
            txtAreaNode.setAttribute("field-value", fieldMeta.defaultValue);
          }
          fieldsListEl.appendChild(txtAreaNode);
          break;

        case FieldTypes.Number:
          var numNode = document.createElement("textbox-field");
          numNode.setAttribute("type", 'number');
          numNode.setAttribute("field-id", fieldMeta.id);
          numNode.setAttribute("field-name", fieldMeta.name);
          numNode.setAttribute("debounce", '200');
          if (fieldMeta.isRequired) {
            numNode.setAttribute("is-required", 'true');
          }
          if (fieldMeta.defaultValue) {
            numNode.setAttribute("field-value", fieldMeta.defaultValue);
          }
          fieldsListEl.appendChild(numNode);
          break;
        
        case FieldTypes.SingleSelectList:
          var sslNode = document.createElement("selectlist-field");
          sslNode.setAttribute("field-id", fieldMeta.id);
          sslNode.setAttribute("field-name", fieldMeta.name);
          sslNode.setAttribute("field-options", JSON.stringify(fieldMeta.valueOptions));
          if (fieldMeta.isRequired) {
            sslNode.setAttribute("is-required", 'true');
          }
          if (fieldMeta.defaultValue) {
            sslNode.setAttribute("field-value", fieldMeta.defaultValue);
          }
          fieldsListEl.appendChild(sslNode);
          break;

        case FieldTypes.MultiSelectList:
          var mslNode = document.createElement("selectlist-field");
          mslNode.setAttribute("field-id", fieldMeta.id);
          mslNode.setAttribute("field-name", fieldMeta.name);
          mslNode.setAttribute("field-options", JSON.stringify(fieldMeta.valueOptions));
          mslNode.setAttribute("is-multiple", 'true');
          if (fieldMeta.isRequired) {
            mslNode.setAttribute("is-required", 'true');
          }
          if (fieldMeta.defaultValue) {
            mslNode.setAttribute("field-value", JSON.stringify(fieldMeta.defaultValue));
          }
          fieldsListEl.appendChild(mslNode);
          break;
         
        case FieldTypes.DateSelect:
        case FieldTypes.DateTimeSelect:
        case FieldTypes.CheckboxList:
        case FieldTypes.RadioList:        
        default:
          break;
      }      
    }
  }

  async navigate(url: string) {

    const navCtrl: HTMLIonRouterElement = await (this.nav as any).componentOnReady();
    navCtrl.push(url);
  }

  async showToastMessage(messageToDisplay: string) {

    const toast = await this.toastCtrl.create({ 
      position: 'top',
      message: messageToDisplay, 
      showCloseButton: true,
      closeButtonText: 'OK'
    });

    await toast.present();
  }

  async handleSaveClick() {

    let validationResult = await FormValidator.validateForm(
      this.fieldMetadata, this.fieldValues);
    
    if (validationResult.result) {

      console.log(JSON.stringify({
        name: this.name,
        typeId: this.itemTypeId,
        fieldValues: this.fieldValues
      }));

      let response = await fetch(
        this.apiBaseUrl + "/items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: this.name,
            typeId: this.itemTypeId,
            fieldValues: this.fieldValues
          })
      });
  
      if (response.ok) {
  
        this.navigate(this.returnUrl);
      }
      else
      {
        
        const toast = await this.toastCtrl.create({ 
          position: 'top',
          message: await response.text(), 
          showCloseButton: true,
          closeButtonText: 'OK'
        });

        await toast.present();
      }
    }
    else {

      const toast = await this.toastCtrl.create({ 
        position: 'top',
        message: validationResult.displayMessage, 
        showCloseButton: true,
        closeButtonText: 'OK'
      });

      await toast.present();
    }
  }
  
  @Listen('ionInput')
  handleFieldInput(event: any) {

    // console.log("Field input");
    // console.log(event);
    if (event.detail.target) {

      if (event.target.id === "itemName") {

        // Update Name field
        this.name = event.detail.target.value;
        // console.log("Name updated to:");
        // console.log(this.name);
      }
      else {
        
        // See if we've already stored a value for the field
        var fv = this.fieldValues.find((item) => {
          return item.fieldId === event.target.id;
        });

        var fvValue = event.detail.target.value;

        if (fv) {

          // Update the existing field value
          fv.value = fvValue;
          // console.log(`Field ${fv.fieldName} updated to: ${fvValue} via input event`);
        }
        else {

          // Store a new field value
          let fMeta = this.fieldMetadata.find((item) => {
            return item.id === event.target.id;
          });
          let newFV: FieldValue = {
            fieldId: event.target.id,
            fieldName: fMeta.name,
            value: fvValue
          };

          this.fieldValues.push(newFV);
          // console.log(`Field ${fMeta.name} added with: ${fvValue} via input event`);
        }
      }
    }
  }

  @Listen('ionChange')
  handleFieldChange(event: any) {

    // console.log("Field change");
    // console.log(event);
    if (event.detail) {

      if (event.target.id != "itemName") {

        // See if we've already stored a value for the field
        var fv = this.fieldValues.find((item) => {
          return item.fieldId === event.target.id;
        });

        var fvValue = Array.isArray(event.detail.value)
          ? JSON.stringify(event.detail.value)
          : event.detail.value;

        if (fv) {

          // Update the existing field value
          fv.value = fvValue;
          // console.log(`Field ${fv.fieldName} updated to: ${fvValue} via change event`);
        }
        else {

          // Store a new field value
          let fMeta = this.fieldMetadata.find((item) => {
            return item.id === event.target.id;
          });

          if (fMeta) {

            let newFV: FieldValue = {
              fieldId: event.target.id,
              fieldName: fMeta.name,
              value: fvValue
            };

            this.fieldValues.push(newFV);
            // console.log(`Field ${fMeta.name} added with: ${fvValue} via change event`);
          }
          else {

            console.log("Could not find expected field metadata: " + event.target.id);
          }
        }
      }
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
            <ion-input id="itemName" debounce={200} value={ this.name }></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position='fixed'>Item Type</ion-label>
            <ion-input disabled value={ this.itemType.name }></ion-input>
          </ion-item>

          <ion-card>
            <ion-card-header>
              Fields
            </ion-card-header>
            <ion-card-content>
              <ion-list id="fieldsList"></ion-list>
            </ion-card-content>
          </ion-card>
          
      </ion-content>,

      <ion-footer>
        <ion-buttons slot="end">
          <ion-button color="primary" fill="solid" onClick={ () => this.handleSaveClick() }>Save</ion-button>
          <ion-button color="primary" onClick={ () => this.navigate(this.returnUrl)}>Cancel</ion-button>
        </ion-buttons>
      </ion-footer>
    ];
  }
}