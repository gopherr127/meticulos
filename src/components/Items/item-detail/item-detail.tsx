import { Component, Element, Listen, Prop, State } from '@stencil/core';
import { ENV } from '../../../environments/environment';
import * as FormValidator from '../../../services/form-validation-service';
import { Item, ItemType, Screen, FieldMetadata, 
         FieldTypes, FieldValue, WorkflowTransition } from '../../../interfaces/interfaces';

@Component({
  tag: 'item-detail'
})
export class ItemDetail {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  @Prop({ connect: 'ion-modal-controller' }) modalCtrl: HTMLIonModalControllerElement;
  @Prop({ connect: 'ion-popover-controller' }) popoverCtrl: HTMLIonPopoverControllerElement;
  @Prop() itemId: string;
  @Prop() returnUrl = '/';
  @State() subtitle: string = 'Item Detail';
  @State() item: Item;
  @State() itemType: ItemType;
  @State() itemLocationName: string;
  @State() transitionOptions: Array<WorkflowTransition> = [];
  @State() transitionInProgress: WorkflowTransition;
  @State() editScreen: Screen;
  @State() fieldMetadata: Array<FieldMetadata> = [];
  private modalContext: string;
  private popoverContext: string;
  
  async componentWillLoad() {

    await this.loadItem();
    await this.loadTransitionOptions();
  }

  async componentDidLoad() {

    await this.loadEditScreen();
    await this.addFieldsFromMetadata();
  }

  popComponent() {

    const navCtrl = document.querySelector('ion-nav');
    navCtrl.pop();
  }

  setRootComponent() {

    const navCtrl = document.querySelector('ion-nav');
    navCtrl.setRoot('items-list', {
      itemTypeId: this.item.typeId
    });
  }

  async showErrorToast(messageToDisplay: string) {
    
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

  async loadItem() {

    let response = await fetch(
      this.apiBaseUrl + "/items/" + this.itemId, { 
        method: "GET"
    });

    
    if (response.ok) {
      
      try {

        this.item = await response.json();
        this.itemType = this.item.type;
        if (this.item.location) {
          this.itemLocationName = this.item.location.name;
        }
        this.subtitle = `${this.itemType.name} - ${this.item.name}`;

      } catch (error) {

        console.log(error);
        //TODO: Navigate to 404 component
      }
    }
  }

  async loadTransitionOptions() {
    let transitionsResponse = await fetch(
      this.apiBaseUrl + "/workflowtransitions/search?fromNodeId=" + this.item.workflowNode.id, {
        method: "GET"
    });

    this.transitionOptions = await transitionsResponse.json();
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

    let fieldsListEl = this.el.querySelector("#fieldsList");
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

  async handleTransitionClick(transition: WorkflowTransition) {

    if (transition.screenIds && transition.screenIds.length > 0) {
      
      await this.presentScreensDisplay(transition);
    }
    else {

      await this.completeTransition(transition);
      await this.loadItem();
      await this.loadTransitionOptions();
    }
  }

  async presentOptionsMenu(event?: any) {

    const popover = await this.popoverCtrl.create({
      component: 'item-detail-options-menu', 
      componentProps : {
        item : this.item,
        returnUrl: this.returnUrl
      },
      ev: event,
      translucent: false
    });

    await popover.present();
  }

  async presentScreensDisplay(transition: WorkflowTransition) {

    this.modalContext = "screen-display";
    this.transitionInProgress = transition;

    const modal = await this.modalCtrl.create({
      component: 'screen-display',
      componentProps: {
        item: this.item,
        transition: transition
      }
    });

    await modal.present();
  }

  async completeTransition(transition: WorkflowTransition) {

    let execResponse = await fetch(
      this.apiBaseUrl + "/workflowtransitions/executions/" + transition.id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        itemId: this.itemId,
        itemCategory: 0,
        itemData: this.item
      })
    });

    let transitionResult = await execResponse.json();
    
