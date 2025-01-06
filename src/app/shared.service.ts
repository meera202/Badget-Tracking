import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { LoginComponent } from './login/login.component';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { user } from '@angular/fire/auth';
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyDAR9N4xamiAIIZZ1ce-mT7D0mP2x3Bgjk",
    authDomain: "budget-tracking-website-8ec2c.firebaseapp.com",
    databaseURL: "https://budget-tracking-website-8ec2c-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "budget-tracking-website-8ec2c",
    storageBucket: "budget-tracking-website-8ec2c.appspot.com",
    messagingSenderId: "309312552255",
    appId: "1:309312552255:web:669c1253faea51ac08278a"
  }
};
@Injectable({
  providedIn: 'root'
})
export class SharedService {
  
   loggedInSubject = new BehaviorSubject<boolean>(false); // Observable for login state
  isLoggedIn$ = this.loggedInSubject.asObservable();

  userId: string | null = null;
  constructor(private afAuth: AngularFireAuth,private http:HttpClient) {
    
  this.afAuth.authState.subscribe(user => {
      if (user) {
        console.log(user.uid);
        this.userId = user.uid;
        this.loggedInSubject.next(true); // Update login state
      } else {
        this.userId = null;
        this.loggedInSubject.next(false); // Update login state
      }
    });
  }
  getPost() {
    return this.http.get(
      'https://budget-tracking-website-8ec2c-default-rtdb.europe-west1.firebasedatabase.app/userData.json'
    );
  }
  saveUserIncome(income: number) {
      const data=income;

      this.http.put(`https://budget-tracking-website-8ec2c-default-rtdb.europe-west1.firebasedatabase.app/userData/${this.userId}/income.json`
      ,
      data
      ).subscribe((res)=>{
          console.log(res)
          console.log(this.userId+"useeeridddd")
      });   return; 
    } 

  getUserIncome() {
    console.log(this.userId);
    const url = `https://budget-tracking-website-8ec2c-default-rtdb.europe-west1.firebasedatabase.app/userData/${this.userId}.json`;
    return this.http.get(url);
    
  }
  logout() {
    return this.afAuth.signOut().then(() => {
      console.log('User logged out successfully');
      this.loggedInSubject.next(false); // Update login state after logout
    }).catch(error => {
      console.error('Error logging out:', error);
    });
  }
}



//   signupDB(email:string,password:string){
//     this.getPost();

//     const data = {
//       email: email,
//       password: password,
//     };
    
    // this.http.post('https://budget-tracking-website-8ec2c-default-rtdb.europe-west1.firebasedatabase.app/userData.json'
    // ,
    // data
    // ).subscribe((res)=>{
    //     console.log(res)
    // });
  