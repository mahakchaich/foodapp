import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-restaurant-detail',
  templateUrl: './restaurant-detail.component.html',
  styleUrls: ['./restaurant-detail.component.scss'],
})
export class RestaurantDetailComponent implements OnInit {
@Input() data: any;
@Input() isLoading;
  constructor() { }

  ngOnInit() {}
  getCuisine(cuisine){
    return cuisine.join(',');}

}
