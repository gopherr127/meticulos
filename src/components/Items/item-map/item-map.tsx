import { Component, Element, Prop, State } from '@stencil/core';
import { GpsLocation } from '../../../interfaces/interfaces';
import * as Geolocation from '../../../services/geolocation-service';
declare var google: any;

@Component({
  tag: 'item-map'
})
export class ItemMap {
  
  @Element() el: any;
  @Prop() itemLocation: GpsLocation;
  @State() distanceToItem: string;

  async componentDidLoad() {

    await this.initMap();
  }

  async initMap() {

    var deviceCurrentLocation = await Geolocation.getDeviceCurrentLocation();

    if (deviceCurrentLocation && this.itemLocation) {

      // Convert to google GPS location object
      // var currentLoc = {
      //   lat: deviceCurrentLocation.latitude,
      //   lng: deviceCurrentLocation.longitude
      // }

      const mapElem = this.el.querySelector('#mapEl');

      // Initialize map
      var bham = {lat: 33.5234291, lng: -86.80737189999999};
      var googleMap = new google.maps.Map(mapElem, {
        center: bham,
        zoom: 12
      });
      googleMap; 

      // var itemLoc = {
      //   lat: this.itemLocation.latitude,
      //   lng: this.itemLocation.longitude
      // }

      // Add marker to map
      // var marker = new google.maps.Marker({
      //   position: itemLoc,
      //   map: map,
      //   title: '<Item Name Here>'
      // });
      // marker;
      
      // Calculate distance between two locations
      // var service = new google.maps.DistanceMatrixService();
      // service.getDistanceMatrix(
      //   {
      //     origins: [currentLoc],
      //     destinations: [itemLoc],
      //     travelMode: 'WALKING'
      //   }, this.googleDistanceMatrixCallback.bind(this));
    }
  }

  async googleDistanceMatrixCallback(response, status) {

    if (response && status == 'OK') {

      // For some reason, this is not updating on the UI
      this.distanceToItem = response.rows[0].elements[0].distance.text;
      console.log(this.distanceToItem);
    }
  }

  dismiss(data?: any) {

    (this.el.closest('ion-modal') as any).dismiss(data);
  }

  render() {
    return [
        <ion-header>

          <ion-toolbar color="secondary">
            <ion-title>Map</ion-title>
          </ion-toolbar>

        </ion-header>,

        <ion-content>
          
          <ion-card><div id="mapEl"></div></ion-card>

        </ion-content>,

        <ion-footer>
          <ion-buttons slot="end">
            <ion-button color="primary" onClick={ () => this.dismiss() }>Close</ion-button>
          </ion-buttons>
        </ion-footer>
    ];
  }
}

// function getGoogleMaps(apiKey: string): Promise<any> {
//   const win = window as any;
//   const google = win.google;
//   if (google && google.maps) {
//     return Promise.resolve(google.maps);
//   }

//   return new Promise((resolve, reject) => {
//     const script = document.createElement('script');
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.31`;
//     script.async = true;
//     script.defer = true;
//     document.body.appendChild(script);
//     script.onload = () => {
//       const win = window as any;
//       const google = win.google;
//       if (google && google.maps) {
//         resolve(google.maps);
//       } else {
//         reject('google maps not available');
//       }
//     };
//   });
// }