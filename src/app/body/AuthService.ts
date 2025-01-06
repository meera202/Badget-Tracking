import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // For API communication (optional)
import { BehaviorSubject } from 'rxjs'; // For managing login state

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(false); // Observable for login state
  isLoggedIn$ = this.loggedIn.asObservable(); // Public observable for components to subscribe

  constructor(private http: HttpClient) {} // Inject HttpClient if needed for API calls

  // ... Authentication methods here
}

// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, of } from 'rxjs';
// import { catchError, map } from 'rxjs/operators';
// import { SharedService } from '../shared.service';
// import { LoginComponent } from '../login/login.component';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   constructor(private http: HttpClient, private sharedservice: SharedService, private login: LoginComponent) {

//   }
//   isLoggedIn() {
//     if (this.login.loggedIn == false) {
//       return true;
//     }
//     else if (this.login.loggedIn == true) {
//       console.log(this.sharedservice.userId)
//       return true;

//     }
//     return false;
//   }
// }