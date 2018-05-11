import { ENV } from '../environments/environment';
declare const auth0: any;

export async function initiateAuthentication(): Promise<void> {

  return new Promise<void>(resolve => {

    const clientUrl = new ENV().clientUrl();

    const authClient = new auth0.WebAuth({
      domain: 'meticulos.auth0.com',
      clientID: 'CNgGpvK2GKjPQBQPPXFrbrLPNE3F6EBW',
      redirectUri: `${clientUrl}/authredirect`,
      audience: 'https://meticulos.auth0.com/userinfo',
      responseType: 'token id_token',
      scope: 'openid',
      leeway: 60
    });

    authClient.authorize();

    resolve();
  });
}

export async function handleAuthentication(): Promise<void> {

  return new Promise<void>(async resolve => {

    const clientUrl = new ENV().clientUrl();

    const authClient = new auth0.WebAuth({
      domain: 'meticulos.auth0.com',
      clientID: 'CNgGpvK2GKjPQBQPPXFrbrLPNE3F6EBW',
      redirectUri: `${clientUrl}/authredirect`,
      audience: 'https://meticulos.auth0.com/userinfo',
      responseType: 'token id_token',
      scope: 'openid',
      leeway: 60
    });
    
    await authClient.parseHash(async (err, authResult) => {

      if (authResult && authResult.accessToken && authResult.idToken) {
        await setSession(authResult);
      }
      else if (err) {
        console.log("Error in handling authentication result:");
        console.log(err);
      }
    });
    resolve();
  });
}

export async function getIsUserAuthenticated(): Promise<boolean> {

  return new Promise<boolean>(resolve => {

    var expiryNote = localStorage.getItem('expires_at');
    if (!expiryNote) {
      resolve(false);
    }
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(expiryNote);
    resolve(new Date().getTime() < expiresAt);
  });
}

export async function setSession(authResult): Promise<boolean> {

  return new Promise<boolean>(resolve => {

    // Set the time that the access token will expire
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    resolve(true);
  });
}


export async function clearSession(): Promise<void> {

  return new Promise<void>(resolve => {

    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    resolve();
  });
}
