import { Component, Element, Listen, Prop, State } from '@stencil/core';
import { ENV } from '../../../environments/environment';
import { Screen, WorkflowTransition } from '../../../interfaces/interfaces';

@Component({
  tag: 'workflow-transition-detail'
})
export class WorkflowTransitionDetail {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  preConditionsList: HTMLIonListElement;
  screensList: HTMLIonListElement;
  validationsList: HTMLIonListElement;
  postFunctionsList: HTMLIonListElement;
  @Prop({ connect: 'ion-router' }) nav;
  @Prop({ connect: 'ion-modal-controller' }) modalCtrl: HTMLIonModalControllerElement;
  @Prop() workflowTransitionId: string;
  @Prop() returnUrl = '/workflows/';
  @State() subtitle: string = 'Transition: ';
  @State() preConditions: Array<any> = [];
  @State() screens: Array<Screen> = [];
  @State() validations: Array<any> = [];
  @State() postFunctions: Array<any> = [];
  public transition: WorkflowTransition;
  public workflowId: string;
  public modalContext: string;
  
  async componentWillLoad() {

    await this.loadWorkflowTransition();
  }

  componentDidLoad() {

    this.preConditionsList = this.el.querySelector('#preConditionsList');
    this.screensList = this.el.querySelector('#screensList');
    this.validationsList = this.el.querySelector('#validationsList');
    this.postFunctionsList = this.el.querySelector('#postFunctionsList');
  }

  async navigate(url: string) {

    const navCtrl: HTMLIonRouterElement = await (this.nav as any).componentOnReady();
    navCtrl.push(url);
  }

  async loadWorkflowTransition() {

    let response = await fetch(
      this.apiBaseUrl + "/workflowtransitions/" + this.workflowTransitionId, {
      method: "GET"
    });

    if (response.ok) {

      this.transition = await response.json();

      this.subtitle = `Transition: ${this.transition.name}`;
      this.workflowId = this.transition.workflowId;
      this.preConditions = this.transition.preConditions ? this.transition.preConditions : [];
      this.screens = this.transition.screens ? this.transition.screens : [];
      this.validations = this.transition.validations ? this.transition.validations : [];
      this.postFunctions = this.transition.postFunctions ? this.transition.postFunctions : [];
    }
  }

  @Listen('body:ionModalDidDismiss')
  async handleModalDismissed(event: any) {

    if (this.modalContext === "function") {
      await this.loadWorkflowTransition();
    }
    else if (this.modalContext === "screen") {
      if (event && event.detail && event.detail.data) {
        this.screens = [...this.screens, event.detail.data];
        if (!this.transition.screenIds) {
          this.transition.screenIds = [];
        }
        this.transition.screenIds.push(event.detail.data.id);
      }
    }
  }

  async handleNewFunctionClick(typeId: number) {

    this.modalContext = "function";

    const modal = await this.modalCtrl.create({
      component: 'workflow-transition-function-create',
      componentProps: {
        transitionId: this.transition.id,
        functionTypeId: typeId
      }
    });
    
    await modal.present();
  }

  async handleFunctionClick(functionId: string) {

    this.modalContext = "function";

    const modal = await this.modalCtrl.create({
      component: 'workflow-transition-function-detail',
      componentProps: {
        workflowTransitionFunctionId: functionId
      }
    });
    
    await modal.present();
  }

  async handleNewScreenClick() {

    this.modalContext = "screen";

    const modal = await this.modalCtrl.create({
      component: 'screen-search'
    });

    await modal.present();
  }

  async handleFunctionDeleteClick(functionId: string, listEl: HTMLIonListElement) {

    let response = await fetch(
      this.apiBaseUrl + "/workflowtransitionfunctions/" + functionId, {
        method: "DELETE"
    });

    if (response.ok) {
      
      await this.loadWorkflowTransition();
    }

    listEl.closeSlidingItems();
  }

  async handleScreenDeleteClick(screenId: string) {

    this.transition.screenIds = this.transition.screenIds.filter((item) => {
      return item != screenId;
    });
    this.screens = this.screens.filter((item) => {
      return item.id != screenId;
    });

    await this.saveWorkflowTransition();
  }

