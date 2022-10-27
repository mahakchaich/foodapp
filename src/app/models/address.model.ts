export class Address{
    constructor(
        public uid: string,
        public title: string,
        public address: string,
        public landmark: string,
        public house: string,
        public lat: number,
        public lng: number,
        public id?: string,
    ){}
}

