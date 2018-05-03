import { Component, Element, Listen, Prop, State } from '@stencil/core';
import { Workflow } from '../../../interfaces/interfaces';
import { ENV } from '../../../environments/environment';

@Component({
  tag: 'workflows-list'
})
export class WorkflowsList {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  workflowsList: HTMLIonListElement;
  @Prop({ connect: 'ion-modal-controller' }) modalCtrl: HTMLIonModalControllerElement;
  @Prop() subtitle = 'Workflows';
  @State() queryText = '';
  @State() workflows: Array<Workflow> = [];

  async componentWillLoad() {
    
    await this.loadWorkflows();
  }

  componentDidLoad() {

    this.workflowsList = this.el.querySelector('#workflowsList');
  }

  @Listen('body:ionModalDidDismiss')
  async loadWorkflows() {

    let response = await fetch(
      this.apiBaseUrl + "/workflows", { 
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
    });

    this.workflows = await response.json();
  } 

  async handleAddFabClick() {

    const modal = await this.modalCtrl.create({
      component: 'workflow-create'
    });
    
    await modal.present();
  }

  async handleDeleteClick(workflow: Workflow) {

    let response = await fetch(
      this.apiBaseUrl + "/workflows/" + workflow.id, {
        method: "DELETE"
    });

    if (response.ok) {
      
      await this.loadWorkflows();
      this.workflowsList.closeSlidingItems();
    }
  }

  render() {
    return[
      <ion-header>

        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-title>Meticulos</ion-title>
        </ion-toolbar>

        <ion-toolbar color="secondary">
          <ion-title>{ this.subtitle }</ion-title>
          <ion-buttons slot="end">
            <ion-button id="createButton" fill="solid" color="primary" 
                        onClick={ () => this.handleAddFabClick() }>
              Create
            </ion-button>
            <ion-button>
              <ion-icon slot="icon-only" name="more"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>

        <ion-toolbar color="tertiary">
          <ion-searchbar value={this.queryText} placeholder="Search">
          </ion-searchbar>
        </ion-toolbar>

      </ion-header>,

      <ion-content>

        <ion-list id="workflowsList">
          {this.workflows.map(workflow => 
            <ion-item-sliding>
              <ion-item href={`/workflows/${workflow.id}`}>
                <h2>{ workflow.name }</h2>
              </ion-item>
              <ion-item-options>
                <ion-item-option color="danger" onClick={ () =>
                    this.handleDeleteClick(workflow) }>
                  Delete
                </ion-item-option>
              </ion-item-options>
            </ion-item-sliding>
          )}
          <ion-item disabled></ion-item>
          <ion-item disabled></ion-item>
        </ion-list>

        <ion-fab id="fabSection" horizontal="end" vertical="bottom" slot="fixed">
          <ion-fab-button onClick={ () => this.handleAddFabClick() }>Create</ion-fab-button>
        </ion-fab>

      </ion-content>
    ];
  }
}