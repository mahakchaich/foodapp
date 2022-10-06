export class Item{
    constructor(
        public id: string,
        public uid: string,
        public categoryid: string,
        public cover: string,
        public desc: string,
        public name: string,
        public price: number,
        public rating: number,
        public status: boolean,
        public variation: boolean,
        public veg: boolean,
        public quantity?: number,
    ){}
}

