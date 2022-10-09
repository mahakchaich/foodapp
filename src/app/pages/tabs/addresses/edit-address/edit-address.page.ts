import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AddressService } from 'src/app/services/address/address.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.page.html',
  styleUrls: ['./edit-address.page.scss'],
})
export class EditAddressPage implements OnInit {
  form: FormGroup;
  // locationname: string = 'Locating...';
  isSubmitted = false;
  location: any ={};
  isLocationFetched: boolean;
  center: any;
  update: boolean;
  id: any;
  isLoading: boolean = false;
  constructor( private addressService: AddressService,
               private global: GlobalService,
               private navCtrl: NavController,
               private route: ActivatedRoute) { }

  ngOnInit() {
    this.checkForUpdate();}

  checkForUpdate() {
    this.isLoading = true;
    this.location.location_name = 'Locating...';
    this.isLocationFetched = false;
    this.route.queryParams.subscribe(async(data) => {
      console.log('data: ', data);
      if(data?.data) {
        const address = JSON.parse(data.data);
        this.center = {
          lat: address.lat,
          lng: address.lng
        };
        this.update = true;
        this.location.lat = this.center.lat;
        this.location.lng = this.center.lng;
        this.location.address = address.address;
        this.location.locationname = address.title;
        this.id = address.id;
        setTimeout(async() => {
          await this.initForm(address);
          this.toggleFetched();
        }, 3000);
      } else {
        this.update = false;
        this.initForm();
      }
    });
  }

  initForm(address?){
    let data: any = {
      title: null,
      house: null,
      landmark: null
    };
    if(address) {
      data = {
        title: address.title,
        house: address.house,
        landmark: address.landmark
      };
    }
    this.formData(data);
  }

    formData(data?){
      this.form = new FormGroup({
        title: new FormControl(data.title, {validators: [Validators.required]}),
        house: new FormControl(data.house, {validators: [Validators.required]}),
        landmark: new FormControl(data.landmark, {validators: [Validators.required]}),
      });
      this.isLoading = false;
    }


  fetchLocation(event){
    this.location = event;
    console.log('location',this.location);
    this.isLocationFetched= true;
  }

  toggleSubmit(){
    this.isSubmitted = !this.isSubmitted;
  }

  toggleFetched(){
    this.isLocationFetched = !this.isLocationFetched;
  }

  async onSubmit(){
   try{
    this.toggleSubmit();
    console.log(this.form);
    if(!this.form.valid || !this.isLocationFetched) {
      this.toggleSubmit();
      return;
    }
   const data ={
    title: this.form.value.title,
    landmark: this.form.value.landmark,
    house: this.form.value.house,
    address: this.form.value.address,
    lat: this.form.value.lat,
    lng: this.form.value.lng,
   };
   console.log('address',data);
   if(!this.id){await this.addressService.addAddresses(data);
  }else{
    await this.addressService.updateAddresses(this.id,data);
  }
   this.navCtrl.back();
   this.toggleSubmit();

   }catch(e){
    console.log(e);
    this.global.errorToast();

   }
  }

}