  async saveWorkflowTransition() {

    let response = await fetch(
      this.apiBaseUrl + "/workflowtransitions/" + this.workflowTransitionId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.transition)
    });

    if (response.ok) {

      this.navigate(this.returnUrl + this.workflowId);
    }
  }

  @Listen('ionChange')
  handleFieldChanged(event: any) {
    
    if (event.target.id === "transitionName") {

      this.transition.name = event.detail.value;
    }
  }
  
  render() {
    return[
      <ion-header>

        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
            <ion-back-button defaultHref={ this.returnUrl + this.workflowId }></ion-back-button>
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
            <ion-input id="transitionName" value={ this.transition.name }></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position='fixed'>From Node</ion-label>
            <ion-input disabled value={ this.transition.fromNode.name }></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position='fixed'>To Node</ion-label>
            <ion-input disabled value={ this.transition.toNode.name }></ion-input>
          </ion-item>

          <ion-card>
            <ion-card-header no-padding>
              <ion-item>
                <ion-label>Pre-Conditions</ion-label>
                <ion-button slot="end" onClick={ () => this.handleNewFunctionClick(0) }>
                  New
                </ion-button>
              </ion-item>
            </ion-card-header>
            <ion-card-content>
              <ion-list id="preConditionsList">
                {this.preConditions.map(preCondition => 
                  <ion-item-sliding>
                    <ion-item onClick={ () => this.handleFunctionClick(preCondition.id) }>
                      <h2>{ preCondition.function.name }</h2>
                    </ion-item>
                    <ion-item-options>
                      <ion-item-option color="danger" onClick={ () =>
                        this.handleFunctionDeleteClick(preCondition.id, this.preConditionsList)}>
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
                <ion-label>Screens</ion-label>
                <ion-button slot="end" onClick={ () => this.handleNewScreenClick() }>
                  New
                </ion-button>
              </ion-item>
            </ion-card-header>
            <ion-card-content>
              <ion-list id="screensList">
                {this.screens.map(screen => 
                  <ion-item-sliding>
                    <ion-item>
                      <h2>{ screen.name }</h2>
                    </ion-item>
                    <ion-item-options>
                      <ion-item-option color="danger" onClick={ () =>
                        this.handleScreenDeleteClick(screen.id) }>
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
                <ion-label>Validations</ion-label>
                <ion-button slot="end" onClick={ () => this.handleNewFunctionClick(1) }>
                  New
                </ion-button>
              </ion-item>
            </ion-card-header>
            <ion-card-content>
              <ion-list id="validationsList">
                {this.validations.map(validation => 
                  <ion-item-sliding>
                    <ion-item onClick={ () => this.handleFunctionClick(validation.id) }>
                      <h2>{ validation.function.name }</h2>
                    </ion-item>
                    <ion-item-options>
                      <ion-item-option color="danger" onClick={ () =>
                        this.handleFunctionDeleteClick(validation.id, this.validationsList) }>
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
                <ion-label>Post-Functions</ion-label>
                <ion-button slot="end" onClick={ () => this.handleNewFunctionClick(2) }>
                  New
                </ion-button>
              </ion-item>
            </ion-card-header>
            <ion-card-content>
              <ion-list id="postFunctionsList">
                {this.postFunctions.map(postFunction => 
                  <ion-item-sliding>
                    <ion-item onClick={ () => this.handleFunctionClick(postFunction.id) }>
                      <h2>{ postFunction.function.name }</h2>
                    </ion-item>
                    <ion-item-options>
                      <ion-item-option color="danger" onClick={ () =>
                        this.handleFunctionDeleteClick(postFunction.id, this.postFunctionsList) }>
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
          <ion-button color="primary" fill="solid" onClick={ () => this.saveWorkflowTransition() }>Save</ion-button>
          <ion-button color="primary" onClick={ () => this.navigate(this.returnUrl + this.workflowId) }>Cancel</ion-button>
        </ion-buttons>
      </ion-footer>
    ];
  }
}