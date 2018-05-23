import { Component, State } from '@stencil/core';
import { ENV } from '../../../environments/environment';
import { User } from '../../../interfaces/interfaces';

@Component({
  tag: 'users-list'
})
export class UsersList {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @State() users: Array<User> = [];

  async componentWillLoad() {

    await this.loadUsers();
  }

  async loadUsers() {

    let response = await fetch(
      `${this.apiBaseUrl}/users`, {
        method: 'GET'
    });

    if (response.ok) {
      this.users = await response.json();
    }
    else {
      console.log(response);
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
          <ion-title>Users</ion-title>
          <ion-buttons slot="end">
            {/* <ion-button id="createButton" fill="solid" color="primary" 
                        onClick={ () => this.handleAddFabClick() }>
              Create
            </ion-button> */}
            <ion-button>
              <ion-icon slot="icon-only" name="more"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>

        {/* <ion-toolbar color="tertiary">
          <ion-searchbar value={this.queryText} placeholder="Search">
          </ion-searchbar>
        </ion-toolbar> */}

      </ion-header>,

      <ion-content>

        <ion-list id="usersList">
          {this.users.map(user => 
            <ion-item-sliding>
              <ion-item>
                <ion-label>
                  <h2>{ user.name }</h2>
                  <h4>{ user.last_login }</h4>
                </ion-label>
              </ion-item>
              {/* <ion-item-options>
                <ion-item-option color="danger" onClick={ () =>
                    this.handleDeleteClick(screen) }>
                  Delete
                </ion-item-option>
              </ion-item-options> */}
            </ion-item-sliding>
          )}
          <ion-item disabled></ion-item>
          <ion-item disabled></ion-item>
        </ion-list>

        {/* <ion-fab id="fabSection" horizontal="end" vertical="bottom" slot="fixed">
          <ion-fab-button onClick={ () => this.handleAddFabClick() }>Create</ion-fab-button>
        </ion-fab> */}

      </ion-content>
    ];
  }
}