import { ENV } from '../environments/environment';
declare const auth0: any;

export class AuthService {

  private readonly clientUrl: string;
  private readonly authClient: any;

  constructor() {

    this.clientUrl = new ENV().clientUrl();

    this.authClient = new auth0.WebAuth({
      domain: 'atlasrfid.auth0.com',
      clientID: '37ABG9MKLARKjKseOE6cyvfTOdEn68CW',
      redirectUri: `${this.clientUrl}/`,
      audience: 'https://meticulos.com/api',
      responseType: 'token id_token',
      scope: 'openid',
      leeway: 60
    });
  }

  public initiateAuthentication(): Promise<void> {

    return new Promise<void>(resolve => {
       this.authClient.authorize();
       resolve();
    });
  }

  public handleAuthentication(): Promise<any> {

    return new Promise((resolve, reject) => {

      if (window.location && window.location.hash) {

        let hashSplit = window.location.hash.split('&');

        try {

          for (let hashPart of hashSplit) {
            if (hashPart.includes('access_token')) {
              localStorage.setItem('access_token', hashPart.split('=')[1]);
            }
            else if (hashPart.includes('expires_in')) {
              let expiresIn = parseInt(hashPart.split('=')[1]);
              localStorage.setItem('expires_at', JSON.stringify((expiresIn * 1000) + new Date().getTime()));
            }
            else if (hashPart.includes('id_token')) {
              localStorage.setItem('id_token', hashPart.split('=')[1]);
            }
            else if (hashPart.includes('scope')) {
              localStorage.setItem('scopes', hashPart.split('=')[1]);
            }
          }
          resolve("Authentication successful.");
        }
        catch {
          reject("An error occurred during parsing.");
        }
      }
      else {
        reject("Nothing to parse.");
      }
    });
  }

  public getIsUserAuthenticated(): Promise<boolean> {

    return new Promise<boolean>(resolve => {

      var accessToken = localStorage.getItem('access_token');
      var expiryNote = localStorage.getItem('expires_at');
      if (!accessToken || !expiryNote) {
        resolve(false);
      }
      // Check whether the current time is past the
      // access token's expiry time
      const expiresAt = JSON.parse(expiryNote);
      resolve(new Date().getTime() < expiresAt);
    });
  }

  public getAuthorizationHeaderValue(): string {

    return 'Bearer ' + localStorage.getItem('access_token');
  }

  public userHasScopes(scopes: Array<string>): boolean {

    const grantedScopes = JSON.parse(localStorage.getItem('scopes')).split(' ');
    return scopes.every(scope => grantedScopes.includes(scope));
  }

  public clearSession(): Promise<void> {

    return new Promise<void>(resolve => {

      localStorage.removeItem('access_token');
      localStorage.removeItem('id_token');
      localStorage.removeItem('expires_at');
      localStorage.removeItem('scopes');
      resolve();
    });
  }
}