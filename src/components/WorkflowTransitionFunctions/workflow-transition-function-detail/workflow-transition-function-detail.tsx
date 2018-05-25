import { Component, Element, Prop } from '@stencil/core';
import { ENV } from '../../../environments/environment';

@Component({
  tag: 'workflow-transition-function-detail'
})
export class WorkflowTransitionFunctionDetail {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  @Prop() workflowTransitionFunctionId: string;
  @Prop() returnUrl = '/workflows/';
  public transitionFunction: any;
  public workflowTransitionId: string;
  
  async componentWillLoad() {

    await this.loadFunction();
  }

  async componentDidLoad() {
    
    await this.loadFunctionSettings();
  }

  dismiss(data?: any) {
    
    (this.el.closest('ion-modal') as any).dismiss(data);
  }

  async loadFunction() {

    let response = await fetch(
      this.apiBaseUrl + "/workflowtransitionfunctions/" + this.workflowTransitionFunctionId, {
      method: "GET"
    });

    if (response.ok) {

      this.transitionFunction = await response.json();
      this.workflowTransitionId = this.transitionFunction.transitionId;
    }
  }

  async loadFunctionSettings() {

    const functionArgsElement = document.getElementById("functionArgsContainer");

      switch (this.transitionFunction.function.id) {
        case "5aa805dd0af6814a103b25ad": { 
          functionArgsElement.innerHTML = `<condition-user-in-role 
            function-args=${this.transitionFunction.functionArgs}></condition-user-in-role>`; 
          break; 
        }
        case "5aa805dd0af6814a103b25ae": { 
          functionArgsElement.innerHTML = `<condition-user-in-group
            function-args=${this.transitionFunction.functionArgs}></condition-user-in-group>`;
          break; 
        }
        case "5b061754fc312607140abb54": {
          functionArgsElement.innerHTML = `<condition-linked-item-of-type-in-status
            function-args=${this.transitionFunction.functionArgs}></condition-linked-item-of-type-in-status>`;
          break;
        }
        case "5aa805de0af6814a103b25b0": {
          functionArgsElement.innerHTML = `<validation-field-required
            function-args=${this.transitionFunction.functionArgs}></validation-field-required>`;
          break;
        }
        case "5aa805e00af6814a103b25b5": {
          functionArgsElement.innerHTML = `<function-make-api-call
          function-args=${this.transitionFunction.functionArgs}></function-make-api-call>`;
          break;
        }
        case "5aa805df0af6814a103b25b2": {
          functionArgsElement.innerHTML = `<function-set-field-value
          function-args=${this.transitionFunction.functionArgs}></function-set-field-value>`;
          break;
        }
        case "5aa805e00af6814a103b25b3": {
          functionArgsElement.innerHTML = `<function-send-email
          function-args=${this.transitionFunction.functionArgs}></function-send-email>`;
          break;
        }
        default: {
          functionArgsElement.innerHTML = null;
          break;
        }
      }
  }

  async handleSaveClick() {

    // Get the dynamically added component
    const functionArgsElement: any = document.getElementById("functionArgsContainer").children[0]

    // Get the JSON representation of the function args
    let functionArgs = functionArgsElement.getFunctionArgs();

    //TODO: Do limited validation client-side; let server validate settings for the selected function
    // ...

    let response = await fetch(
      this.apiBaseUrl + "/workflowtransitionfunctions/" + this.workflowTransitionFunctionId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "functionId": this.transitionFunction.function.id,
          "transitionId": this.transitionFunction.transitionId,
          "functionArgs": functionArgs
        })
    });

    if (response.ok) {

      this.dismiss();
    }
  }
  
  render() {
    return[
      <ion-header>

        <ion-toolbar color="secondary">
          <ion-title>Transition Function Details</ion-title>
        </ion-toolbar>

        <ion-toolbar id="headerSection" color="tertiary">
            <ion-button slot="start" color="primary" fill="solid" 
                        onClick={ () => this.handleSaveClick() }>Save</ion-button>
        </ion-toolbar>

      </ion-header>,

      <ion-content>

        <ion-item></ion-item>
          <ion-item>
            <ion-label position='fixed'>Function</ion-label>
            <ion-input disabled value={ this.transitionFunction.function.name }></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position='fixed'>Settings</ion-label>
          </ion-item>

          <div id="functionArgsContainer"></div>

      </ion-content>,

      <ion-footer id="footerSection">
        <ion-buttons slot="end">
          <ion-button color="primary" fill="solid" onClick={ () => this.handleSaveClick() }>Save</ion-button>
          <ion-button color="primary" onClick={ () => this.dismiss() }>Cancel</ion-button>
        </ion-buttons>
      </ion-footer>
    ];
  }
}