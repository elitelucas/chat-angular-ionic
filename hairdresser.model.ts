import { Creneau } from './creneau.model';

export class Hairdresser {
    constructor(
      public id: string,
      public email: string,
      public lastname: string,
      public firstname: string,
      public gender : string,
      public phone : number,
      public city: string,
      public address: string,
      public avatar: string,
      public finalnote: number,
      public nbreview: number     
    ) {}
  }