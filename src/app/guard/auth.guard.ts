import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService,
              private router: Router){ }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
     return this.authService.getId().then(id=>{
      console.log('authgardid',id);
      if(id) {return true;}
      else{
        //redirect to login page
        this.router.navigateByUrl('/login');
        return false;
      }
     }).catch(e =>{
      console.log(e);
      this.router.navigateByUrl('/login');
      return false;
     });
  }
}
