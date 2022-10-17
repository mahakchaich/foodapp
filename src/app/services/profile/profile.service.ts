import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private _profile = new BehaviorSubject<User>(null);

  get profile(){
    return this._profile.asObservable();
  }
  constructor(private authService: AuthService,
              private apiService: ApiService) { }

 async updateProfile(profile,param){
    try{
      const uid = await this.authService.getId();
      const result= await this.apiService.collection('users').doc(uid).update(param);
      if(profile.email !== param.email){
        const updateResult= await this.authService.updateEmail(profile.email,param.email,'12345678');
      }
      const data = new User(
        param.email,
        param.phone,
        profile.name,
        profile.uid,
        profile.type,
        profile.status
      );
      this._profile.next(data);
    }catch(e){
      console.log(e);
      throw(e);
    }
  }

  async getProfile(){
    const uid =await this.authService.getId();
    const profile: any =( await (this.apiService.collection('users').doc(uid).get().toPromise())).data();
    console.log('profile:',profile);
    const data = new User(
        profile.email,
        profile.snapshotChanges,
        profile.name,
        uid,
        profile.type,
        profile.status,
    );
    this._profile.next(profile);
  }

  async updateProfileWithEmail(profile, param, password) {
    try {
      await this.authService.updateEmail(profile.email, param.email, password);
      await this.updateProfile(profile, param);
    } catch(e) {
      throw(e);
    }
  }
}
