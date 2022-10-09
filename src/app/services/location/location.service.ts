import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Geolocation, PositionOptions } from '@capacitor/geolocation';
import { Options } from 'selenium-webdriver';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }

  async getCurrentLocation(){
    if(!Capacitor.isPluginAvailable('Geolocation')){
      return;
    }
    const Options: PositionOptions = {
        maximumAge: 3000,
        timeout: 10000,
        enableHighAccuracy: false,
    };
   return ( await Geolocation.getCurrentPosition(Options));
  }
}
