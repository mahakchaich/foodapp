import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Address } from 'src/app/models/address.model';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private _addresses = new BehaviorSubject<Address[]>([]);

  get addresses(){
    return this._addresses.asObservable();
  }

  constructor(private api: ApiService) { }
  getAddresses(){
    try{
      //user id
      let allAddress: Address[] =this.api.addresses;
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
   currentAdresses.push(
      new Address(
        param.id,
        param.userid,
        param.title,
        param.address,
        param.landmark,
        param.house,
        param.lat,
        param.lng
      )
   );
   this._addresses.next(currentAdresses);

   }

   updateAddresses(id,param){
    param.id=id;
    let currentAdresses = this._addresses.value;
    const index = currentAdresses.findIndex(x =>x.id);
    currentAdresses[index] = new Address(
      id,
      param.userid,
      param.title,
      param.address,
      param.landmark,
      param.house,
      param.lat,
      param.lng
    );
    this._addresses.next(currentAdresses);
   }


   deleteAddresses(param){
    let currentAdresses = this._addresses.value;
    currentAdresses = currentAdresses.filter(x =>x.id !== param.id);
    this._addresses.next(currentAdresses);
  }
}
