import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { GovernmentService } from '../../government/government.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GovernmentGuard implements CanActivate, CanActivateChild {
  
  constructor(private governmentService: GovernmentService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.governmentService.governmentAddress$.pipe(
      map(address => {
        console.log(address);
        if (address) {
          return true;
        }
        this.router.navigate(['/factory'], {queryParams: {returnUrl: state.url}});
      })
    );
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot): Observable<boolean> {
    return this.governmentService.governmentAddress$.pipe(
      map(address => {
        if (address) {
          return true;
        }
        console.log('Government Not Loaded');
        this.router.navigate(['/factory'], {queryParams: {returnUrl: state.url}});
      })
    );
  }
}
