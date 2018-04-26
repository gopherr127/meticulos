import { Component, Element, Prop, State, Listen } from '@stencil/core';
import { ENV } from '../../../environments/environment';
import { WorkflowNode } from '../../../interfaces/interfaces';

@Component({
  tag: 'workflow-transition-create'
})
export class WorkflowTransitionCreate {
  
  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  @Prop() workflowId: string;
  @State() name: string;
  public nodes: Array<WorkflowNode> = [];
  public fromNodeId: string;
  public toNodeId: string;
  
  async componentWillLoad() {

    await this.loadNodes();
  }

  async loadNodes() {

    let response = await fetch(
      this.apiBaseUrl + "/workflownodes/search?workflowId=" + this.workflowId, {
      method: "GET"
    });

    if (response.ok) {

      this.nodes = await response.json();
    }
  }

  dismiss(data?: any) {
    
    (this.el.closest('ion-modal') as any).dismiss(data);
  }

  async handleSaveClick() {

    let response = await fetch(
      this.apiBaseUrl + "/workflowtransitions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: this.name,
          workflowId: this.workflowId,
          fromNodeId: this.fromNodeId,
          toNodeId: this.toNodeId
        })
    });

    if (response.ok) {
      
      this.dismiss();
    }
  }

  @Listen('ionChange')
  handleSelectedNodeChanged(event: any) {
    
    if (event.target.id === "transitionName") {

      this.name = event.detail.value;
    }
    else if (event.target.id === "fromNodeSelect") {
      
      this.fromNodeId = event.detail.value;
    }
    else if (event.target.id === "toNodeSelect") {
      
      this.toNodeId = event.detail.value;
    }
  }

  render() {
    return[
      <ion-header> 

        <ion-toolbar color="secondary">
          <ion-title>Create Workflow Transition</ion-title>
        </ion-toolbar>

      </ion-header>,

      <ion-content>

        <ion-item></ion-item>
        <ion-item>
          <ion-label position='fixed'>Name</ion-label>
          <ion-input id="transitionName" debounce={ 200 } value={ this.name }></ion-input>
        </ion-item>
        <ion-item>
            <ion-label position='fixed'>From Node</ion-label>
            <ion-select id="fromNodeSelect">
              { this.nodes.map(node => 
                <ion-select-option value={ node.id }>
                  { node.name }
                </ion-select-option>)}
            </ion-select>
          </ion-item>
          <ion-item>
            <ion-label position='fixed'>To Node</ion-label>
            <ion-select id="toNodeSelect">
              { this.nodes.map(node => 
                <ion-select-option value={ node.id }>
                  { node.name }
                </ion-select-option>)}
            </ion-select>
          </ion-item>

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