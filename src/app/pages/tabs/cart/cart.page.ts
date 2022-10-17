import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { IonContent, NavController } from '@ionic/angular';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { SearchLocationComponent } from 'src/app/components/search-location/search-location.component';
import { Address } from 'src/app/models/address.model';
import { Cart } from 'src/app/models/cart.model';
import { Order } from 'src/app/models/order.model';
import { AddressService } from 'src/app/services/address/address.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit , OnDestroy {
  @ViewChild(IonContent,{static : false}) content: IonContent;
  urlCheck: any;
  url: any;
  model ={} as Cart;
  instruction: any;
  location= {} as Address ;
  deliveryCharge = 20;
  cartSub: Subscription;
  addressSub: Subscription;
  constructor(
    private router: Router,
    private orderService: OrderService,
    private global: GlobalService,
    private navCtrl: NavController,
    private cartService: CartService,
    private addressService: AddressService
  ) { }

  async ngOnInit() {
    await this.getData();
    this.addressSub =this.addressService.addressChange.subscribe(async(address) =>{
      console.log('location cart:',address);
      this.location = address;
      if(this.location?.id && this.location?.id !== ''){
        const raduis= this.addressService.redius;
        const result= await this.cartService.checkCart(this.location.lat,this.location.lng,raduis);
        console.log(result);
        if(!result){
          this.global.errorToast('Location is too far from the restaurant',5000);
           this.cartService.clearCart();
        }
          }
    });
    this.cartSub = this.cartService.cart.subscribe(cart => {
       this.model = cart;
       if(!this.model) {this.location = {} as Address ;}
    });
    this.checkUrl();
    this.getData();
  }


  async getData(){
    await this.checkUrl();
    // this.location = {
    //   lat: 28.653831,
    //   lng: 77.188257,
    //   address: 'Karol Bagh, New Delhi',
    //   userid: 'user1',

    // };
    // this.location = new Address(
    //   'address1',
    //   'userid1',
    //   'Address 1',
    //   'ouardanine, monastir',
    //   '',
    //   '',
    //   28.653831,
    //   77.188257,
    // );
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

  addAddress(location?){
    let url: any;
    let navData: NavigationExtras;
    if(location){
      location.from = 'cart';
      navData = {
        queryParams: {
          data: JSON.stringify(location)
        }
      }
    }
    if(this.urlCheck === 'tabs'){
      url = ['/','tabs','addresses','edit-address'];}
    else{
      url= [this.router.url,'addresses','edit-address'];
    }
    this.router.navigate(url, navData);

  }


   async changeAddress(){
    try{
      const options ={
        component: SearchLocationComponent,
        swipeToClose: true,
        cssClass:'custom-modal',
        componentProps:{
          from: 'cart'
        }
      };
      const address =await this.global.createModel(options);
      if(address){
        if(address === 'add'){ this.addAddress();}
          await this.addressService.changeAddress(address);
      }
    }catch(e){
      console.log(e);
    }
  }


 async  makePayment(){
   try{
    const data: Order ={
      restaurantid: this.model.restaurant.uid,
      instruction: this.instruction ? this.instruction : '',
      restaurant:this.model.restaurant,
      order:(this.model.items),
      // order:JSON.stringify(this.model.items),
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
    this.model = {} as Cart;
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

  ngOnDestroy(){
      console.log('Destroy cartPage');
      if(this.addressSub){
        this.addressSub.unsubscribe();
      }
      if(this.cartSub){
        this.cartSub.unsubscribe();
      }
  }
}

