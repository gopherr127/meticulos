import { Component, Element, Listen, Prop, State } from '@stencil/core';
import { PopoverController } from '@ionic/core';
import { ENV } from '../../../environments/environment';
import * as FormValidator from '../../../services/form-validation-service';
import { Item, ItemType, Screen, FieldChangeGroup, FieldMetadata, WorkflowTransition } from '../../../interfaces/interfaces';

@Component({
  tag: 'item-detail'
})
export class ItemDetail {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  childItemsList: HTMLIonListElement;
  @Prop({ connect: 'ion-modal-controller' }) modalCtrl: HTMLIonModalControllerElement;
  @Prop({ connect: 'ion-popover-controller' }) popoverCtrl: PopoverController;
  @Prop() itemId: string;
  @State() subtitle: string = 'Item Detail';
  @State() item: Item;
  @State() itemType: ItemType;
  @State() itemLocationName: string;
  @State() transitionOptions: Array<WorkflowTransition> = [];
  @State() transitionInProgress: WorkflowTransition;
  @State() editScreen: Screen;
  @State() fieldMetadata: Array<FieldMetadata> = [];
  @State() fieldChangeGroups: Array<FieldChangeGroup> = [];
  @State() linkedItems: Array<Item> = [];
  @State() childItems: Array<Item> = [];
  private modalContext: string;
  private popoverContext: string;
  
  async componentWillLoad() {

    await this.loadItem();
    await this.loadEditScreen();
    await this.loadChildItems();
  }

  async componentDidLoad() {

    this.childItemsList = this.el.querySelector('#childItemsList');
  }

  pushComponent(component, componentProps?) {

    const navCtrl = document.querySelector('ion-nav');
    navCtrl.push(component, componentProps);
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
      `${this.apiBaseUrl}/items/${this.itemId}?expand=linkeditems,transitions`, { 
        method: "GET"
    });
    
