export class Restaurant{
    constructor(
        public uid: string,
        public cover: string,
        public name: string,
        public shortname: string,
        public cuisines: string[],
        public rating: number,
        public delivarytime: number,
        public price: number,
        public distance?: number,
        public address?: string,
        public city?: string,
        public closeTime?: string,
        public description?: string,
        public email?: string,
        public phone?: number,
        public isClose?: boolean,
        public latitude?: number,
        public longitude?: number,
        public openTime?: string,
        public status?: string,
        public totalRating?: number,

    ){}
}