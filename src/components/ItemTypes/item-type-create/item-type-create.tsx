import { Component, Element, State, Listen } from '@stencil/core';
import { ENV } from '../../../environments/environment';

@Component({
  tag: 'item-type-create'
})
export class ItemTypeCreate {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  fieldsList: HTMLIonListElement;
  @State() name: string;
  @State() pluralName: string;
  @State() isForPhysicalItems: boolean;
  @State() allowNestedItems: boolean;
  @State() iconUrl: string;
  @State() selectedWorkflowId: string;
  public iconOptions: Array<any> = [];
  public workflowOptions: Array<any> = [];
  
  async componentWillLoad() {
    
    await this.loadWorkflowOptions();
  }

  dismiss(data?: any) {
    
    (this.el.closest('ion-modal') as any).dismiss(data);
  }

  async loadWorkflowOptions() {

    let response = await fetch(
      this.apiBaseUrl + "/workflows", {
      method: "GET"
    });

    this.workflowOptions = await response.json();
  }

  handleIconOptionClick(iconUrl: string) {

    this.iconUrl = iconUrl;
  }

  async handleSaveClick() {

    let response = await fetch(
      this.apiBaseUrl + "/itemtypes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: this.name,
          pluralName: this.pluralName,
          workflowId: this.selectedWorkflowId,
          isForPhysicalItems: this.isForPhysicalItems,
          allowNestedItems: this.allowNestedItems,
          iconUrl: this.iconUrl
        })
    });

    if (response.ok) {
      
      this.dismiss();
    }
  }

  @Listen('ionChange')
  async handleFieldChanged(event: any) {
    
    if (event.target.id === "itemTypeName") {

      this.name = event.detail.value;

      let response = await fetch(
        this.apiBaseUrl + "/icons/search?term=" + this.name, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
      });

      this.iconOptions = await response.json();
    }
    else if (event.target.id === "pluralItemTypeName") {

      this.pluralName = event.detail.value;
    }
    else if (event.target.id === "workflowSelect") {

      this.selectedWorkflowId = event.detail.value;
    }
    else if (event.target.id === "isForPhysicalItems") {

      this.isForPhysicalItems = event.detail.checked;
    }
    else if (event.target.id === "allowNestedItems") {

      this.allowNestedItems = event.detail.checked;
    }
  }

  render() {
    return[
      <ion-header> 

        <ion-toolbar color="secondary">
          <ion-title>Create Item Type</ion-title>
        </ion-toolbar>

      </ion-header>,

      <ion-content>

          <ion-item></ion-item>
          <ion-item>
            <ion-label position='fixed'>Name</ion-label>
            <ion-input slot="end" id="itemTypeName" debounce={ 200 } value={ this.name }></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position='fixed'>Plural Name</ion-label>
            <ion-input slot="end" id="pluralItemTypeName" debounce={ 200 } value={ this.pluralName }></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position='fixed'>Workflow</ion-label>
            <ion-select id="workflowSelect" slot="end" value={ this.selectedWorkflowId }>
              { this.workflowOptions.map(workflow => 
                <ion-select-option value={ workflow.id }>
                  { workflow.name }
                </ion-select-option>)}
            </ion-select>
          </ion-item>
          <ion-item>
            <ion-label position='fixed'>Is For Physical Items</ion-label>
            <ion-checkbox id="isForPhysicalItems" slot="end" checked={ this.isForPhysicalItems }></ion-checkbox>
          </ion-item>
          <ion-item>
            <ion-label position='fixed'>Allow Nested Items</ion-label>
            <ion-checkbox id="allowNestedItems" slot="end" checked={ this.allowNestedItems }></ion-checkbox>
          </ion-item>
          <ion-item>
            <ion-label position='fixed'>Avatar</ion-label>
            <ion-avatar slot="end">
              { this.iconUrl 
                ? <img src={ this.iconUrl }/>
                : <div />}
            </ion-avatar>
          </ion-item>

          <ion-list>
            { this.iconOptions.map(icon => 
              <ion-item onClick={ () => this.handleIconOptionClick(icon.url) }>
                <ion-avatar><img src={ icon.url }/></ion-avatar>
              </ion-item>
            )}
          </ion-list>
          
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