import { GpsLocation } from '../interfaces/interfaces';

export async function getDeviceCurrentLocation(): Promise<GpsLocation> {

  return new Promise<GpsLocation>(resolve => {
    let deviceLocation: GpsLocation = {
      latitude: -1,
      longitude: -1
    };

    function success(position) {
      
      deviceLocation.latitude = position.coords.latitude;
      deviceLocation.longitude = position.coords.longitude;
      
      resolve(deviceLocation);
    }

    function error() {
      console.log("An error occurred while attempting to get the device's current GPS location.");
    }

    if (navigator.geolocation) {
      // Geolocation is supported by the browser
      navigator.geolocation.getCurrentPosition(success, error);
    }
    else {
      // Geolocation is not supporter by the browser
      console.log("Geolocation services are not supported by your browser.");
    }
  });
}