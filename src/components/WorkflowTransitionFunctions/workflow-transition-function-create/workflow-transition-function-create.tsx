import { Component, Element, Prop, State, Listen } from '@stencil/core';
import { ENV } from '../../../environments/environment';

@Component({
  tag: 'workflow-transition-function-create'
})
export class WorkflowTransitionFunctionCreate {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  @Prop() transitionId: string;
  @Prop() functionTypeId: number;
  public functionOptions: Array<any> = [];
  @State() selectedFunctionId: string;
  
  async componentWillLoad() {

    await this.loadFunctionOptions();
  }

  async loadFunctionOptions() {

    let response = await fetch(
      this.apiBaseUrl + "/workflowfunctions/search?type=" + this.functionTypeId, {
      method: "GET"
    });

    this.functionOptions = await response.json();
  }

  dismiss(data?: any) {
    
    (this.el.closest('ion-modal') as any).dismiss(data);
  }

  async handleSaveClick() {

    // Get the dynamically added component
    const functionArgsElement: any = document.getElementById("functionArgsContainer").children[0]

    // Get the JSON representation of the function args
    let functionArgs = functionArgsElement.getFunctionArgs();

    //TODO: Do limited validation client-side; let server validate settings for the selected function
    // ...

    let response = await fetch(
      this.apiBaseUrl + "/workflowtransitionfunctions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "functionId": this.selectedFunctionId,
          "transitionId": this.transitionId,
          "functionArgs": functionArgs
        })
    });

    if (response.ok) {
      
      this.dismiss();
    }
  }
  
  @Listen('ionChange')
  handleItemTypeChanged(event: any) {
    
    if (event.target.id === "functionSelect") {
      
      this.selectedFunctionId = event.detail.value;
      const functionArgsElement = document.getElementById("functionArgsContainer");

      switch (this.selectedFunctionId) {
        case "5aa805dd0af6814a103b25ad": { 
          functionArgsElement.innerHTML = `<condition-user-in-role/>`; 
          break; 
        }
        case "5aa805dd0af6814a103b25ae": { 
          functionArgsElement.innerHTML = `<condition-user-in-group/>`; 
          break; 
        }
        case "5b061754fc312607140abb54": {
          functionArgsElement.innerHTML = `<condition-linked-item-of-type-in-status/>`;
          break;
        }
        case "5aa805de0af6814a103b25b0": {
          functionArgsElement.innerHTML = `<validation-field-required/>`;
          break;
        }
        case "5aa805e00af6814a103b25b5": {
          functionArgsElement.innerHTML = `<function-make-api-call/>`;
          break;
        }
        case "5aa805df0af6814a103b25b2": {
          functionArgsElement.innerHTML = `<function-set-field-value/>`;
          break;
        }
        case "5aa805e00af6814a103b25b3": {
          functionArgsElement.innerHTML = `<function-send-email/>`;
          break;
        }
        default: {
          functionArgsElement.innerHTML = null;
          break;
        }
      }
    }
  }

  render() {
    return[
      <ion-header> 

        <ion-toolbar color="secondary">
          <ion-title>Create Transition Function</ion-title>
        </ion-toolbar>

      </ion-header>,

      <ion-content>

        <ion-item></ion-item>
          <ion-item>
            <ion-label position='fixed'>Function</ion-label>
            <ion-select id="functionSelect" value={ this.selectedFunctionId }>
              { this.functionOptions.map(functn => 
                <ion-select-option value={ functn.id }>
                  { functn.name }
                </ion-select-option>)}
            </ion-select>
          </ion-item>

          <ion-item style={{ display: this.selectedFunctionId ? 'block' : 'none' }}>
            <ion-label position='fixed'>Settings</ion-label>
          </ion-item>

          <div id="functionArgsContainer"></div>

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