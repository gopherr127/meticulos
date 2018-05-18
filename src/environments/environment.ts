export class ENV {

  public static currentEnvironment: string = "dev";
  //public static currentEnvironment: string = "prod";

  apiBaseUrl() {
    return `${this.serverUrl()}/api`;
  }
  
  clientUrl() {
    switch (ENV.currentEnvironment) {
      case "dev": {
        return "http://localhost:3333";
      }
      case "prod": {
        return "https://meticulos.com";
      }
      default: {
        return "";
      }
    }
  }

  serverUrl() {
    switch (ENV.currentEnvironment) {
      case "dev": {
        return "http://localhost:10652";
      }
      case "prod": {
        return "https://meticulos-server.azurewebsites.net";
      }
      default: {
        return "";
      }
    }
  }
};