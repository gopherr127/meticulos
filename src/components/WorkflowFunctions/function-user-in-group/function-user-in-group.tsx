import { Component, Prop, Listen, Method } from '@stencil/core';

@Component({
  tag: 'function-user-in-group'
})
export class FunctionUserInGroup {

  @Prop() functionArgs: any;
  public selectedGroupIds: Array<any> = [];

  componentWillLoad() {

    if (this.functionArgs) {
      let args = JSON.parse(this.functionArgs);
      this.selectedGroupIds = args.groupIds;
    }
  }

  @Listen('ionChange')
  handleSelectedNodeChanged(event: any) {
    
    this.selectedGroupIds = event.detail.value;
  }

  @Method()
  getFunctionArgs() {

    return JSON.stringify({
      groupIds: this.selectedGroupIds
    });
  }

  render() {
    return (
      <ion-card>
        <ion-card-content>
          <ion-item>
            <ion-label position='fixed'>Group</ion-label>
            <ion-select id="groupSelect" multiple value={ this.selectedGroupIds }>
              <ion-select-option value="lsd2do9y1">Group 1</ion-select-option>
              <ion-select-option value="lsd2do9y2">Group 2</ion-select-option>
              <ion-select-option value="lsd2do9y3">Group 3</ion-select-option>
              <ion-select-option value="lsd2do9y4">Group 4</ion-select-option>
            </ion-select>
          </ion-item>
        </ion-card-content>
      </ion-card>
    );
  }
}