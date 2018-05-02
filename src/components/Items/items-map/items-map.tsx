import { Component, Element, Prop } from '@stencil/core';
import { Item } from '../../../interfaces/interfaces';
import * as Geolocation from '../../../services/geolocation-service';
declare var google: any;

@Component({
  tag: 'items-map',
  styleUrl: 'items-map.css'
})
export class ItemsMap {
  
  @Element() private el: HTMLElement;
  @Prop() item: Item;

  async componentWillLoad() {

    await getGoogleMaps('AIzaSyAgXDn5FJ2g48NK6A-AK7h5Go09lIL1IqE');
  }

  async componentDidLoad() {

    await this.initMap();
  }

  async initMap() {

    var deviceCurrentLocation = await Geolocation.getDeviceCurrentLocation();

    if (deviceCurrentLocation) {

      // Convert to google GPS location object
      var currentLoc = {
        lat: deviceCurrentLocation.latitude,
        lng: deviceCurrentLocation.longitude
      }

      const mapElem = this.el.querySelector('.map-canvas');

      // Initialize map
      var map = new google.maps.Map(mapElem, {
        center: currentLoc,
        zoom: 12
      });

      // Add current device location marker to map
      var deviceMarker = new google.maps.Marker({
        position: currentLoc,
        map: map,
        icon: 'http://www.vidsbook.com/images/icons/network.png',
        title: 'You are here'
      });
      const deviceInfoWindow = new google.maps.InfoWindow({
        content: `<h5>You are here</h5>`
      })
      deviceMarker.addListener('click', () => {
        deviceInfoWindow.open(map, deviceMarker);
      });

      if (this.item && this.item.location && this.item.location.gps) {

        var itemLoc = {
          lat: this.item.location.gps.latitude,
          lng: this.item.location.gps.longitude
        }
  
        // Add item location marker to map
        var itemMarker = new google.maps.Marker({
          position: itemLoc,
          map: map,
          title: `${this.item.name}`
        });
        const itemInfoWindow = new google.maps.InfoWindow({
          content: `<h5>${this.item.name}</h5>`
        });
        itemMarker.addListener('click', () => {
          itemInfoWindow.open(map, itemMarker);
        });
        
      }

      google.maps.event.addListenerOnce(map, 'idle', () => {
        mapElem.classList.add('show-map');
      });
    }
  }

  render() {
    return [
        <ion-header>

          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-menu-button></ion-menu-button>
            </ion-buttons>
            <ion-title>Meticulos</ion-title>
          </ion-toolbar>

          <ion-toolbar color="secondary">
            <ion-buttons slot="start">
              <ion-back-button></ion-back-button>
            </ion-buttons>
            <ion-title>Map</ion-title>
          </ion-toolbar>

        </ion-header>,

        <div class="map-canvas"></div>
        
    ];
  }
}

function getGoogleMaps(apiKey: string): Promise<any> {
  const win = window as any;
  const google = win.google;
  if (google && google.maps) {
    return Promise.resolve(google.maps);
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.31`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    script.onload = () => {
      const win = window as any;
      const google = win.google;
      if (google && google.maps) {
        resolve(google.maps);
      } else {
        reject('google maps not available');
      }
    };
  });
}