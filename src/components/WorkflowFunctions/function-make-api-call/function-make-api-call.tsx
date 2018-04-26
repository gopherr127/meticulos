import { Component, Prop, Listen, Method } from '@stencil/core';

@Component({
  tag: 'function-make-api-call'
})
export class FunctionMakeApiCall {

  @Prop() functionArgs: any;
  public urlToCall: string;
  public includePayload: boolean;

  componentWillLoad() {

    if (this.functionArgs) {
      let args = JSON.parse(this.functionArgs);
      this.urlToCall = args.url;
      this.includePayload = args.includePayload;
    }
  }

  @Listen('ionInput')
  handleIonInput(event: any) {

    this.urlToCall = event.detail.target.value;
  }

  @Listen('ionChange')
  handleSelectedNodeChanged(event: any) {
    
    if (event.target.id === "includePayload") {
      this.includePayload = event.detail.checked;
    }
  }

  @Method()
  getFunctionArgs() {

    return JSON.stringify({
      "url": this.urlToCall,
      "includePayload": this.includePayload
    });
  }

  render() {
    return (
      <ion-card>
        <ion-card-content>
          <ion-item>
            <ion-label position='fixed'>URL to Call</ion-label>
            <ion-input value={ this.urlToCall }></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position='fixed'>Include Payload</ion-label>
            <ion-checkbox id="includePayload" checked={ this.includePayload }></ion-checkbox>
          </ion-item>
        </ion-card-content>
      </ion-card>
    );
  }
}