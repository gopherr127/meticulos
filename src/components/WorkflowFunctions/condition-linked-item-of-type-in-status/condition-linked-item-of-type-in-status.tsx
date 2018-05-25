import { Component, Prop, Listen, Method } from '@stencil/core';
import { ENV } from '../../../environments/environment';
import { ItemType, WorkflowNode } from '../../../interfaces/interfaces';

@Component({
  tag: 'condition-linked-item-of-type-in-status'
})
export class ConditionLinkedItemTypeInState {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Prop() functionArgs: any;
  public itemTypes: Array<ItemType> = [];
  public workflowNodes: Array<WorkflowNode> = [];
  selectedItemTypeId: string;
  selectedWorkflowNodeId: string;

  async componentWillLoad() {

    await this.loadItemTypes();
    await this.loadWorkflowNodes();

    if (this.functionArgs) {
      let args = JSON.parse(this.functionArgs);
      this.selectedItemTypeId = args.selectedItemTypeId;
      this.selectedWorkflowNodeId = args.selectedWorkflowNodeId;
    }
  }

  async loadItemTypes() {

    let response = await fetch(
      `${this.apiBaseUrl}/itemtypes`, {
        method: 'GET'
    });

    if (response.ok) {
      this.itemTypes = await response.json();
    }
    else {
      console.log(response);
    }
  }

  async loadWorkflowNodes() {

    //TODO: Filter to nodes associated with selected item type
    let response = await fetch(
      `${this.apiBaseUrl}/workflownodes`, {
        method: 'GET'
    });

    if (response.ok) {
      this.workflowNodes = await response.json();
    }
    else {
      console.log(response);
    }
  }
  
  @Listen('ionChange')
  handleSelectedNodeChanged(event: any) {
    
    if (event.detail) {
      if (event.target.id === "itemTypeSelect") {
        this.selectedItemTypeId = event.detail.value;
      }
      else if (event.target.id === "workflowNodeSelect") {
        this.selectedWorkflowNodeId = event.detail.value;
      }
    }
  }

  @Method()
  getFunctionArgs() {

    return JSON.stringify({
      selectedItemTypeId: this.selectedItemTypeId,
      selectedWorkflowNodeId: this.selectedWorkflowNodeId
    });
  }

  render() {
    return (
      <ion-card>
        <ion-card-content>
          <ion-item>
            <ion-label position='fixed'>Item Type</ion-label>
            <ion-select id="itemTypeSelect" value={ this.selectedItemTypeId }>
              { this.itemTypes.map(itemType => 
                <ion-select-option value={itemType.id}>
                  {itemType.name}
                </ion-select-option>
              )}
            </ion-select>
          </ion-item>
          <ion-item>
            <ion-label position='fixed'>Item Status</ion-label>
            <ion-select id="workflowNodeSelect" value={ this.selectedWorkflowNodeId }>
              <ion-select-option value='000000000000000000000000'><i>Any</i></ion-select-option>
              { this.workflowNodes.map(node => 
                <ion-select-option value={node.id}>
                  {node.name}
                </ion-select-option>
              )}
            </ion-select>
          </ion-item>
        </ion-card-content>
      </ion-card>
    );
  }
}