import { Component, Element, Listen, Prop, State } from '@stencil/core';
import { ToastController } from '@ionic/core';
import { ENV } from '../../../environments/environment';
import * as FormValidator from '../../../services/form-validation-service';
import { Item, ItemType, Screen, FieldMetadata, FieldTypes, FieldValue } from '../../../interfaces/interfaces';

@Component({
  tag: 'item-detail'
})
export class ItemDetail {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  @Prop({ connect: 'ion-router' }) router;
  @Prop({ connect: 'ion-toast-controller' }) toastCtrl: ToastController;
  @Prop() itemId: string;
  @Prop() returnUrl = '/items';
  @State() subtitle: string = 'Create Item';
  @State() item: Item;
  @State() itemType: ItemType;
  @State() editScreen: Screen;
  @State() fieldMetadata: Array<FieldMetadata> = [];
  
  async componentWillLoad() {

    await this.loadItem();
  }

  async componentDidLoad() {

    await this.loadEditScreen();
    await this.addFieldsFromMetadata();
  }

  async navigate(url: string) {

    const routerCtrl: HTMLIonRouterElement = await (this.router as any).componentOnReady();
    routerCtrl.push(url);
  }

  popComponent() {

    const navCtrl = document.querySelector('ion-nav');
    navCtrl.pop();
  }

  async loadItem() {

    let response = await fetch(
      this.apiBaseUrl + "/items/" + this.itemId, { 
        method: "GET"
    });

    if (response.ok) {

      this.item = await response.json();
      this.itemType = this.item.type;
      this.subtitle = `${this.itemType.name} - ${this.item.name}`;
    }
  }

  async loadEditScreen() {

    let response = await fetch(
      this.apiBaseUrl + `/screens/${ this.itemType.editScreenId }`, {
        method: "GET"
    });

    if (response.ok) {

      this.editScreen = await response.json();
      this.fieldMetadata = this.editScreen.fields;
    }
  }

  async addFieldsFromMetadata() {

    let fieldsListEl = document.getElementById("fieldsList");
    fieldsListEl.innerHTML = "";
    
    for (let fieldMeta of this.fieldMetadata) {

      var fieldValue = this.item.fieldValues.find((item) => {
        return item.fieldId === fieldMeta.id;
      });
      
      
      switch (fieldMeta.type) {
        case FieldTypes.Textbox:
          var txtNode = document.createElement("textbox-field");
          txtNode.setAttribute("field-id", fieldMeta.id);
          txtNode.setAttribute("field-name", fieldMeta.name);
          txtNode.setAttribute("debounce", '200');
          if (fieldValue) {
            txtNode.setAttribute("field-value", fieldValue.value);
          }
          if (fieldMeta.isRequired) {
            txtNode.setAttribute("is-required", 'true');
          }
          fieldsListEl.appendChild(txtNode);
          break;
        
        case FieldTypes.TextArea:
          var txtAreaNode = document.createElement("textarea-field");
          txtAreaNode.setAttribute("field-id", fieldMeta.id);
          txtAreaNode.setAttribute("field-name", fieldMeta.name);
          txtAreaNode.setAttribute("debounce", '200');
          if (fieldValue) {
            txtAreaNode.setAttribute("field-value", fieldValue.value);
          }
          if (fieldMeta.isRequired) {
            txtAreaNode.setAttribute("is-required", 'true');
          }
          fieldsListEl.appendChild(txtAreaNode);
          break;

        case FieldTypes.Number:
          var numNode = document.createElement("textbox-field");
          numNode.setAttribute("field-id", fieldMeta.id);
          numNode.setAttribute("field-name", fieldMeta.name);
          numNode.setAttribute("debounce", '200');
          if (fieldValue) {
            numNode.setAttribute("field-value", fieldValue.value);
          }
          if (fieldMeta.isRequired) {
            numNode.setAttribute("is-required", 'true');
          }
          fieldsListEl.appendChild(numNode);
          break;
        
        case FieldTypes.SingleSelectList:
          var sslNode = document.createElement("selectlist-field");
          sslNode.setAttribute("field-id", fieldMeta.id);
          sslNode.setAttribute("field-name", fieldMeta.name);
          sslNode.setAttribute("field-options", JSON.stringify(fieldMeta.valueOptions));
          if (fieldValue) {
            sslNode.setAttribute("field-value", fieldValue.value);
          }
          if (fieldMeta.isRequired) {
            sslNode.setAttribute("is-required", 'true');
          }
          fieldsListEl.appendChild(sslNode);
          break;

        case FieldTypes.MultiSelectList:
          var mslNode = document.createElement("selectlist-field");
          mslNode.setAttribute("field-id", fieldMeta.id);
          mslNode.setAttribute("field-name", fieldMeta.name);
          mslNode.setAttribute("field-options", JSON.stringify(fieldMeta.valueOptions));
          mslNode.setAttribute("is-multiple", '');
          if (fieldValue) {
            mslNode.setAttribute("field-value", JSON.stringify(fieldValue.value));
          }
          if (fieldMeta.isRequired) {
            mslNode.setAttribute("is-required", 'true');
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

  async handleSaveClick() {

    let validationResult = await FormValidator.validateForm(
      this.fieldMetadata, this.item.fieldValues);
    
    if (validationResult.result) {

      let response = await fetch(
        this.apiBaseUrl + "/items/" + this.item.id, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(this.item)
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

    if (event.detail.target) {

      if (event.target.id === "itemName") {

        // Update Name field
        this.item.name = event.detail.target.value;
      }
      else {
        
        // See if we've already stored a value for the field
        var fv = this.item.fieldValues.find((item) => {
          return item.fieldId === event.target.id;
        });

        var fvValue = event.detail.target.value;

        if (fv) {

          // Update the existing field value
          fv.value = fvValue;
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

          this.item.fieldValues.push(newFV);
        }
      }
    }
  }

  @Listen('ionChange')
  handleFieldChange(event: any) {

    if (event.detail) {

      if (event.target.id != "itemName") {

        // See if we've already stored a value for the field
        var fv = this.item.fieldValues.find((item) => {
          return item.fieldId === event.target.id;
        });

        var fvValue = Array.isArray(event.detail.value)
          ? JSON.stringify(event.detail.value)
          : event.detail.value;

        if (fv) {

          // Update the existing field value
          fv.value = fvValue;
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

            this.item.fieldValues.push(newFV);
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
          <ion-input id="itemName" debounce={200} value={ this.item.name }></ion-input>
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
          <ion-button color="primary" onClick={ () => this.popComponent() }>Cancel</ion-button>
        </ion-buttons>
      </ion-footer>
    ];
  }
}