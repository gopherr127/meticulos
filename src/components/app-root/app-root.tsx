import '@ionic/core';

import { Component, Listen, Prop, State } from '@stencil/core';
import { UserData } from '../../providers/user-data';
import { Plugins } from '@capacitor/core';
import { ENV } from '../../environments/environment';
import { ItemType } from '../../interfaces/interfaces';

const { SplashScreen } = Plugins;

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css'
})
export class AppRoot {
  
  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Prop({ context: 'isServer' }) isServer: boolean;
  @State() loggedIn = false;
  @State() itemTypes: Array<ItemType> = [];
  hasSeenTutorial = false;

  appPages = [
    { title: 'Dashboard',    url: '/dashboard',    icon: 'pulse' },
    { title: 'Items Search', url: '/items-search', icon: 'search' },
    { title: 'Items Map',    url: '/items-map',    icon: 'map' },
    { title: 'Schedule',     url: '/schedule',     icon: 'calendar' }
  ];
  
  adminPages = [
    { title: 'Locations',   url: '/locations',   icon: 'pin' },
    { title: 'Item Types',  url: '/item-types',  icon: 'albums' },
    { title: 'Workflows',   url: '/workflows',   icon: 'git-merge' },
    { title: 'Screens',     url: '/screens',     icon: 'desktop' },
    { title: 'Fields',      url: '/fields',      icon: 'switch' },
    { title: 'Users',       url: '/users',       icon: 'people' },
    { title: 'Groups',      url: '/groups',      icon: 'apps' },
    { title: 'Roles',       url: '/roles',       icon: 'contacts' },
    { title: 'Permissions', url: '/permissions', icon: 'aperture' }
  ];

  accountPages = [
    { title: 'Log Out',  url: '/log-out',  icon: 'exit' },
    { title: 'Profile',  url: '/profile',  icon: 'contact' },
    { title: 'Tutorial', url: '/tutorial', icon: 'hammer' }
  ]

  systemPages = [
    { title: 'About',    url: '/about',    icon: 'information-circle' }
  ]

  async componentWillLoad() {

    this.hasSeenTutorial = this.isServer
      ? true
      : await UserData.checkHasSeenTutorial();
    
    this.loadItemTypes();
  }

  async componentDidLoad() {
    this.checkLoginStatus();
    try {
      await SplashScreen.hide();
    } catch {
      return;
    }
  }

  async pushComponent(componentName: string, componentProps?: any) {

    const navCtrl = document.querySelector('ion-nav');
    navCtrl.push(componentName, componentProps);
  }
  
  async loadItemTypes() {

    let response = await fetch(
      this.apiBaseUrl + "/itemtypes", { 
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
    });

    this.itemTypes = await response.json();
    this.itemTypes.sort( (typeA, typeB) => {
      if (typeA.name < typeB.name) return -1;
      if (typeA.name > typeB.name) return 1;
      return 0;
    });
  } 

  async checkLoginStatus() {
    const loggedIn = this.loggedIn = await UserData.isLoggedIn();
    return loggedIn;
  }

  async logout() {
    await UserData.logout();
    this.loggedIn = false;
  }

  @Listen('userDidLogIn')
  @Listen('userDidLogOut')
  updateLoggedInStatus(loggedEvent) {
    this.loggedIn = loggedEvent.detail.loginStatus;
  }

