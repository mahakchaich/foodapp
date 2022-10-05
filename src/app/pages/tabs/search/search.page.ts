import { Component, OnInit, ViewChild } from '@angular/core';
import { element } from 'protractor';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  @ViewChild('searchInput') sInput;
  model: any = {
    icon: 'search-outline',
    title:'No Restaurants Record Found',
  };
  query: any;
  isLoading: boolean;
  allRestaurants: any[] = [];
  restaurants: any[]=[];
  constructor( private api: ApiService) { }

  ngOnInit() {
    setTimeout(()=>{
      this.allRestaurants = this.api.allRestaurants;
      this.sInput.setFocus();
    },500);
  }
  async onSearchChange(event){
    console.log(event.detail.value);
    this.query=event.detail.value.toLowerCase();
    this.restaurants = [];
    if(this.query.length > 0){
      this.isLoading=true;
    setTimeout(async ()=>{
      this.restaurants =await this.allRestaurants.filter((element: any) => {
        return element.shortname.includes(this.query); 
      });
      console.log(this.restaurants);
      this.isLoading=false;
    },3000);
    }
    }
  }


