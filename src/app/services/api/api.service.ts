import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Address } from 'src/app/models/address.model';
import { Category } from 'src/app/models/category.model';
import { Item } from 'src/app/models/item.model';
import { Order } from 'src/app/models/order.model';
import { Restaurant } from 'src/app/models/restaurant.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private adb: AngularFirestore){}

  collection(path) {
    return this.adb.collection(path);
  }

  banners=[
    {banner:'assets/imgs/1.jpg'},
    {banner:'assets/imgs/2.jpg'},
    {banner:'assets/imgs/3.jpg'}
  ];
  restaurants: Restaurant[]=[
    {uid:'12',
     cover:'assets/imgs/1.jpg',
     name:'stayfit2',
     shortname:'stayfit2',
     cuisines:[
      'Italian',
      'Mexican'
     ],
     rating:5,
     delivarytime:25,
     distance:2.5,
     price:100,
     latitude:28.652571380345652,
     longitude:77.23231802197634,
    },
    {uid:'13',
    cover:'assets/imgs/2.jpg',
    name:'stayfit2',
    shortname:'stayfit2',
    cuisines:[
     'Italian',
     'Mexican'
    ],
    rating:5,
    delivarytime:25,
    distance:2.5,
    price:100
   },
   {uid:'14',
   cover:'assets/imgs/3.jpg',
   name:'stayfit2',
   shortname:'stayfit2',
   cuisines:[
    'Italian',
    'Mexican'
   ],
   rating:5,
   delivarytime:25,
   distance:2.5,
   price:100
  },
  ];

  allRestaurants: Restaurant[] = [
    {uid:'12',
     cover:'assets/imgs/1.jpg',
     name:'stayfit2',
     shortname:'stayfit2',
     cuisines:[
      'Italian',
      'Mexican'
     ],
     rating:5,
     delivarytime:25,
     price:100,
     latitude:28.652571380345652,
     longitude:77.23231802197634,
    },
    {uid:'13',
    cover:'assets/imgs/2.jpg',
    name:'stayfit2',
    shortname:'stayfit2',
    cuisines:[
     'Italian',
     'Mexican'
    ],
    rating:5,
    delivarytime:25,
    price:100
   },
   {uid:'14',
   cover:'assets/imgs/3.jpg',
   name:'stayfit2',
   shortname:'stayfit2',
   cuisines:[
    'Italian',
    'Mexican'
   ],
   rating:5,
   delivarytime:25,
   price:100
  },
  ];

  allItems: Item[] = [
    {
        categoryid: "e00",
        cover: "assets/imgs/pizza.jpg",
        desc: "Great in taste",
        id: "i1",
        name: "Pizza",
        price: 120,
        rating: 0,
        status: true,
        uid: "12",
        variation: false,
        veg: false
    },
    {
        categoryid: "e0",
        cover: "assets/imgs/salad.jpg",
        desc: "Great in taste",
        id: "i2",
        name: "Caprese Salad",
        price: 200,
        rating: 0,
        status: true,
        uid: "12",
        variation: false,
        veg: true
    },
    {
        categoryid: "e00",
        cover: "assets/imgs/pasta.jpg",
        desc: "Great in taste",
        id: "i3",
        name: "Pasta",
        price: 150,
        rating: 0,
        status: true,
        uid: "12",
        variation: false,
        veg: false
    },
    {
      categoryid: "e0",
      cover: "assets/imgs/salad.jpg",
      desc: "Great in taste",
      id: "i2",
      name: "Caprese Salad",
      price: 200,
      rating: 0,
      status: true,
      uid: "13",
      variation: false,
      veg: true
  },
  ];

  restaurants1: Restaurant[]=[
    {uid:'12',
     cover:'assets/imgs/1.jpg',
     name:'stayfit2',
     shortname:'stayfit2',
     address:'Karolbags, NewYork',
     cuisines:[
      'Italian',
      'Mexican'
     ],
     rating:5,
     delivarytime:25,
     distance:2.5,
     price:100,
     latitude:28.652571380345652,
     longitude:77.23231802197634,
    },
    {uid:'13',
    cover:'assets/imgs/2.jpg',
    name:'stayfit2',
    shortname:'stayfit2',
    address:'Karolbags, NewYork',
    cuisines:[
     'Italian',
     'Mexican'
    ],
    rating:5,
    delivarytime:25,
    distance:2.5,
    price:100
   },
   {uid:'14',
   cover:'assets/imgs/3.jpg',
   name:'stayfit2',
   shortname:'stayfit2',
   address:'Karolbags, NewYork',
   cuisines:[
    'Italian',
    'Mexican'
   ],
   rating:5,
   delivarytime:25,
   distance:2.5,
   price:100
  },
  ];


  categories: Category[] = [
    {
      id: "e00",
      name: "Italian",
      uid: "12"
    },
    {
      id: "e0",
      name: "Mexican",
      uid: "12"
    },
    {
      id: "e0",
      name: "Mexican",
      uid: "13"
    },
  ];
  addresses: Address[]=[
    {address: "Fancy Bazaar, India", house: "2nd Floor", id: "7Kox63KlggTvV7ebRKar", landmark: "Fancy Bazar", lat: 26.1830738, lng: 91.74049769999999, title: "Fancy", userid: "1"},
    {address: "Kanuat palace, India", house: "Ground Floor", id: "8Kox63KlggTvV7ebRKar", landmark: "Bazar", lat: 26.1830738, lng: 91.74049769999999, title: "Work", userid: "1"}
  ];

  orders: Order[]=[
    // {
    //   address: {address: "Indira Nagar Rd, Borsojai, Basistha 781029, India", house: "dsgd", id: "cLQdnS8YXk5HTDfM3UQC", landmark: "fdgs", lat: 26.108991978867923, lng: 91.79069981213378, title: "yui", userid: "1" }, 
    //   deliveryCharge: 20,
    //   grandTotal: 540.00,
    //   id: "5aG0RsPuze8NX00B7uRP",
    //   order: [
    //     {categoryid: "e0",cover: "assets/imgs/pizza.jpg",desc: "Great in taste",id: "i1",name: "Pizza",price: 120,rating: 0,status: true,uid: "12",variation: false,veg: false , quantity:1 },
    //   ],
    //   paid: "COD",  
    //    restaurant:
    //   //  {address: "Christan Basti, India",  city: "909090567", closeTime: "21:00", cover: "assets/imgs/1.jpg", cuisines: ["Caribbean food", "North Indian", "Vietnamese"], delivery_time: 25, description: "dd", email: "DosaPlaza@gmail.com", latitude: 26.1286243, longitude: 91.8012675, uid: "12", isClose: true, name: "DosaPlaza", openTime: "07:00", phone: 6619563867, price: 27, rating: 4.7, short_name: "stayfit", status: "open", totalRating: 13},
    //   {
    //     uid: '12wefdefsdss',
    //     cover: 'assets/imgs/2.jpg',
    //     name: 'Stayfit1',
    //     shortname: 'stayfit1',
    //     cuisines: [
    //       'Italian',
    //       'Mexican'
    //     ],
    //   rating:5,
    //   delivarytime:25,
    //   distance:2.5,
    //   price:100
    //  },
    //   uid: "12",  
    //   status: "created",
    //   time: "Jul 6, 2020 11:44 AM",
    //   total: 520.00,
    //   userid: "1"
    // },
    {
      address: {address: "Indira Nagar Rd, Borsojai, Basistha 781029, India", house: "dsgd", id: "cLQdnS8YXk5HTDfM3UQC", landmark: "fdgs", lat: 26.108991978867923, lng: 91.79069981213378, title: "yui", userid: "1" }, 
      deliveryCharge: 20,
      grandTotal: 440.00,
      id: "5aG0RsPuze8NX00B7uR1",
      order: [
        {categoryid: "e00", cover: "assets/imgs/pizza.jpg", desc: "Great in taste", id: "i1", name: "Pizza", price: 120, quantity: 1, rating: 0, status: true, uid: "12", variation: false, veg: false},
        {categoryid: "e00", cover: "assets/imgs/pasta.jpg", desc: "Great in taste", id: "i2", name: "Pasta", price: 150, quantity: 2, rating: 0, status: true, uid: "12", variation: false, veg: false}
      ],
      paid: "COD",  
      restaurant: {address: "Beltola Tiniali, India", city: "909090271", closeTime: "20:00", cover: "assets/imgs/restaurant-1.jpg", cuisines: ["Italian", "Mexican"], delivarytime: 25, description: "dd", email: "stay@fit.com", uid: "12", isClose: true, latitude: 26.1286243, longitude: 91.8012675, name: "Stayfit", openTime: "08:00", phone: 6786745745, price: 25, rating: 0, shortname: "stayfit", status: "open", totalRating: 0},   
      restaurantid: "12",  
      status: "Delivered",
      time: "Jul 7, 2020 11:44 AM",
      total: 420.00,
      userid: "1"
    }
  ];

  }
