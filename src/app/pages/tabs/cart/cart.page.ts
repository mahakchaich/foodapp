import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { IonContent, NavController } from '@ionic/angular';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart/cart.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  @ViewChild(IonContent,{static : false}) content: IonContent;
  urlCheck: any;
  url: any;
  model: any ={};
  instruction: any;
  location: any = {};
  deliveryCharge = 20;
  cartSub: Subscription;
  constructor(
    private router: Router,
    private orderService: OrderService,
    private global: GlobalService,
    private navCtrl: NavController,
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.cartSub = this.cartService.cart.subscribe(cart => {
       this.model = cart;
       if(!this.model) {this.location = {};}
    });
    this.checkUrl();
    this.getData();
  }


  async getData(){
    await this.checkUrl();
    this.location = {
      lat: 28.653831,
      lng: 77.188257,
      address: 'Karol Bagh, New Delhi'
    };
    await this.cartService.getCartData();
  }


  quantityPlus(index){
    this.cartService.quantityPlus(index);
  }

  quantityMinus(index){
    this.cartService.quantityMinus(index);
  }

  // clearCart(){
  //  return Preferences.remove ({key:'cart'});
  // }

  checkUrl(){
    let url: any =this.router.url.split('/');
    console.log('url',url);
    const spliced = url.splice(url.length - 2,2);
    this.urlCheck =spliced[0];
    console.log('urlCheck',this.urlCheck);
    url.push(this.urlCheck);
    this.url = url;
    console.log(this.url);
  }

  getPreviousUrl(){
    return this.url.join('/');
  }

  addAddress(){}
  changeAddress(){}
 async  makePayment(){
   try{
    const data ={
      restaurantid: this.model.restaurant.uid,
      instruction: this.instruction ? this.instruction : '',
      res:this.model.restaurant,
      order:JSON.stringify(this.model.items),
      time: moment().format('lll'),
      address:this.location,
      total: this.model.totalPrice,
      grandTotal:this.model.grandTotal,
      deliveryCharge: this.deliveryCharge,
      status:'Created',
      paid:'COD',
    };
    console.log('order:',data);
    await this.orderService.placeOrders(data);
    //clear cart
    await this.cartService.clearCart();
     this.global.successToast('Your Order is Placed Successfully');
     this.navCtrl.navigateRoot(['tabs/account']);
   }catch(e){
    console.log(e);
   }
  }
  scrollToBottom(){
    this.content.scrollToBottom(500);
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave CartPage');
    if(this.model?.items && this.model?.items.length > 0) {
      this.cartService.saveCart();
    }
  }
}

