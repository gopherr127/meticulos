import '@ionic/core';

import { Component, Element, Listen, Prop, State } from '@stencil/core';
import { UserData } from '../../providers/user-data';
import { Plugins } from '@capacitor/core';

const { SplashScreen } = Plugins;

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css'
})
export class AppRoot {
  @State() loggedIn = false;
  hasSeenTutorial = false;

  @Element() el: HTMLElement;

  @Prop({context: 'isServer'}) isServer: boolean;

  appPages = [
    { title: 'Items',    url: '/items',    icon: 'list' },
    { title: 'Schedule', url: '/schedule', icon: 'calendar' },
    { title: 'Speakers', url: '/speakers', icon: 'contacts' },
    { title: 'Map',      url: '/map',      icon: 'map' },
    { title: 'About',    url: '/about',    icon: 'information-circle' }
  ];
  
  adminPages = [
    { title: 'Item Types', url: '/itemtypes', icon: 'albums' },
    { title: 'Workflows',  url: '/workflows', icon: 'git-merge' },
    { title: 'Screens',    url: '/screens',   icon: 'desktop' },
    { title: 'Fields',     url: '/fields',    icon: 'switch' }
  ];

  async componentWillLoad() {
    this.hasSeenTutorial = this.isServer
      ? true
      : await UserData.checkHasSeenTutorial();
  }

  async componentDidLoad() {
    this.checkLoginStatus();
    try {
      await SplashScreen.hide();
    } catch {
      return;
    }
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

        <ion-route-redirect from="/" to={this.hasSeenTutorial ? '/schedule' : '/tutorial'} />

        <ion-route url="/items" component="items-list"></ion-route>
        
        <ion-route url="/itemtypes" component="itemtypes-list"></ion-route>
        <ion-route url="/workflows" component="workflows-list"></ion-route>
        
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

            </ion-content>
          </ion-menu>

          <ion-router-outlet animated={false} main></ion-router-outlet>
        </ion-split-pane>
      </ion-app>
    );
  }
}
