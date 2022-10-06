import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Order } from 'src/app/models/order.model';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private _orders = new BehaviorSubject<Order[]>([]);

  get orders(){
    return this._orders.asObservable();
  }

  constructor(private api: ApiService) { }

  getOrders(){
   try{
    const orders = this.api.orders;
    console.log('orders',orders);
    this._orders.next(orders);
   }catch(e){
    throw(e);
   }
  }
  placeOrders(param){
   try{
    param.userid ='1';
    // param.order = JSON.stringify(param.order);
    // param.order = JSON.parse(param.order);
    param.id ='5dsscdfusd8hg';
    // let currentOrders = this._orders.value;
    let currentOrders: Order[] = [];
    currentOrders.push(new Order(
      param.address,
      param.restaurant,
      param.order,
      param.total,
      param.grandTotal,
      param.deliveryCharge,
      param.status,
      param.time,
      param.paid,
      param.restaurantid,
      param.id,
      param.userid,
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