  renderRouter() {
    return (
      <ion-router useHash={false}>

        <ion-route-redirect from="/" to={this.hasSeenTutorial ? '/items-search' : '/tutorial'} />

        <ion-route url="/dashboard" component="dashboard-grid"></ion-route>
        <ion-route url="/dashboard/:panelId" component="dashboard-report-panel"></ion-route>

        <ion-route url="/items/type/:itemTypeId" component="items-list"></ion-route>
        <ion-route url="/items/create/:itemTypeId" component="item-create"></ion-route>
        <ion-route url="/items/:itemId" component="item-detail"></ion-route>
        
        <ion-route url="/items-search" component="items-search"></ion-route>
        <ion-route url="/item-qr-search" component="item-qr-search"></ion-route>
        
        <ion-route url="/items-map" component="items-map"></ion-route>

        <ion-route url="/locations" component="locations-list"></ion-route>
        <ion-route url="/locations/:itemLocationId" component="location-detail"></ion-route>

        <ion-route url="/item-types" component="item-types-list"></ion-route>
        <ion-route url="/item-types/:itemTypeId" component="item-type-detail"></ion-route>
        <ion-route url="/item-types/create" component="item-type-create"></ion-route>

        <ion-route url="/workflows" component="workflows-list"></ion-route>
        <ion-route url="/workflows/:workflowId" component="workflow-detail"></ion-route>
        <ion-route url="/workflows/create" component="workflow-create"></ion-route>
        <ion-route url="/workflow-nodes/:workflowNodeId" component="workflow-node-detail"></ion-route>
        <ion-route url="/workflow-transitions/:workflowTransitionId" component="workflow-transition-detail"></ion-route>

        <ion-route url="/screens" component="screens-list"></ion-route>
        <ion-route url="/screens/:screenId" component="screen-detail"></ion-route>
        <ion-route url="/screens/create" component="screen-create"></ion-route>

        <ion-route url="/fields" component="fields-list"></ion-route>
        <ion-route url="/fields/:fieldId" component="field-detail"></ion-route>
        <ion-route url="/fields/create" component="field-create"></ion-route>

        <ion-route component="page-tabs">

          <ion-route url="/schedule" component="tab-schedule">
            <ion-route component="page-schedule"></ion-route>
            <ion-route url="/session/:sessionId" component="page-session" componentProps={{ goback: '/schedule' }}></ion-route>
          </ion-route>

          <ion-route url="/speakers" component="tab-speaker">
            <ion-route component="page-speaker-list"></ion-route>
            <ion-route url="/session/:sessionId" component="page-session" componentProps={{ goback: '/speakers' }}></ion-route>
            <ion-route url="/:speakerId" component="page-speaker-detail"></ion-route>
          </ion-route>

          <ion-route url="/map" component="page-map"></ion-route>
          <ion-route url="/about" component="page-about"></ion-route>
        </ion-route>
          
        <ion-route url="/tutorial" component="page-tutorial"></ion-route>

      </ion-router>
    );
  }

  render() {
    return (
      <ion-app>
        {this.renderRouter()}
        <ion-split-pane>
          <ion-menu>
            <ion-header>
              <ion-toolbar>
                <ion-title>Menu</ion-title>
              </ion-toolbar>
            </ion-header>
            <ion-content forceOverscroll={false}>

              <ion-list>
                <ion-list-header>
                  Navigate
                </ion-list-header>
                {this.appPages.map((page) =>
                  <ion-menu-toggle autoHide={false}>
                    <ion-item href={page.url}>
                      <ion-icon slot="start" name={page.icon}></ion-icon>
                      <ion-label>
                        {page.title}
                      </ion-label>
                    </ion-item>
                  </ion-menu-toggle>
                )}
              </ion-list>

              <p></p>

              <ion-list>
                <ion-list-header>
                  Item Types
                </ion-list-header>
                { this.itemTypes.map((itemType) =>
                  <ion-menu-toggle autoHide={false}>
                    <ion-item button onClick={ () => this.pushComponent('items-list', { itemTypeId: itemType.id })}>
                      <ion-avatar slot="start">
                        <img src={itemType.iconUrl}/>
                      </ion-avatar>
                      <ion-label>
                        {itemType.pluralName}
                      </ion-label>
                    </ion-item>
                  </ion-menu-toggle>
                )}
              </ion-list>

              <p></p>

              <ion-list>
                <ion-list-header>
                  Administration
                </ion-list-header>
                {this.adminPages.map((page) =>
                  <ion-menu-toggle autoHide={false}>
                    <ion-item href={page.url}>
                      <ion-icon slot="start" name={page.icon}></ion-icon>
                      <ion-label>
                        {page.title}
                      </ion-label>
                    </ion-item>
                  </ion-menu-toggle>
                )}
              </ion-list>

              <p></p>

              <ion-list>
                <ion-list-header>
                  Account
                </ion-list-header>
                {this.accountPages.map((page) =>
                  <ion-menu-toggle autoHide={false}>
                    <ion-item href={page.url}>
                      <ion-icon slot="start" name={page.icon}></ion-icon>
                      <ion-label>
                        {page.title}
                      </ion-label>
                    </ion-item>
                  </ion-menu-toggle>
                )}
              </ion-list>

              <p></p>

              <ion-list>
                <ion-list-header>
                  System
                </ion-list-header>
                {this.systemPages.map((page) =>
                  <ion-menu-toggle autoHide={false}>
                    <ion-item href={page.url}>
                      <ion-icon slot="start" name={page.icon}></ion-icon>
                      <ion-label>
                        {page.title}
                      </ion-label>
                    </ion-item>
                  </ion-menu-toggle>
                )}
              </ion-list>

            </ion-content>
          </ion-menu>

          <ion-nav main animated={false}></ion-nav>
        </ion-split-pane>
        
      </ion-app>
    );
  }
}
