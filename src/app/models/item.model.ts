export class Item {
    constructor(
        public id: string,
        public uid: string,
        public categoryid: any,
        public cover: string,
        public name: string,
        public description: string,
        public price: number,
        public veg: boolean,
        public status: boolean,
        public variation: boolean,
        public rating: number,
        public quantity?: number
    ) {}

}