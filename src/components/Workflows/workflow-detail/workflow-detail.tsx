import { Component, Element, Listen, Prop, State } from '@stencil/core';
import { ENV } from '../../../environments/environment';
import { Workflow, WorkflowNode, WorkflowTransition } from '../../../interfaces/interfaces';

@Component({
  tag: 'workflow-detail'
})
export class WorkflowDetail {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  workflowsList: HTMLIonListElement;
  workflowNodesList: HTMLIonListElement;
  workflowTransitionsList: HTMLIonListElement;
  @Prop({ connect: 'ion-router' }) nav;
  @Prop({ connect: 'ion-modal-controller' }) modalCtrl: HTMLIonModalControllerElement;
  @Prop() workflowId: string;
  @Prop() returnUrl = '/workflows';
  @State() subtitle: string = 'Workflow: ';
  @State() workflow: Workflow;
  @State() workflowNodes: Array<WorkflowNode> = []
  @State() workflowTransitions: Array<WorkflowTransition> = [];
  
  async componentWillLoad() {

    await this.loadWorkflow();
  }

  componentDidLoad() {

    this.workflowsList = this.el.querySelector('#workflowsList');
    this.workflowNodesList = this.el.querySelector('#workflowNodesList');
    this.workflowTransitionsList = this.el.querySelector('#workflowTransitionsList');
  }

  async navigate(url: string) {

    const navCtrl: HTMLIonRouterElement = await (this.nav as any).componentOnReady();
    navCtrl.push(url);
  }

  @Listen('body:ionModalDidDismiss')
  async loadWorkflow() {
    
    let response = await fetch(
      this.apiBaseUrl + "/workflows/" + this.workflowId, {
      method: "GET"
    });

    if (response.ok) {
      this.workflow = await response.json();
      this.subtitle = 'Workflow: ' + this.workflow.name;
      await this.loadWorkflowNodes();
      await this.loadWorkflowTransitions();
    }
  }

  async loadWorkflowNodes() {

    let response = await fetch(
      this.apiBaseUrl + "/workflownodes/search?workflowId=" + this.workflowId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
    });

    this.workflowNodes = await response.json();
  }

  async loadWorkflowTransitions() {

    let response = await fetch(
      this.apiBaseUrl + "/workflowtransitions/search?workflowId=" + this.workflowId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
    });

    this.workflowTransitions = await response.json();
  }

  async handleNodeAddClick() {
    
    const modal = await this.modalCtrl.create({
      component: 'workflow-node-create',
      componentProps: {
        workflowId: this.workflowId
      }
    });
    
    await modal.present();
  }

  async handleNodeDeleteClick(node: WorkflowNode) {

    let response = await fetch(
      this.apiBaseUrl + "/workflownodes/" + node.id, {
        method: "DELETE"
    });

    if (response.ok) {

      await this.loadWorkflowNodes();
      this.workflowNodesList.closeSlidingItems();
    }
  }

  async handleTransitionAddClick() {
    
    const modal = await this.modalCtrl.create({
      component: 'workflow-transition-create',
      componentProps: {
        workflowId: this.workflowId
      }
    });
    
    await modal.present();
  }

  async handleTransitionDeleteClick(transition: WorkflowTransition) {

    let response = await fetch(
      this.apiBaseUrl + "/workflowtransitions/" + transition.id, {
        method: "DELETE"
    });

    if (response.ok) {

      await this.loadWorkflowTransitions();
      this.workflowTransitionsList.closeSlidingItems();
    }
  }

  @Listen('ionChange')
  handleFieldChanged(event: any) {
    
    if (event.target.id === "workflowName") {

      this.workflow.name = event.detail.value;
    }
  }
  
  async handleSaveClick() {

    let response = await fetch(
      this.apiBaseUrl + "/workflows/" + this.workflowId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "name": this.workflow.name
        })
    });

    if (response.ok) {
      
      this.navigate(this.returnUrl);
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
            <ion-input id="workflowName" debounce={ 200 } value={ this.workflow.name }></ion-input>
          </ion-item>

          <ion-card>
            <ion-card-header no-padding>
              <ion-item>
                <ion-label>Nodes</ion-label>
                <ion-button slot="end" onClick={ () => 
                  this.handleNodeAddClick() }>Add</ion-button>
              </ion-item>
            </ion-card-header>
            <ion-card-content>
              <ion-list id="workflowNodesList">
                {this.workflowNodes.map(node => 
                  <ion-item-sliding>
                    <ion-item href={`/workflow-nodes/${node.id}`}>
                      <h2>{ node.name }</h2>
                    </ion-item>
                    <ion-item-options>
                      <ion-item-option color="danger" onClick={ () =>
                          this.handleNodeDeleteClick(node) }>
                        Delete
                      </ion-item-option>
                    </ion-item-options>
                  </ion-item-sliding>
                )}
              </ion-list>
            </ion-card-content>
          </ion-card>

          <ion-card>
            <ion-card-header no-padding>
              <ion-item>
                <ion-label>Transitions</ion-label>
                <ion-button slot="end" onClick={ () => 
                  this.handleTransitionAddClick() }>Add</ion-button>
              </ion-item>
            </ion-card-header>
            <ion-card-content>
              <ion-list id="workflowTransitionsList">
                {this.workflowTransitions.map(transition => 
                  <ion-item-sliding>
                    <ion-item href={`/workflow-transitions/${transition.id}`}>
                      <h2>{ transition.name }</h2>
                    </ion-item>
                    <ion-item-options>
                      <ion-item-option color="danger" onClick={ () =>
                        this.handleTransitionDeleteClick(transition) }>
                        Delete
                      </ion-item-option>
                    </ion-item-options>
                  </ion-item-sliding>
                )}
              </ion-list>
            </ion-card-content>
          </ion-card>

      </ion-content>,

      <ion-footer>
        <ion-buttons slot="end">
          <ion-button color="primary" fill="solid" onClick={ () => this.handleSaveClick() }>Save</ion-button>
          <ion-button color="primary" onClick={ () => this.navigate('/workflows')}>Cancel</ion-button>
        </ion-buttons>
      </ion-footer>
    ];
  }
}