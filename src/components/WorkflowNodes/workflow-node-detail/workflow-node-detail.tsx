import { Component, Element, Listen, Prop, State } from '@stencil/core';
import { ENV } from '../../../environments/environment';
import { WorkflowNode } from '../../../interfaces/interfaces';

@Component({
  tag: 'workflow-node-detail'
})
export class WorkflowNodeDetail {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  @Prop() workflowNodeId: string;
  @Prop() returnUrl = '/workflows/';
  @State() subtitle: string = 'Node: ';
  @State() workflowNode: WorkflowNode;
  
  async componentWillLoad() {

    await this.loadWorkflowNode();
  }

  popComponent() {

    const navCtrl = document.querySelector('ion-nav');
    navCtrl.pop();
  }

  async loadWorkflowNode() {

    let response = await fetch(
      this.apiBaseUrl + "/workflownodes/" + this.workflowNodeId, {
      method: "GET"
    });

    if (response.ok) {

      this.workflowNode = await response.json();
      
      this.subtitle = `Node: ${this.workflowNode.name}`;
    }
  }

  async handleSaveClick() {

    let response = await fetch(
      this.apiBaseUrl + `/workflownodes/${this.workflowNodeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.workflowNode)
    });

    if (response.ok) {
      
      this.popComponent();
    }
  }

  @Listen('ionInput')
  handleNameChanged(event: any) {

    if (event.target.id === "nodeName") {
      this.workflowNode.name = event.detail.target.value;
    }
    else if (event.target.id === "color") {
      this.workflowNode.color = event.detail.target.value;
    }
  }

  render() {
    return[
      <ion-header> 

        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
            <ion-back-button defaultHref={ this.returnUrl + this.workflowNodeId }></ion-back-button>
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

      <ion-content>

        <ion-item></ion-item>
        <ion-item>
          <ion-label position='fixed'>Name</ion-label>
          <ion-input id="nodeName" debounce={ 200 } value={ this.workflowNode.name }></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position='fixed'>Color</ion-label>
          <ion-input id="color" debounce={ 200 } value={ this.workflowNode.color }></ion-input>
        </ion-item>

      </ion-content>,

      <ion-footer id="footerSection">
        <ion-buttons slot="end">
          <ion-button color="primary" fill="solid" onClick={ () => this.handleSaveClick() }>Save</ion-button>
          <ion-button color="primary" onClick={ () => this.popComponent()}>Cancel</ion-button>
        </ion-buttons>
      </ion-footer>
    ];
  }
}