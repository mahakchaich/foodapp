import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Address } from 'src/app/models/address.model';
import { AddressService } from 'src/app/services/address/address.service';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.page.html',
  styleUrls: ['./addresses.page.scss'],
})
export class AddressesPage implements OnInit ,OnDestroy{
  isLoading: boolean;
  addresses: Address[] =[];
  model: any = {
     title: 'No Addresses added yet',
     icon: 'location-outline' };
  addressesSub: Subscription;
  constructor(private global: GlobalService,
              private api: ApiService,
              private addressesService: AddressService,
              private router: Router) { }

  ngOnInit() {
    this.addressesSub =this.addressesService.addresses.subscribe(address=>{
      console.log('addresses:',address);
      this.addresses =address;
    });
    this.getAdresses();
  }

  getAdresses(){
    this.isLoading=true;
    this.global.showLoader();
    setTimeout(()=>{
       this.addressesService.getAddresses();
      this.isLoading=false;
    this.global.hideLoader();
    },3000);

  }
  editAddress(address){
    console.log(address);
    const navData: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(address)
      }
    };
    this.router.navigate([this.router.url, 'edit-address'], navData);
  }
   deleteAddress(address){
    console.log('address',address);
    this.global.showAlert(
      'are you sure you want to delete this address ?',
      'Confirm',
      [
        {
          text: 'No',
          role: 'cancel',
          handler: ()=>{
            console.log('cancel');
            return;
          }
        },
        {
          text: 'Yes',
          handler:async ()=>{
          this.global.showLoader();
          await  this.addressesService.deleteAddresses(address);
          this.global.hideLoader() ;
          }

        }
      ]
    );
  }


  getIcon(title){
    return this.global.getIcon(title);
  }
  ngOnDestroy(){
    if(this.addressesSub){ this.addressesSub.unsubscribe();}
 }
}
