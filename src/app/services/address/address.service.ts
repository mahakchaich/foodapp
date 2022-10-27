import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Address } from 'src/app/models/address.model';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  uid: string;

  private _addresses = new BehaviorSubject<Address[]>([]);
  private _addressChange = new BehaviorSubject<Address>(null);

  get addressChange(){
    return this._addressChange.asObservable();
  }

  get addresses(){
    return this._addresses.asObservable();
  }

  constructor(private api: ApiService,
              private auth: AuthService) { }


  async getUId(){
    return await this.auth.getId();
  }

  async getAddressRef(query?) {
    if(!this.uid){ this.uid = await this.getUId();}
    return await this.api.collection('address').doc(this.uid).collection('all', query);
  }


  async getAddresses(limit?) {
    try {
      let addressRef;
      if(limit) {addressRef = await this.getAddressRef(ref => ref.limit(limit));}
      else {addressRef = await this.getAddressRef();}
      const allAddress: Address[] = await addressRef.get().pipe(
        switchMap(async(data: any) => {
          let itemData = await data.docs.map(element => {
            let item = element.data();
            item.id = element.id;
            return item;
          });
          console.log(itemData);
          return itemData;
        })
      )
      .toPromise();
      console.log(allAddress);
      this._addresses.next(allAddress);
    } catch(e) {
      console.log(e);
      throw(e);
    }
  }


   async addAddresses(param){
    try{
      const currentAdresses = this._addresses.value;
      const data = new Address(
       this.uid? this.uid : await this.getUId(),
       param.title,
       param.address,
       param.landmark,
       param.house,
       param.lat,
       param.lng,
     );
      let addressData = Object.assign({},data);
      delete addressData.id;
      const response = await (await this.getAddressRef()).add(addressData);
      console.log(response);
      const id = await response.id;
      const address={...addressData,id};
      currentAdresses.push(address);
      this._addresses.next(currentAdresses);
      this._addressChange.next(address);
    }catch(e){
        throw(e);
    }
   }

   async updateAddresses(id,param){
    try{
      await (await this.getAddressRef()).doc(id).update(param);
      let currentAdresses = this._addresses.value;
      const index = currentAdresses.findIndex(x =>x.id);
      const data = new Address(
        param.userid,
        param.title,
        param.address,
        param.landmark,
        param.house,
        param.lat,
        param.lng,
        id,
      );
      currentAdresses[index] = data;
      this._addresses.next(currentAdresses);
      this._addressChange.next(data);

    }catch(e){
      throw(e);
    }
   }


   async deleteAddresses(param){
    try{
      await(await this.getAddressRef()).doc(param.id).delete();
      let currentAdresses = this._addresses.value;
      currentAdresses = currentAdresses.filter(x =>x.id !== param.id);
      this._addresses.next(currentAdresses);
    }catch(e){
      throw (e);
    }
  }

  changeAddress(address){
    this._addressChange.next(address);
  }

  async checkExistAddress(location?){
    try{
      console.log('check exist address',location);
      let loc: Address = location;
      const addresses: Address[] = await (await this.getAddressRef(ref =>ref.where('lat','==',location.lat).where('lng','==',location.lng))
      ).get().pipe(
        switchMap(async(data: any) => {
          let itemData = await data.docs.map(element => {
            let item = element.data();
            item.id = element.id;
            return item;
          });
          console.log(itemData);
          return itemData;
        })
      )
      .toPromise();
      console.log('addresses',addresses);
      if(addresses?.length> 0){
        loc=addresses[0];
      }
      // const address = await this.api.addresses.find(x=> x.lat=== location.lat && x.lng === location.lng);
      // if(address){ loc=address;}
      console.log('loc',loc);
      this.changeAddress(loc);
    }catch(e){
      throw(e);
    }
  }
}
