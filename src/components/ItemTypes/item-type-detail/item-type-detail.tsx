import { Component, Element, Listen, Prop, State } from '@stencil/core';
import { ENV } from '../../../environments/environment';
import { Icon, ItemType, Screen, Workflow } from '../../../interfaces/interfaces';

@Component({
  tag: 'item-type-detail'
})
export class ItemTypeDetail {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  @Prop({ connect: 'ion-router' }) nav;
  @Prop({ connect: 'ion-modal-controller' }) modalCtrl: HTMLIonModalControllerElement;
  @Prop() itemTypeId: string;
  @Prop() returnUrl = '/item-types';
  @State() subtitle: string = 'Item Type: ';
  @State() itemType: ItemType;
  @State() selectedCreateScreen: Screen;
  @State() selectedEditScreen: Screen;
  @State() selectedViewScreen: Screen;
  public iconOptions: Array<Icon> = [];
  public workflowOptions: Array<Workflow> = [];
  public modalInitByElementId: string;
  
  async componentWillLoad() {
    
    await this.loadItemType();
    await this.loadWorkflowOptions();
    await this.loadSelectedScreens();
  }

  async navigate(url: string) {

    const navCtrl: HTMLIonRouterElement = await (this.nav as any).componentOnReady();
    navCtrl.push(url);
  }

  @Listen('body:ionModalDidDismiss')
  async loadItemType() {
    
    let response = await fetch(
      this.apiBaseUrl + "/itemtypes/" + this.itemTypeId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
    });

