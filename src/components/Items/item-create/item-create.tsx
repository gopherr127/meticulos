import { Component, Element, Event, EventEmitter, Listen, Prop, State } from '@stencil/core';
import { PopoverController } from '@ionic/core';
import { ENV } from '../../../environments/environment';
import * as FormValidator from '../../../services/form-validation-service';
import { ItemLocation, ItemType, Screen, FieldMetadata, FieldValue } from '../../../interfaces/interfaces';

@Component({
  tag: 'item-create'
})
export class ItemCreate {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  @Event() itemCreated: EventEmitter;
  @Prop({ connect: 'ion-router' }) nav;
  @Prop({ connect: 'ion-popover-controller' }) popoverCtrl: PopoverController;
  @Prop() itemTypeId: string;
  @Prop() parentId: string;
  @State() selectedParentId: string;
  @State() subtitle: string = 'Create Item';
  @State() itemType: ItemType;
  @State() createScreen: Screen;
  @State() name: string;
  @State() itemLocation: ItemLocation;
  @State() fieldMetadata: Array<FieldMetadata> = [];
  @State() fieldValues: Array<FieldValue> = []
  
  async componentWillLoad() {

    await this.loadItemType();
    await this.loadCreateScreen();

    if (this.itemType.allowNestedItems) {

      this.selectedParentId = this.parentId 
        ? this.parentId 
        : '000000000000000000000000';
    }
  }

  async loadItemType() {

    let response = await fetch(
      this.apiBaseUrl + "/itemtypes/" + this.itemTypeId, { 
        method: "GET"
    });

    if (response.ok) {

      this.itemType = await response.json();
      this.subtitle = `Create ${this.itemType.name}`;
    }
  }

  async loadCreateScreen() {

    let response = await fetch(
      this.apiBaseUrl + `/screens/${this.itemType.createScreenId}`, {
        method: "GET"
    });

    if (response.ok) {

      this.createScreen = await response.json();
      this.fieldMetadata = this.createScreen.fields;
    }
  }

  dismiss(data?: any) {
    
    if (data) {
      this.itemCreated.emit(data);
    }
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

  async handleSaveClick() {

    let validationResult = await FormValidator.validateForm(
      this.fieldMetadata, this.fieldValues);
    
    if (validationResult.result) {

      let newItem: any = {};
      newItem.name = this.name;
      newItem.typeId = this.itemTypeId;
      if (this.itemType.allowNestedItems) {
        newItem.parentId = this.selectedParentId; 
      }
      if (this.itemLocation) {
        newItem.location = this.itemLocation;
      }
      newItem.fieldValues = this.fieldValues;

      let response = await fetch(
        this.apiBaseUrl + "/items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newItem)
      });
  
      if (response.ok) {
  
        this.dismiss(newItem);
      }
      else
      {
       
        this.showToastMessage(await response.text());
      }
    }
    else {

      this.showToastMessage(validationResult.displayMessage);
    }
  }
  
  handleCustomFieldValueChanged(event: any) {

    if (event.detail) {

      // See if we've already stored a value for the field
      var fv = this.fieldValues.find((item) => {
        return item.fieldId === event.detail.fieldId;
      });
  
      if (fv) {

        // Update the existing field value
        fv.value = event.detail.value;
      }
      else {

        // Store a new field value
        this.fieldValues.push({
          fieldId: event.detail.fieldId,
          fieldName: event.detail.fieldName,
          value: event.detail.value
        });
      }
    }
  }

  async presentItemLocationOptions(event?: any) {

    const popover = await this.popoverCtrl.create({
      component: 'item-create-location-options-menu',
      ev: event
    });

    // Have to set z-index to avoid bug where popover displays behind modal
    popover.style.zIndex = '99999';

    await popover.present();
  }

  @Listen('body:itemLocationOptionsMenuDismissed')
  handleItemLocationOptionsMenuDismissed(event: CustomEvent) {

    if (event && event.detail && event.detail.data) {

      this.itemLocation = event.detail.data;
    }
  }

  @Listen('ionChange')
  handleFieldChange(event: any) {

    if (event.detail) {

      if (event.target.id === "itemName") {

        // Update Name field
        this.name = event.detail.value;
      }
    }
  }

  render() {
    return[
      <ion-header>

        <ion-action-sheet-controller></ion-action-sheet-controller>
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
          <ion-label>Name</ion-label>
          <ion-input id="itemName" debounce={200} value={ this.name }></ion-input>
        </ion-item>
        <ion-item>
          <ion-label>Item Type</ion-label>
          <ion-input disabled value={ this.itemType.name }></ion-input>
        </ion-item>
        <ion-item style={{ display : this.createScreen.displayLocation ? 'block' : 'none'}}>
          <ion-label>Location</ion-label>
          <ion-input disabled value={ this.itemLocation ? this.itemLocation.name : '' }></ion-input>
          <ion-button slot="end" fill="clear" id="itemCreateLocationOptionsMenu" 
                      onClick={ (ev) => this.presentItemLocationOptions(ev) }>
            <ion-icon slot="icon-only" name="more" color="tertiary"></ion-icon>
          </ion-button>
        </ion-item>

        <customfields-group list-id="itemCreateCustomFieldsList"
                            populate-default-values={true}
                            field-metadata-json={ JSON.stringify(this.fieldMetadata) }
                            field-values-json={ JSON.stringify(this.fieldValues) }
                            onCustomFieldValueChanged={ (ev) => this.handleCustomFieldValueChanged(ev) }>
        </customfields-group>
        
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