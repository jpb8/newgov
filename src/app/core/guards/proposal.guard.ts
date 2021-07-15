import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { ProposalService } from '../../proposal/proposal.service';
import { map } from 'rxjs/operators';
import { GovernmentService } from '../../government/government.service';

@Injectable({
  providedIn: 'root'
})
export class ProposalGuard implements CanActivate, CanActivateChild {
  
  constructor(
    private proposalService: ProposalService, 
    private governmentService: GovernmentService,
    private router: Router
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.proposalService.address$.pipe(
      map(address => {
        console.log(address);
        if (address) {
          return true;
        }
        this.governmentService.governmentAddress$.pipe(
          map(governmentAddress => {
            if (governmentAddress) {
              this.router.navigate(['/governemnt'], {queryParams: {returnUrl: state.url}});
            } else {
              this.router.navigate(['/factory'], {queryParams: {returnUrl: state.url}});
            }
          })
        )
      })
    );
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot): Observable<boolean> {
      console.log('Hello');
      return this.proposalService.address$.pipe(
        map(address => {
          console.log(address);
          if (address) {
            return true;
          }
          this.governmentService.governmentAddress$.pipe(
            map(governmentAddress => {
              if (governmentAddress) {
                this.router.navigate(['/governemnt'], {queryParams: {returnUrl: state.url}});
              } else {
                this.router.navigate(['/factory'], {queryParams: {returnUrl: state.url}});
              }
            })
          )
        })
      );
    }
}
