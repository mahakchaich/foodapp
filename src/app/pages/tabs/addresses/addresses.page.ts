import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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
  addresses: any[] =[];
  model: any = {
     title: 'No Addresses added yet',
     icon: 'location-outline' };
  addressesSub: Subscription;
  constructor(private global: GlobalService,
              private api: ApiService,
              private addressesService: AddressService) { }

  ngOnInit() {
    this.addressesSub =this.addressesService.addresses.subscribe(address=>{
      console.log('addresses:',address);
      if(address instanceof Array)
      {this.addresses=address;}
      else{
        if(address?.delete){
          this.addresses = this.addresses.filter(x =>x.id !== address.id);
        }else if(address?.update){
          const index = this.addresses.findIndex(x =>x.id !== address.id);
          this.addresses[index] = address;
        }else{
          this.addresses = this.addresses.concat(address);
        }
        }
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
  editAddress(address){}
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
