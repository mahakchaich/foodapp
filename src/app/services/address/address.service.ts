import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Address } from 'src/app/models/address.model';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  redius =7;

  private _addresses = new BehaviorSubject<Address[]>([]);
  private _addressChange = new BehaviorSubject<Address>(null);

  get addressChange(){
    return this._addressChange.asObservable();
  }

  get addresses(){
    return this._addresses.asObservable();
  }

  constructor(private api: ApiService) { }
  getAddresses(limit?){
    try{
      let allAddress: Address[] =this.api.addresses;
      console.log(allAddress);
      //user id
      if(limit){
     let address: Address[] = [];
     let length = limit;
     if(allAddress.length <limit) {
      length=allAddress.length;
     }
     for(let i= 0;i<length;i++){
      address.push(allAddress[i]);
     }
     allAddress = address;
    }
    this._addresses.next(allAddress);

    }catch(e){
      console.log(e);
      throw(e);
    }
  }

   addAddresses(param){
    param.id = 'address1';
    param.userid= 'user1';
   const currentAdresses = this._addresses.value;
   const data = new Address(
    param.id,
    param.userid,
    param.title,
    param.address,
    param.landmark,
    param.house,
    param.lat,
    param.lng
  );
   currentAdresses.push(data);
   this._addresses.next(currentAdresses);
   this._addressChange.next(data);

   }

   updateAddresses(id,param){
    param.id=id;
    let currentAdresses = this._addresses.value;
    const index = currentAdresses.findIndex(x =>x.id);
    const data = new Address(
      id,
      param.userid,
      param.title,
      param.address,
      param.landmark,
      param.house,
      param.lat,
      param.lng
    );
    currentAdresses[index] = data;
    this._addresses.next(currentAdresses);
    this._addressChange.next(data);
   }


   deleteAddresses(param){
    let currentAdresses = this._addresses.value;
    currentAdresses = currentAdresses.filter(x =>x.id !== param.id);
    this._addresses.next(currentAdresses);
  }

  changeAddress(address){
    this._addressChange.next(address);
  }

  async checkExistAddress(location?){
    console.log('check exist address',location);
    let loc: Address = location;
    const address = await this.api.addresses.find(x=> x.lat=== location.lat && x.lng === location.lng);
    console.log(loc);
    if(address){ loc=address;}
    this.changeAddress(address);
    // if(address){
    //   this.changeAddress(address);
    //   return true;
    // }else{
    //   return null;
    // }
    // if(!address){}
  }
}
