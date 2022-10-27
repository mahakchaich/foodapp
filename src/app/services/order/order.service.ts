import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Order } from 'src/app/models/order.model';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  uid: string;

  private _orders = new BehaviorSubject<Order[]>([]);

  get orders(){
    return this._orders.asObservable();
  }

  constructor(private api: ApiService,
              private auth: AuthService) { }


  getRadius(){
    return this.api.radius;
  }

  async getUid() {
    if(!this.uid) return await this.auth.getId();
    else return this.uid;
  }


  async getOrderRef() {
    this.uid = await this.getUid();
    return this.api.collection('orders').doc(this.uid).collection('all');
  }

  async getOrders() {
    try {
      const orders: Order[] = await (await this.getOrderRef()).get().pipe(
        switchMap(async(data: any) => {
          let itemData = await data.docs.map(element => {
            let item = element.data();
            item.id = element.id;
            item.order = JSON.parse(item.order);
            item.restaurant.get()
            .then(rData => {
              item.restaurant = rData.data();
            })
            .catch(e => { throw(e); });
            return item;
          });
          console.log(itemData);
          return itemData;
        })
      )
      .toPromise();
      console.log('orders', orders);
      this._orders.next(orders);
    } catch(e) {
      throw(e);
    }
  }
  async placeOrders(param){
   try{
    let data ={...param};
    data.order = JSON.stringify(param.order);
    const uid = await this.getUid();
    data.restaurant = await this.api.firestore.collection('restaurants').doc(param.restaurantid);
    const orderRef = await (await this.getOrderRef()).add(data);
    const orderid = await orderRef.id;
    // let currentOrders = this._orders.value;
    let currentOrders: Order[] = [];
    currentOrders.push(new Order(
      param.address,
      param.restaurant,
      param.restaurantid,
      param.order,
      param.total,
      param.grandTotal,
      param.deliveryCharge,
      param.status,
      param.time,
      param.paid,
      orderid,
      uid,
      param.instruction,
    ));
    currentOrders=currentOrders.concat(this._orders.value);
    this._orders.next(currentOrders);
   }catch(e){
    throw(e);
   }
  }
  updateOrder(param){}
}
