import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from 'src/app/models/user.model';
import { ApiService } from '../api/api.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private storage: StorageService,
              private fireAuth: AngularFireAuth,
              private apiService: ApiService,
              private adb: AngularFirestore) { }


async login(email: string,password: string): Promise<any>{
try{
  const response= await this.fireAuth.signInWithEmailAndPassword(email,password);
  console.log(response);
  if(response.user){
    this.setUserData(response.user.uid);
  }
}catch(e){
  throw(e);
}
}

async getId(){
  return(await this.storage.getStorage('uid')).value;
}

setUserData(uid){
  this.storage.setStorage('uid',uid);
}


async register(formValue){
 try{
   const registeredUser= await this.fireAuth.createUserWithEmailAndPassword(formValue.email,formValue.password);
   console.log('registeruser',registeredUser);
   const data = new User(
    formValue.email,
    formValue.phone,
    formValue.name,
    registeredUser.user.uid,
    'user',
    'active'
   );
   await this.apiService.collection('users').doc(registeredUser.user.uid).set(Object.assign({}, data));
   await this.setUserData(registeredUser.user.uid);
 }catch(e){
  throw(e);
 }
}


async resetPassword(email: string){
  try{
    await this.fireAuth.sendPasswordResetEmail(email);
  }catch(e){
    throw(e);
  }
}


async logout(){
  try{
  await this.fireAuth.signOut();
  return this.storage.removeStorage('uid');}
  catch(e){
    throw(e);
  }
}

async updateEmail(oldEmail,newEmail,password){
  try{
    const result = await this.fireAuth.signInWithEmailAndPassword(oldEmail, password);
    await result.user.updateEmail(newEmail);
  }
  catch(e){
    console.log(e);
    throw(e);
  }
}
}
