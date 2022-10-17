import { getLocaleDateFormat } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { title } from 'process';
import { Subscription } from 'rxjs';
import { SearchLocationComponent } from 'src/app/components/search-location/search-location.component';
import { Address } from 'src/app/models/address.model';
import { Restaurant } from 'src/app/models/restaurant.model';
import { AddressService } from 'src/app/services/address/address.service';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { GoogleMapsService } from 'src/app/services/google-maps/google-maps.service';
import { LocationService } from 'src/app/services/location/location.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit ,OnDestroy {
  banners: any[]=[];
  restaurants: Restaurant[]=[];
  isLoading: boolean ;
  location = {} as Address;
  addressSub: Subscription;
  constructor( private api: ApiService,
               private addressService: AddressService,
               private global: GlobalService,
               private mapService: GoogleMapsService,
               private locationService: LocationService,
               private router: Router) { }

  ngOnInit() {
    this.addressService.addressChange.subscribe(address =>{
      if(address && address?.lat){
        if(!this.isLoading){this.isLoading=true;}
        this.location= address;
        // this.nearbyApiCall(address.lat, address.lng);
        this.nearbyApiCall();
      }else{
        if(address &&(!this.location || this.location?.lat)){
          this.searchLocation('home','home-modal');
        }
      }
    },e=>{
      console.log(e);
      this.isLoading = false;
      this.global.errorToast();
    }
    );
    this.isLoading =true;
    this.getBanners();
    if(!this.location?.lat) {
      this.getNearbyRestaurants();
    }
  }


  getBanners() {
    this.banners = this.api.banners;
  }

  nearbyApiCall(){
    console.log(this.location);
    this.isLoading= false;
    this.restaurants=this.api.restaurants;
  }


  async getNearbyRestaurants(){
    try{
     const position = await this.locationService.getCurrentLocation();
     const {latitude,longitude}=position.coords;
    const address =await  this.mapService.getAddress(latitude,longitude);
    if(address){
      this.location = new Address(
        '',
        '',
        address.address_components[0].short_name,
        address.formatted_address,
        '',
        '',
        latitude,
        longitude,
      );
      await this.getData();
    }
    //  await this.getData(latitude, longitude);
      console.log(this.restaurants);
      this.isLoading =false;
    }catch(e){
      console.log(e);
      this.isLoading = false;
      this.searchLocation('home');
    }
  }


  async getData(){
    try{
      this.restaurants=[];
      // const address = await this.addressService.checkExistAddress(lat,lng,this.location);
      const address = await this.addressService.checkExistAddress(this.location);
      console.log('address change',address);
      // if(!address){await this.nearbyApiCall(lat,lng);}

    }catch(e){
      console.log(e);
      this.global.errorToast();
    }
  }

  async searchLocation(prop, className?){
    try{
      const options={
        component: SearchLocationComponent,
        cssClass: className ? className : '',
        backdropDismiss: prop === 'select-place' ? true : false,
        componentProps: {
          from: prop
         }
      };
      const modal = await this.global.createModel(options);
      if(modal) {
        if(modal === 'add') {
          this.addAddress(this.location);
        } else if(modal === 'select') {
          this.searchLocation('select-place');
        } else {
          this.location = modal;
          await this.getData();
        }
      }
    } catch(e) {
      console.log(e);
    }

  }
  addAddress(val?){
    let navData: NavigationExtras;
    if(val) {
      val.from = 'home';
    } else {
      val = {
        from: 'home'
      };
    }
    navData = {
      queryParams: {
        data: JSON.stringify(val)
      }
    }
      this.router.navigate(['/', 'tabs', 'addresses', 'edit-address'],navData);
    }
  ngOnDestroy() {
    if(this.addressSub) {this.addressSub.unsubscribe();}
  }
}