    if (response.ok) {
      
      try {

        this.item = await response.json();
        this.itemType = this.item.type;

        this.transitionOptions = (this.item.transitions)
          ? this.item.transitions
          : [];
        
        this.linkedItems = (this.item.linkedItems)
          ? this.item.linkedItems
          : [];

        if (this.item.location) {
          this.itemLocationName = this.item.location.name;
        }

        this.subtitle = `${this.itemType.name} - ${this.item.name}`;

      } catch (error) {

        console.log(error);
        //TODO: Navigate to 404 page/component
      }
    }
  }

  @Listen('body:itemCreated')
  async loadChildItems() {

    let response = await fetch(
      `${this.apiBaseUrl}/items/search?parentId=${this.itemId}`, {
        method: 'GET'
    });

    if (response.ok) {

      this.childItems = await response.json();
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

  async loadChangeHistory() {

    let response = await fetch(
      this.apiBaseUrl + "/fieldchangegroups/search?itemId=" + this.item.id, {
        method: "GET"
    });

    if (response.ok) {

      this.fieldChangeGroups = await response.json();
    }
  }

  async handleTransitionClick(transition: WorkflowTransition) {

    if (transition.screenIds && transition.screenIds.length > 0) {
      
      await this.presentScreensDisplay(transition);
    }
    else {

      await this.completeTransition(transition);
      await this.loadItem();
    }
  }

  async presentOptionsMenu(event?: any) {

    const popover = await this.popoverCtrl.create({
      component: 'item-detail-options-menu', 
      componentProps : {
        item : this.item
      },
      ev: event
    });

    popover.present();
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

    //INFO: there is a bug in Stencil where events are getting fired multiple times.
    // Steps:
    // Put console.log(...) message in handleScreenDisplayDismissed
    // Go to the main list for an item type.
    // Open the detail form for an item.
    // Execute a transition that displays screens.
    // Click Cancel.
    // Repeat the previous steps, noticing how each time one more event is handled
    if (!transition) {
      return; 
    }

    let execResponse = await fetch(
      `${this.apiBaseUrl}/workflowtransitions/executions/${transition.id}`, {
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

    if (execResponse.ok) {

      let transitionResult = await execResponse.json();
      
      if (transitionResult.errorMessages && transitionResult.errorMessages.length > 0) {
  
        await this.showErrorToast(transitionResult.errorMessages.join('\n'));
      }
    }
    else {
      this.showErrorToast(await execResponse.text());
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
      
      await this.loadItem();
    }
  }

  async handleLinkedItemClicked(event: any) {

    this.pushComponent('item-detail', {
      itemId: event.detail.id
    });
  }

  async handleLinkedItemAdded(event: any) {

    if (event.detail) {

      if (!this.item.linkedItemIds) {
        this.item.linkedItemIds = [];
      }

      this.item.linkedItemIds = [...this.item.linkedItemIds, event.detail.id];

      await this.handleSaveClick();
    }
  }

  async handleLinkedItemRemoved(event: any) {

    if (event.detail) {

      this.item.linkedItemIds = this.item.linkedItemIds.filter((id) => {
        return id != event.detail.id;
      })
  
      await this.handleSaveClick();
    }
  }

  async handleChildItemClick(childItem: Item) {

    this.pushComponent('item-detail', {
      itemId: childItem.id
    });
  }

  async handleChildItemsAddClick() {

    //TODO: Guard against cyclical relationships
    //TODO: Warn if selected item already has a parent item.
    //TODO: Update ParentID of selected item to this item.
  }

  async handleChildItemsCreateClick() {

    //TODO: Consider a configuration where child item types
    // may be different from the parent item (i.e., pre-
    // defined hierarchy)
    const modal = await this.modalCtrl.create({
      component: 'item-create',
      componentProps: {
        itemTypeId: this.itemType.id,
        parentId: this.item.id
      }
    });

    await modal.present();

  }

  async handleChildItemsClick() {

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

    popover.present();
  }

  @Listen('body:screenDisplayDismissed') 
  async handleScreenDisplayDismissed(event: any) {

    if (event.detail) {

      let fieldValues = JSON.parse(event.detail);
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
      }
    }
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
        this.item.fieldValues.push({
          fieldId: event.detail.fieldId,
          fieldName: event.detail.fieldName,
          value: event.detail.value
        });
      }
    }
  }

  @Listen('ionChange')
  handleFieldChange(event: any) {

    if (event.detail) {

      if (event.target.id === "itemName") {

        // Update Name field
        this.item.name = event.detail.value;
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

                <customfields-group list-id="itemDetailCustomFieldsList"
                                    field-metadata-json={ JSON.stringify(this.fieldMetadata) }
                                    field-values-json={ JSON.stringify(this.item.fieldValues) }
                                    onCustomFieldValueChanged={ (ev) => this.handleCustomFieldValueChanged(ev) }>
                </customfields-group>
                
              </ion-col>
              <ion-col col-lg-6 col-md-12 col-sm-12 col-12 align-self-stretch>
                
                <linkeditems-field linked-items-json={ JSON.stringify(this.linkedItems) }
                                   onLinkedItemClicked={ (ev) => this.handleLinkedItemClicked(ev) }
                                   onLinkedItemAdded={ (ev) => this.handleLinkedItemAdded(ev) }
                                   onLinkedItemRemoved={ (ev) => this.handleLinkedItemRemoved(ev) }>
                </linkeditems-field>
                
                {this.item.type.allowNestedItems
                ? <ion-card>
                    <ion-card-header no-padding>
                      <ion-item>
                        <ion-label>
                          Child Items
                        </ion-label>
                        <ion-button slot="end" color="secondary"
                                    onClick={ () => this.handleChildItemsAddClick() }>
                          Add
                        </ion-button>
                        <ion-button slot="end" color="secondary"
                                    onClick={ () => this.handleChildItemsCreateClick() }>
                          Create
                        </ion-button>
                      </ion-item>
                    </ion-card-header>
                    <ion-card-content>
                      <ion-list id="childItemsList">
                      {this.childItems.map(childItem => 
                        <ion-item-sliding>
                          <ion-item onClick={ () => this.handleChildItemClick(childItem) }>
                            <ion-avatar slot="start">
                              <img src={childItem.type.iconUrl}/>
                            </ion-avatar>
                            { childItem.location 
                            ? <ion-label>
                                <h2>{childItem.name}</h2>
                                <p>{childItem.workflowNode.name} - {childItem.location.name}</p>
                              </ion-label>
                            : <ion-label>
                                <h2>{childItem.name}</h2>
                                <p>{childItem.workflowNode.name}</p>
                              </ion-label>
                            }
                          </ion-item>
                        </ion-item-sliding>
                      )}
                      </ion-list>
                    </ion-card-content>
                  </ion-card>
                : <span></span>}

                <ion-card>
                  <ion-card-header no-padding>
                    <ion-item>
                      <ion-label>
                        Change History
                      </ion-label>
                      <ion-button slot="end" fill="clear"
                                  onClick={() => this.loadChangeHistory() }>
                        <ion-icon slot="icon-only" name="refresh" color="tertiary"></ion-icon>
                      </ion-button>
                    </ion-item>
                  </ion-card-header>
                  <ion-card-content>
                    <ion-list id="changeGroupsList">
                      { this.fieldChangeGroups.map(fieldChangeGroup => 
                        <ion-item-group>
                          <ion-item-divider color="light">
                            { new Date(fieldChangeGroup.changedDateTime).toLocaleString() }
                          </ion-item-divider>
                          { fieldChangeGroup.fieldChanges.map(fieldChange => 
                            <ion-item>
                              <ion-label>
                                <h2>{ fieldChange.fieldName }</h2>
                                <h4>{ fieldChange.oldValue } => { fieldChange.newValue }</h4>
                              </ion-label>
                            </ion-item>
                          )}
                        </ion-item-group>
                      )}
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