    if (transitionResult.errorMessages && transitionResult.errorMessages.length > 0) {

      await this.showErrorToast(transitionResult.errorMessages.join('\n'));
    }
  }

  async saveItem(): Promise<boolean> {
    
    return new Promise<boolean>(async resolve => {
      
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
    
          this.loadItem();
          resolve(true);
        }
        else
        {
          
          this.showErrorToast(await response.text());
        }
      }
      else {

        this.showErrorToast(validationResult.displayMessage);
      }

      resolve(false);
    });
  }

  async handleSaveClick() {

    let result = await this.saveItem();
    
    if (result) {

      const navCtrl = document.querySelector('ion-nav');
      navCtrl.setRoot('items-list', {
        itemTypeId: this.item.typeId
      });
    }
  }

  async handleLinkedItemsAddClick() {

    
  }

  async presentItemLocationOptions(event?: any) {

    this.modalContext = "item-location-options-menu";
    this.popoverContext = "item-location-options-menu";

    const popover = await this.popoverCtrl.create({
      component: 'item-location-options-menu',
      componentProps: {
        item: this.item
      },
      ev: event
    });

    await popover.present();
  }
  
  @Listen('body:ionModalDidDismiss')
  async modalDidDismiss(event: CustomEvent) {

    if (event && event.detail && event.detail.data) {

      switch (this.modalContext) {

        case "item-location-options-menu": {
          
          this.item.location = event.detail.data;
          this.item.locationId = this.item.location.id;
          this.itemLocationName = this.item.location.name;
          break;
        }
        case "screen-display": {

          if (event.detail.data) {
            
            let fieldValues = JSON.parse(event.detail.data);
            for (let fieldValue of fieldValues) {

              let existingFieldValue = this.item.fieldValues.find((item) => {
                return item.fieldId === fieldValue.fieldId;
              });

              if (existingFieldValue) {
                existingFieldValue.value = fieldValue.value;
              }
              else {
                this.item.fieldValues.push(fieldValue);
              }
            }

            let saveResult = await this.saveItem();
            
            if (saveResult) {

              await this.completeTransition(this.transitionInProgress);
              await this.loadItem();
              await this.loadTransitionOptions();
            }
          }
        }
      }
      this.modalContext = "";
    }
  }

  @Listen('body:ionPopoverDidDismiss')
  async popoverDidDismiss(event: any) {
    
    if (event && event.detail && event.detail.data) {

      switch (this.popoverContext) {

        case "item-location-options-menu": {

          if (!this.item.location) {
            // Initializae the entire asset location
            this.item.location = {
              id: "000000000000000000000000",
              name: "GPS Location",
              parentId: "000000000000000000000000",
              parent: null,
              gps: { latitude: -1, longitude: -1 }
            }
          }
          else {

            this.item.location.id = "000000000000000000000000";
            this.item.location.name = "GPS Location";
            this.item.parentId = "000000000000000000000000";
            this.item.location.parent = null;
            // Set gps location
            this.item.location.gps = {
              latitude: event.detail.data.latitude,
              longitude: event.detail.data.longitude
            }
          }
          
          this.item.locationId = this.item.location.id;
          this.itemLocationName = this.item.location.name;
        }
      }

      this.popoverContext = "";
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
        }
      }
    }
  }

  @Listen('ionFocus')
  async handleElementFocused(event: any) {

    if (event.target.id === "optionsMenu") {

      await this.presentOptionsMenu(event);
    }
    else if (event.target.id === "itemLocationOptionsMenu") {

      await this.presentItemLocationOptions(event);
    }
  }

  render() {
    return[
      <ion-header>

        <ion-action-sheet-controller></ion-action-sheet-controller>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
            <ion-back-button></ion-back-button>
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

      <ion-content class="outer-content">
          
        <ion-item></ion-item>
        <ion-item>
          <ion-label position='fixed'>Name</ion-label>
          <ion-input id="itemName" debounce={200} value={ this.item ? this.item.name : '' }></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position='fixed'>Item Type</ion-label>
          <ion-input disabled value={ this.itemType ? this.itemType.name : '' }></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position='fixed'>Status</ion-label>
          <ion-input disabled value={ this.item ? this.item.workflowNode.name : '' }></ion-input>
        </ion-item>
        <ion-item style={{ display : this.item && this.item.type && this.item.type.isForPhysicalItems ? 'block' : 'none'}}>
          <ion-label position='fixed'>Location</ion-label>
          <ion-input disabled value={ this.item ? this.itemLocationName : '' }></ion-input>
          <ion-button slot="end" fill="clear" id="itemLocationOptionsMenu">
            <ion-icon slot="icon-only" name="more" color="tertiary"></ion-icon>
          </ion-button>
        </ion-item>

        <ion-list>
          <ion-grid>
            <ion-row align-items-stretch>
              <ion-col col-lg-6 col-md-12 col-sm-12 col-12 align-self-stretch>

                <ion-card>
                  <ion-card-header>
                    Available Transitions
                  </ion-card-header>
                  <ion-card-content>
                    <ion-list>
                      {this.transitionOptions.map(transition => 
                        <ion-item button onClick={ () => this.handleTransitionClick(transition) }>
                          { transition.name }
                        </ion-item>
                      )}
                    </ion-list>
                  </ion-card-content>
                </ion-card>

                <ion-card>
                  <ion-card-header>
                    Fields
                  </ion-card-header>
                  <ion-card-content>
                    <ion-list id="fieldsList"></ion-list>
                  </ion-card-content>
                </ion-card>

              </ion-col>
              <ion-col col-lg-6 col-md-12 col-sm-12 col-12 align-self-stretch>
                
                <ion-card>
                  <ion-card-header no-padding>
                    <ion-item>
                      <ion-label>Linked Items</ion-label>
                      <ion-button slot="end" 
                                  onClick={ () => this.handleLinkedItemsAddClick() }>
                        Add
                      </ion-button>
                    </ion-item>
                  </ion-card-header>
                  <ion-card-content>
                    <ion-list id="linkedItemsList">
                    </ion-list>
                  </ion-card-content>
                </ion-card>

              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-list>

      </ion-content>,

      <ion-footer id="footerSection">
        <ion-buttons slot="end">
          <ion-button color="primary" fill="solid" onClick={ () => this.handleSaveClick() }>Save</ion-button>
          <ion-button color="primary" onClick={ () => this.popComponent() }>Cancel</ion-button>
        </ion-buttons>
      </ion-footer>
    ];
  }
}