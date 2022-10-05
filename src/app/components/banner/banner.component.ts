import { AfterContentChecked, Component, Input, OnInit } from '@angular/core';
//import swiper core and required modules
import SwiperCore,{Pagination,Keyboard, SwiperOptions} from 'swiper';
//install swiper modules
SwiperCore.use([Pagination,Keyboard]);


@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements OnInit,AfterContentChecked {
  @Input() bannerImages !: any[];
  config: SwiperOptions = {
    slidesPerView: 1.1,
    // navigation: true,
    pagination: { clickable: true },
    keyboard:{enabled:true},
    // centeredSlides:true,
  };
  constructor() { }

  ngOnInit() {}
  ngAfterContentChecked(): void {
  }

}
