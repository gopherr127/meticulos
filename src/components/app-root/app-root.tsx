import '@ionic/core';

import { Component, Prop, State } from '@stencil/core';
import { UserData } from '../../providers/user-data';
import { Plugins } from '@capacitor/core';
import { ENV } from '../../environments/environment';
import { AuthService } from '../../services/auth-service';
import { ItemType } from '../../interfaces/interfaces';

const { SplashScreen } = Plugins;

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css'
})
export class AppRoot {
  
  public serverUrl: string = new ENV().serverUrl();
  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Prop({ context: 'isServer' }) isServer: boolean;
  public authSvc: AuthService = new AuthService();
  @State() isUserAuthenticated: boolean;
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
    { title: 'Profile',  url: '/profile',  icon: 'contact' },
    { title: 'Tutorial', url: '/tutorial', icon: 'hammer' }
  ]

  systemPages = [
    { title: 'About',    url: '/about',    icon: 'information-circle' }
  ]

  async componentWillLoad() {
    
    this.tryUpdateIsUserAuthenticated();
    
    if (!this.isUserAuthenticated) {

      try {
        await this.authSvc.handleAuthentication();
      } catch {}
      
      this.tryUpdateIsUserAuthenticated();
    }
    // else {

      this.hasSeenTutorial = this.isServer
        ? true
        : await UserData.checkHasSeenTutorial();
      
      await this.loadItemTypes();
    // }
  }

  async componentDidLoad() {
    
    try {

      await SplashScreen.hide();
    } 
    catch {
      return;
    }
  }

  async componentWillUpdate() {
    
    this.tryUpdateIsUserAuthenticated();
  }

  async tryUpdateIsUserAuthenticated() {

    this.isUserAuthenticated = await this.authSvc.getIsUserAuthenticated();
  }

  async handleSignInClick() {
    
    await this.authSvc.initiateAuthentication();
  }

  async handleSignoutClick() {

    await this.authSvc.clearSession();
    await this.tryUpdateIsUserAuthenticated();
    document.querySelector('ion-router').push('/');
    document.querySelector('ion-nav').setRoot('app-welcome');
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

  renderRouteConfig() {
    return (
      <ion-router useHash={false}>

        {/* <ion-route-redirect from="/" to={this.hasSeenTutorial ? '/items-search' : '/tutorial'} /> */}
        {/* <ion-route-redirect from="/" to={this.isUserAuthenticated ? '/dashboard' : '/home'}></ion-route-redirect> */}

        {/* <ion-route url="/home" component="public-home"></ion-route>
        <ion-route url="/authredirect" component="auth-redirect"></ion-route> */}
        
        <ion-route-redirect from='/' to={this.isUserAuthenticated ? '/dashboard' : '/welcome'} ></ion-route-redirect>

        <ion-route url='/welcome' component='app-welcome'></ion-route>
        <ion-route url="/tutorial" component="page-tutorial"></ion-route>
        <ion-route url="/dashboard" component="dashboard-grid"></ion-route>
        <ion-route url="/dashboard/:panelId" component="dashboard-panel"></ion-route>

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
        
        <ion-route url="/users" component="users-list"></ion-route>

      </ion-router>
    );
  }

  renderMenuForAuthenticatedUser() {
    return [
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
      </ion-list>,
      <p></p>,
      <ion-list>
        <ion-list-header>
          Item Lists
        </ion-list-header>
        { this.itemTypes.map((itemType) =>
          <ion-menu-toggle autoHide={false}>
            <ion-item button onClick={ () => this.pushComponent(
                'items-list', 
                { itemTypeId: itemType.id })}>
              <ion-avatar slot="start">
                <img src={itemType.iconUrl}/>
              </ion-avatar>
              <ion-label>
                {itemType.pluralName}
              </ion-label>
            </ion-item>
          </ion-menu-toggle>
        )}
      </ion-list>,
      <p></p>,
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
      </ion-list>,
      <p></p>,
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
        <ion-menu-toggle autoHide={false}>
          <ion-item onClick={ () => this.handleSignoutClick() }>
            <ion-icon slot="start" name='exit'></ion-icon>
            <ion-label>
              Sign Out
            </ion-label>
          </ion-item>
        </ion-menu-toggle>
      </ion-list>,
      <p></p>,
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
    ];
  }

  renderMenuContent() {
    return(
      <ion-content>
        {this.isUserAuthenticated
          ? 
            this.renderMenuForAuthenticatedUser()
          : <ion-item button onClick={ () => this.handleSignInClick() }>
              <ion-label>Sign In</ion-label>
            </ion-item>
        }
      </ion-content>
    );
  }

  render() {
    return(
      <ion-app>

        { this.renderRouteConfig() }

        <ion-split-pane>

          <ion-menu>

            <ion-header>
              <ion-toolbar>
                <ion-title>Menu</ion-title>
              </ion-toolbar>
            </ion-header>

            { this.renderMenuContent() }

          </ion-menu>

          <ion-nav main animated={false}></ion-nav>

        </ion-split-pane>

      </ion-app>
    );
  }
}
