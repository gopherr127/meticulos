import { Component, Element } from '@stencil/core';

@Component({
  tag: 'dashboard-grid-options-menu'
})
export class DashboardGridOptionsMenu {

  @Element() el: any;
  
  dismiss(data?: any) {
    
    (this.el.closest('ion-popover') as any).dismiss(data);
  }

  addPanel() {

    this.dismiss(true);
  }

  render() {
    return[
      <ion-item onClick={ () => this.addPanel() }>
        <ion-label>Add panel...</ion-label>
      </ion-item>
    ];
  }
}