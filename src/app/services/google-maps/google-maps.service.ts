import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {

  constructor(private http: HttpClient) {}

  loadGoogleMaps(): Promise<any> {
    const win = window as any;
    const gModule = win.google;
    if(gModule && gModule.maps) {
     return Promise.resolve(gModule.maps);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src =
        'https://maps.googleapis.com/maps/api/js?key=' +
        environment.googleMapsApiKey
         + '&libraries=places';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if(loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google Map SDK is not Available');
        }
      };
    });
  }

  getAddress(lat: number, lng: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<any>(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleMapsApiKey}`
        )
        .pipe(
          map(geoData => {
            if(!geoData || !geoData.results || geoData.results.length === 0) {throw(null)};
            console.log('location:',geoData.results[0]);
            return geoData.results[0];
          })
        ).subscribe(data => {
          resolve(data);
        }, e => {
          reject(e);
        });
    });
  }

}