    this.itemType = await response.json();
  }

  async loadWorkflowOptions() {

    let response = await fetch(
      this.apiBaseUrl + "/workflows", {
      method: "GET"
    });

    this.workflowOptions = await response.json();
  }

  async loadSelectedScreens() {

    let screenIds: Array<string> = [];
    if (this.itemType.createScreenId) {
      screenIds.push(this.itemType.createScreenId);
    }
    if (this.itemType.editScreenId) {
      screenIds.push(this.itemType.editScreenId);
    }
    if (this.itemType.viewScreenId) {
      screenIds.push(this.itemType.viewScreenId);
    }

    if (screenIds && screenIds.length > 0) {
      let response = await fetch(
        this.apiBaseUrl + "/screens/find", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(screenIds)
      });

      if (response.ok) {

        let screens = await response.json();

        if (screens && screens.length > 0) {
          if (this.itemType.createScreenId) {
            let createScreenId = this.itemType.createScreenId;
            this.selectedCreateScreen = screens.find((item) => { 
              return item.id === createScreenId });
          }
          if (this.itemType.editScreenId) {
            let editScreenId = this.itemType.editScreenId;
            this.selectedEditScreen = screens.find((item) => {
              return item.id === editScreenId });
          }
          if (this.itemType.viewScreenId) {
            let viewScreenId = this.itemType.viewScreenId;
            this.selectedViewScreen = screens.find((item) => {
              return item.id === viewScreenId });
          }
        }
      }
    }
  }

  handleIconOptionClick(iconUrl: string) {

    this.itemType.iconUrl = iconUrl;
  }

  async presentScreenSearch(elementId: string) {

    this.modalInitByElementId = elementId;
    const modal = await this.modalCtrl.create({
      component: 'screen-search'
    });
    await modal.present();
  }
  
  @Listen('body:ionModalDidDismiss')
  async modalDidDismiss(event: CustomEvent) {
    if (event) {

      switch (this.modalInitByElementId) {
        case "createScreen": {
          this.selectedCreateScreen = event.detail.data;
          this.itemType.createScreenId = this.selectedCreateScreen.id;
          break;
        }
        case "editScreen": {
          this.selectedEditScreen = event.detail.data;
          this.itemType.editScreenId = this.selectedEditScreen.id;
          break;
        }
        case "viewScreen": {
          this.selectedViewScreen = event.detail.data;
          this.itemType.viewScreenId = this.selectedViewScreen.id;
          break;
        }
        default: {
          break;
        }
      }

      this.modalInitByElementId = "";
    }
  }

  async handleSaveClick() {

    let response = await fetch(
      this.apiBaseUrl + "/itemtypes/" + this.itemTypeId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.itemType)
    });

    if (response.ok) {
      
      this.navigate(this.returnUrl);
    }
  }

  @Listen('ionChange')
  async handleFieldChanged(event: any) {
    
    if (event.target.id === "itemTypeName") {

      this.itemType.name = event.detail.value;

      let response = await fetch(
        this.apiBaseUrl + "/icons/search?term=" + this.itemType.name, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
      });

      this.iconOptions = await response.json();
    }
    else if (event.target.id === "workflowSelect") {
      this.itemType.workflowId = event.detail.value;
    }
    else if (event.target.id === "isForPlanItems") {
      this.itemType.isForPlanItems = event.detail.checked;
    }
    else if (event.target.id === "isForAssets") {
      this.itemType.isForAssets = event.detail.checked;
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
            <ion-input id="itemTypeName" slot="end" debounce={200} value={ this.itemType.name }></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position='fixed'>Workflow</ion-label>
            <ion-select id="workflowSelect" slot="end" value={ this.itemType.workflowId }>
              { this.workflowOptions.map(workflow => 
                <ion-select-option value={ workflow.id }>
                  { workflow.name }
                </ion-select-option>)}
            </ion-select>
          </ion-item>
          <ion-item button onClick={ () => this.presentScreenSearch("createScreen") }>
            <ion-label position='fixed'>Create Screen</ion-label>
            <ion-input disabled value={ this.selectedCreateScreen ? this.selectedCreateScreen.name : "" }></ion-input>
            <ion-icon slot="end" name="more" color="tertiary"></ion-icon>
          </ion-item>
          <ion-item button onClick={ () => this.presentScreenSearch("editScreen") }>
            <ion-label position='fixed'>Edit Screen</ion-label>
            <ion-input disabled value={ this.selectedEditScreen ? this.selectedEditScreen.name : "" }></ion-input>
            <ion-icon slot="end" name="more" color="tertiary"></ion-icon>
          </ion-item>
          <ion-item button onClick={ () => this.presentScreenSearch("viewScreen") }>
            <ion-label position='fixed'>View Screen</ion-label>
            <ion-input disabled value={ this.selectedViewScreen ? this.selectedViewScreen.name : "" }></ion-input>
            <ion-icon slot="end" name="more" color="tertiary"></ion-icon>
          </ion-item>
          <ion-item>
            <ion-label position='fixed'>Is For Physical Items</ion-label>
            <ion-checkbox id="isForPlanItems" slot="end" checked={ this.itemType.isForPlanItems }></ion-checkbox>
          </ion-item>
          <ion-item>
            <ion-label position='fixed'>Allow Nested Items</ion-label>
            <ion-checkbox id="isForAssets" slot="end" checked={ this.itemType.isForAssets }></ion-checkbox>
          </ion-item>
          <ion-item>
            <ion-label position='fixed'>Avatar</ion-label>
            <ion-avatar slot="end">
              { this.itemType.iconUrl 
                ? <img src={ this.itemType.iconUrl }/>
                : <div />}
            </ion-avatar>
          </ion-item>

          <ion-list>
            { this.iconOptions.map(icon => 
              <ion-item onClick={ this.handleIconOptionClick.bind(this, `${icon.url}`) }>
                <ion-avatar><img src={ icon.url }/></ion-avatar>
              </ion-item>
            )}
          </ion-list>
          
      </ion-content>,

      <ion-footer>
        <ion-buttons slot="end">
          <ion-button color="primary" fill="solid" onClick={ () => this.handleSaveClick() }>Save</ion-button>
          <ion-button color="primary" onClick={ () => this.navigate('/item-types')}>Cancel</ion-button>
        </ion-buttons>
      </ion-footer>
    ];
  }
}