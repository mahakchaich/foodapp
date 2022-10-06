import { Component, IterableDiffers, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { element } from 'protractor';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { take } from 'rxjs/operators';
import { Restaurant } from 'src/app/models/restaurant.model';
import { Category } from 'src/app/models/category.model';
import { Item } from 'src/app/models/item.model';

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit ,OnDestroy {
  id: any;
  isLoading: boolean;
  data= {} as Restaurant;
  veg: boolean = false;
  cartData: any ={};
  model ={
    icon: 'fast-food-outline',
    title:'No Menu Availble',
  };
  storeData: any={};
  items: Item[] =[];
  // restaurants=[];
  categories: Category[] = [];
  allItems: Item[] = [];
  cartSub: Subscription;
  routeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private router: Router,
    private api: ApiService,
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.routeSub=this.route.paramMap.pipe(take(1)).subscribe(paramMap => {
      console.log('route data: ', paramMap);
      if(!paramMap.has('restaurantId')) {
        this.navCtrl.back();
        return;
      }
      this.id = paramMap.get('restaurantId');
      console.log('id: ', this.id);
    });
    this.cartSub = this.cartService.cart.subscribe(cart => {
      console.log('cart items: ', cart);
      this.cartData = {};
      this.storeData = {};
      if(cart && cart?.totalItem > 0) {
        this.storeData = cart;
        // this.cartData.items = this.storedData.items;
        this.cartData.totalItem = this.storeData.totalItem;
        this.cartData.totalPrice = this.storeData.totalPrice;
        if(cart?.restaurant?.uid === this.id) {
          this.allItems.forEach(element => {
            cart.items.forEach(element2 => {
              if(element.id !== element2.id) return;
              element.quantity = element2.quantity;
            });
          });
          console.log('allitems: ', this.allItems);
          this.cartData.items = this.allItems.filter(x => x.quantity > 0);
          if(this.veg === true) {this.items = this.allItems.filter(x => x.veg === true);}
          else {this.items = [...this.allItems];}
        } else {
          this.allItems.forEach(element => {
              element.quantity = 0;
          });
          if(this.veg === true) {this.items = this.allItems.filter(x => x.veg === true);}
          else {this.items = [...this.allItems];}
        }
      }
      // else {
      //   this.storedData = {};
      //   this.cartData = {};

      // }
    });
    this.getitems();
  }



async getitems(){
  try {
    this.isLoading = true;
    this.data = {} as Restaurant;
    this.cartData = {};
    this.storeData = {};
    setTimeout(async () => {
      // this.categories = this.api.categories;
      this.allItems = this.api.allItems;
      let data: any = this.api.restaurants1.filter(x => x.uid === this.id);
      this.data = data[0];
      this.categories = this.api.categories.filter(x => x.uid === this.id);
      this.allItems = this.api.allItems.filter(x => x.uid === this.id);
      this.allItems.forEach((element,index) => {
        this.allItems[index].quantity = 0;
      });
      this.items = [...this.allItems];
      console.log('restaurant: ', this.data);
      await this.cartService.getCartData();
      this.isLoading = false;
    }, 3000);
  } catch(e) {
    console.log(e);
  }
}


  async vegOnly(event){
    console.log(event.detail.checked);
    this.items =[];
    if(event.detail.checked === true)
     {this.items = this.allItems.filter(x => x.veg === true);}
     else{
      this.items =this.allItems;
      console.log('items:',this.items);
     }
}

quantityPlus(item){
  const index = this.allItems.findIndex(x => x.id === item.id);
  console.log(index);
  if(!this.allItems[index].quantity || this.allItems[index].quantity === 0) {
    if(!this.storeData.restaurant || (this.storeData.restaurant && this.storeData.restaurant.uid === this.id)) {
      console.log('index item: ', this.allItems);
      this.cartService.quantityPlus(index, this.allItems,this.data);
    } else {
      // alert for clear cart
      this.cartService.alertClearCart(index, this.allItems, this.data);
    }
  } else {
    this.cartService.quantityPlus(index, this.allItems,this.data);
  }
}
quantityMinus(item){
  const index = this.allItems.findIndex(x => x.id === item.id);
  this.cartService.quantityMinus(index,this.allItems);
}

saveToCart(){
try{
 this.cartData.restaurant ={};
 this.cartData.restaurant =this.data;
 console.log('cartData',this.cartData);
  this.cartService.saveCart();
}catch(e){
  console.log(e);
}
}
async viewCart(){
  console.log('save cartdata: ', this.cartData);
  if(this.cartData.items && this.cartData.items.length > 0) {await this.saveToCart();}
  console.log('router url: ', this.router.url);
  this.router.navigate([this.router.url + '/cart']);
 }

 async ionViewWillLeave() {
  console.log('ionViewWillLeave ItemsPage');
  if(this.cartData?.items && this.cartData?.items.length > 0)  {await this.saveToCart();}
  // if(this.routeSub) {this.routeSub.unsubscribe();}
 }

ngOnDestroy() {
  if(this.cartSub) {this.cartSub.unsubscribe();}
}
}

