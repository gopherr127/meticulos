import { Component, Element, Prop, State, Listen } from '@stencil/core';
import { ENV } from '../../../environments/environment';

@Component({
  tag: 'workflow-node-create'
})
export class WorkflowNodeCreate {
  
  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  @Prop() workflowId: string;
  @State() name: string;
  
  dismiss(data?: any) {
    
    (this.el.closest('ion-modal') as any).dismiss(data);
  }

  async handleSaveClick() {

    let response = await fetch(
      this.apiBaseUrl + "/workflownodes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          workflowId: this.workflowId,
          name: this.name
        })
    });

    if (response.ok) {
      
      this.dismiss();
    }
  }

  @Listen('ionInput')
  handleNameChanged(event: CustomEvent) {

    this.name = event.detail.target.value;
  }

  render() {
    return[
      <ion-header> 

        <ion-toolbar color="secondary">
          <ion-title>Create Workflow Node</ion-title>
        </ion-toolbar>

      </ion-header>,

      <ion-content>

        <ion-item></ion-item>
        <ion-item>
          <ion-label position='fixed'>Name</ion-label>
          <ion-input id="nodeName" debounce={ 200 } value={ this.name }></ion-input>
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