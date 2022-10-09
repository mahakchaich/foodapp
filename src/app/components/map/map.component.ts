import { AfterViewInit, Component, ElementRef, OnInit, Output, Renderer2, ViewChild ,EventEmitter, Input, OnDestroy} from '@angular/core';
import { Icon } from 'ionicons/dist/types/components/icon/icon';
import { $$ } from 'protractor';
import { Subscription } from 'rxjs';
import { GoogleMapsService } from 'src/app/services/google-maps/google-maps.service';
import { LocationService } from 'src/app/services/location/location.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit ,OnDestroy {
  @ViewChild('map',{static: true}) mapElementRef: ElementRef;
  googleMaps: any;
  map: any;
  marker: any;
  mapListener: any;
  @Input() update = false
  @Output() location: EventEmitter<any> = new EventEmitter();
  @Input() center ={lat:35.71523495353111  , lng:10.66557691038677};
  constructor( private maps: GoogleMapsService,
               private renderer: Renderer2,
               private locationService: LocationService) { }

  ngOnInit() {

  }

  ngAfterViewInit(){
    this.loadMap();
  }

  async initMap(){
    try{
      if(!this.update) {
      const position = await this.locationService.getCurrentLocation();
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      await this.loadMap();
      this.getAddress(this.center.lat,this.center.lng);
    }else{
      this.loadMap();
    }
    }catch(e){
      console.log(e);
      this.loadMap();
    }
  }

  async loadMap(){
    try{
     let googleMaps: any =await this.maps.loadGoogleMaps();
     this.googleMaps = googleMaps;
     const mapEl= this.mapElementRef.nativeElement;
     const location = new googleMaps.LatLng(this.center.lat,this.center.lng);
     this.map= new googleMaps.Map(mapEl,{
      center: location,
      zoom: 15,
        scaleControl: false,
        streetViewControl: false,
        zoomControl: false,
        overviewMapControl: false,
        mapTypeControl: false,
        mapTypeControlOptions: {
        mapTypeIds: [googleMaps.MapTypeId.ROADMAP, 'SwiggyClone']
      }
      });
      const style= [{
         featureType:'all',
         elementType:'all',
         stylers:[
          {
            saturation: -100
          }
         ]
      }];
      var mapType = new googleMaps.StyledMapType(style, { name: 'Grayscale' });
      this.map.mapTypes.set('SwiggyClone', mapType);
      this.map.setMapTypeId('SwiggyClone');
      this.renderer.addClass(mapEl,'visible');
      this.addMarker(location);
    }catch(e){
      console.log(e);
    }
  }

  addMarker(location) {
    let googleMaps: any = this.googleMaps;
    const icon = {
      url: 'assets/icons/location-pin.png',
      scaledSize: new googleMaps.Size(50, 50), 
    };
    this.marker = new googleMaps.Marker({
      position: location,
      map: this.map,
      icon: icon,
      draggable: true,
      animation: googleMaps.Animation.DROP
    });
    this.mapListener=this.googleMaps.event.addListener(this.addMarker,'dragend',()=>{
      this.getAddress(this.marker.position.lat(),this.marker.position.lng());
    });
  }

  async getAddress(lat, lng) {
    try {
      const result = await this.maps.getAddress(lat,lng);
      console.log(result);
      const loc = {
        locationname: result.address_components[0].short_name,
        address: result.formatted_address,
        lat,
        lng
      };
      console.log(loc);
      this.location.emit(loc);
    } catch(e) {
      console.log(e);
   }
   }

   ngOnDestroy() {
       if(!this.mapListener){
        this.googleMaps.event.removeListener(this.mapListener);
       }
   }

}
