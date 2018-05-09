export class ENV {

  public static currentEnvironment: string = "dev";
  //public static currentEnvironment: string = "prod";

  apiBaseUrl() {
    switch (ENV.currentEnvironment) {
      case "dev": {
        return "http://localhost:10652/api";
      }
      case "prod": {
        return "https://meticulos-server.azurewebsites.net/api";
      }
      default: {
        return "";
      }
    }
  }

  someOtherSetting() {
    switch (ENV.currentEnvironment) {
      case "dev": {
        return "yes";
      }
      case "prod": {
        return "no";
      }
      default: {
        return "";
      }
    }
  }
};