import { Address } from "./address.model";
import { Item } from "./item.model";
import { Restaurant } from "./restaurant.model";

export class Order{
    constructor(

        public address: Address,
        public restaurant: Restaurant,
        public order: Item[],
        public paid: string,
        public grandTotal: number,
        public deliveryCharge: number,
        public status: string,
        public time: string,
        public total: number,
        public restaurantid: string,
        public instruction?: string,
        public userid?: string,
        public id?: string,

    ){}
}


