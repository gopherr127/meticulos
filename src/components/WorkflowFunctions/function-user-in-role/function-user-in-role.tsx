import { Component, Prop, Listen, Method } from '@stencil/core';

@Component({
  tag: 'function-user-in-role'
})
export class FunctionUserInRole {

  @Prop() functionArgs: any;
  public selectedRoleIds: Array<any> = [];

  componentWillLoad() {

    if (this.functionArgs) {
      let args = JSON.parse(this.functionArgs);
      this.selectedRoleIds = args.roleIds;
    }
  }

  @Listen('ionChange')
  handleSelectedNodeChanged(event: any) {
    
    this.selectedRoleIds = event.detail.value;
  }

  @Method()
  getFunctionArgs() {

    return JSON.stringify({
      "roleIds": this.selectedRoleIds
    });
  }

  render() {
    return (
      <ion-card>
        <ion-card-content>
          <ion-item>
            <ion-label position='fixed'>Role</ion-label>
            <ion-select id="roleSelect" multiple value={ this.selectedRoleIds }>
              <ion-select-option value="test1">Role 1</ion-select-option>
              <ion-select-option value="test2">Role 2</ion-select-option>
              <ion-select-option value="test3">Role 3</ion-select-option>
              <ion-select-option value="test4">Role 4</ion-select-option>
            </ion-select>
          </ion-item>
        </ion-card-content>
      </ion-card>
    );
  }
}