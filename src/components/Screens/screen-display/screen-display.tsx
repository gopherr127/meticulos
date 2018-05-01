import { Component, Element, Prop, State, Listen } from "@stencil/core";
import { ToastController } from '@ionic/core';
import { ENV } from '../../../environments/environment';
import * as FormValidator from '../../../services/form-validation-service';
import { FieldMetadata, FieldTypes, FieldValue, Item, Screen, WorkflowTransition } from '../../../interfaces/interfaces';

@Component({
  tag: 'screen-display'
})
export class ScreenDisplay {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  @Prop({ connect: 'ion-toast-controller' }) toastCtrl: ToastController;
  @Prop() item: Item;
  @Prop() transition: WorkflowTransition;
  public screens: Array<Screen> = [];
  @State() currentScreen: Screen;
  @State() currentScreenIndex: number = -1;
  @State() hasPreviousScreen: boolean;
  @State() hasNextScreen: boolean;
  @State() fieldMetadata: Array<FieldMetadata> = [];
  
  async componentWillLoad() {

    console.log(this.transition.screenIds);
    let response = await fetch(
      this.apiBaseUrl + "/screens/find", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.transition.screenIds)
    });

    console.log(response);
    if (response.ok) {

      this.screens = await response.json();
      console.log(this.screens);
      this.currentScreen = this.screens ? this.screens[0] : null;
    }
  }

  async componentDidLoad() {

    await this.navigateScreens(1);
  }

  async navigateScreens(screenIndexDelta: number) {

    if (this.screens && this.screens.length > 0) {

      this.currentScreenIndex += screenIndexDelta;
      this.currentScreen = this.screens[this.currentScreenIndex];
      this.hasPreviousScreen = this.currentScreenIndex > 0;
      this.hasNextScreen = this.screens.length > this.currentScreenIndex + 1;

      this.fieldMetadata = this.currentScreen.fields ? this.currentScreen.fields : [];
      
      await this.addFieldsFromMetadata();
    }
  }
  
  async addFieldsFromMetadata() {

    let fieldsListEl = document.getElementById("modalFieldsList");
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
          if (fieldValue) {
            mslNode.setAttribute("field-value", fieldValue.value);
          }
          if (fieldMeta.isRequired) {
            mslNode.setAttribute("is-required", 'true');
          }
          mslNode.setAttribute("is-multiple", 'true');
          fieldsListEl.appendChild(mslNode);
          break;

        case FieldTypes.ImageCapture: {
          var imgNode = document.createElement("imagecapture-field");
          fieldsListEl.appendChild(imgNode);
          break;
        }   
        default:
          break;
      }   
    }

  }
  
  dismiss(data?: any) {
    
    (this.el.closest('ion-modal') as any).dismiss(data);
  }

  async showToastMessage(messageToDisplay: string) {
        
    const actionSheetController = this.el.querySelector('ion-action-sheet-controller');
    await actionSheetController.componentOnReady();

    const actionSheet = await actionSheetController.create({
      header: messageToDisplay,
      buttons: [{
        text: 'OK',
        role: 'cancel'
      }]
    });

    await actionSheet.present();
  }

  async handlePreviousClick() {

    await this.navigateScreens(-1);
  }

  async handleNextClick() {

    let validationResult = await FormValidator.validateForm(
      this.fieldMetadata, this.item.fieldValues);
    
    if (validationResult.result) {

      await this.navigateScreens(1);
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

  async handleSaveClick() {

    let validationResult = await FormValidator.validateForm(
      this.fieldMetadata, this.item.fieldValues);
    
    if (validationResult.result) {

      this.dismiss(JSON.stringify(this.item.fieldValues));
    }
    else {

      this.showToastMessage(validationResult.displayMessage);
    }
  }

  @Listen('ionChange')
  handleFieldChange(event: any) { 

    // See if we've already stored a value for the field
    var fv = this.item.fieldValues.find((item) => {
      return item.fieldId === event.target.id;
    });

    if (fv) {
      
      // Update the existing field value
      fv.value = event.detail.value;
    }
    else {

      // Store a new field value
      let fMeta = this.fieldMetadata.find((item) => {
        return item.id === event.target.id;
      });
      let newFV: FieldValue = {
        fieldId: event.target.id,
        fieldName: fMeta.name,
        value: event.detail.value
      };
      this.item.fieldValues.push(newFV);
    }
  }

  render() {
    return[
      <ion-header>

        <ion-action-sheet-controller></ion-action-sheet-controller>
        <ion-toolbar color="secondary">
          <ion-buttons slot="start" style={{ display: this.hasPreviousScreen ? 'block' : 'none' }}>
            <ion-button onClick={() => this.handlePreviousClick()}>Previous</ion-button>
          </ion-buttons>
          <ion-title>{ this.currentScreen.name }</ion-title>
          <ion-buttons slot="end">
            { this.hasNextScreen 
              ? <ion-button onClick={() => this.handleNextClick()}>Next</ion-button>
              : <ion-button onClick={() => this.handleSaveClick()}>Save</ion-button> 
            }
          </ion-buttons>
        </ion-toolbar>

      </ion-header>,

      <ion-content>

        <ion-card>
          <ion-card-header>
            Fields
          </ion-card-header>
          <ion-card-content>
            <ion-list id="modalFieldsList"></ion-list>
          </ion-card-content>
        </ion-card>

      </ion-content>,

      <ion-footer>
        <ion-buttons slot="end">
          <ion-button color="primary" onClick={ () => this.dismiss()}>Cancel</ion-button>
        </ion-buttons>
      </ion-footer>
    ];
  }
}