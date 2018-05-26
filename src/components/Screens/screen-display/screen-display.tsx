import { Component, Element, Event, EventEmitter, Prop, State } from "@stencil/core";
import { ToastController } from '@ionic/core';
import { ENV } from '../../../environments/environment';
import * as FormValidator from '../../../services/form-validation-service';
import { FieldMetadata, Item, Screen, WorkflowTransition } from '../../../interfaces/interfaces';
import { CustomFieldsGroup } from '../../Fields/customfields-group/customfields-group';

@Component({
  tag: 'screen-display'
})
export class ScreenDisplay {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  @Event() screenDisplayDismissed: EventEmitter;
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

    let response = await fetch(
      this.apiBaseUrl + "/screens/find", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.transition.screenIds)
    });

    if (response.ok) {

      this.screens = await response.json();
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
      
      const fieldGroupElem = this.el.querySelector('#screenDisplayCustomFieldsGroup') as CustomFieldsGroup;
      await fieldGroupElem.addFieldsFromMetadata(this.fieldMetadata);
    }
  }
  
  dismiss(data?: any) {
    
    this.screenDisplayDismissed.emit(data);
    (this.el.closest('ion-modal') as any).dismiss();
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

  handleCustomFieldValueChanged(event: any) {
    
    if (event.detail) {

      // See if we've already stored a value for the field
      var fv = this.item.fieldValues.find((item) => {
        return item.fieldId === event.detail.fieldId;
      });
  
      if (fv) {
        
        // Update the existing field value
        fv.value = event.detail.value;
      }
      else {
  
        // Store a new field value
        this.item.fieldValues.push(event.detail);
      }
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

        <customfields-group id="screenDisplayCustomFieldsGroup"
                            list-id="screenDisplayCustomFieldsList"
                            field-metadata-json={ JSON.stringify(this.fieldMetadata) }
                            field-values-json={ JSON.stringify(this.item.fieldValues) }
                            onCustomFieldValueChanged={ (ev) => this.handleCustomFieldValueChanged(ev) }>
        </customfields-group>

      </ion-content>,

      <ion-footer>
        <ion-buttons slot="end">
          <ion-button color="primary" onClick={ () => this.dismiss()}>Cancel</ion-button>
        </ion-buttons>
      </ion-footer>
    ];
  }
}