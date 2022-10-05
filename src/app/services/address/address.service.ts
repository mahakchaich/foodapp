import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private _addresses = new BehaviorSubject<any>(null);

  get addresses(){
    return this._addresses.asObservable();
  }

  constructor(private api: ApiService) { }
  getAddresses(){
    try{
      //user id
      let allAddress: any[] =this.api.addresses;
      this._addresses.next(allAddress);

    }catch(e){
      console.log(e);
      throw(e);
    }
  }

   addAddresses(param){}
   updateAddresses(id,param){}
   deleteAddresses(param){
    param.delete = true;
    this._addresses.next(param);
  }
}
