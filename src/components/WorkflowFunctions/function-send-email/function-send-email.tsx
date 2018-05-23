import { Component, Listen, Method, Prop, State } from '@stencil/core';
import { ENV } from '../../../environments/environment';

@Component({
  tag: 'function-send-email'
})
export class FunctionSendEmail {
  
  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Prop() functionArgs: any;
  @State() emailAddresses: string;

  async componentWillLoad() {

    if (this.functionArgs) {
      let args = JSON.parse(this.functionArgs);
      this.emailAddresses = args.emailAddresses;
    }
  }
  
  @Method()
  getFunctionArgs() {

    return JSON.stringify({
      emailAddresses: this.emailAddresses
    });
  }

  @Listen('ionChange')
  handleFieldValueChange(event: any) {

    if (event.detail) {
      if (event.target.id === 'emailAddresses') {

        this.emailAddresses = event.detail.value;
      }
    }
  }

  render() {
    return (
      <ion-card>
        <ion-card-content>
          <ion-item>
            <ion-label position="floating">Email Addresses (comma-separated list)</ion-label>
            <ion-input id='emailAddresses' debounce={300} 
                       value={this.emailAddresses}></ion-input>
          </ion-item>
        </ion-card-content>
      </ion-card>
    )
  }
}