import { Component, Input, OnInit, Output ,EventEmitter} from '@angular/core';
import { Item } from 'src/app/models/item.model';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit {

  @Input() item: Item;
  @Input() index: any;
  @Output() add: EventEmitter<Item> = new EventEmitter();
  @Output() minus: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {}

  quantityPlus()
  { this.add.emit(this.item);}

  quantityMinus(){
    this.minus.emit(this.item);
  }


}
