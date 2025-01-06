import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../shared.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  constructor(private messageService:MessageService, private afAuth: AngularFireAuth, private router: Router, private sharedService: SharedService) {

  }

  ngOnInit() {
    this.sharedService.logout();
  }
  async onLogin(form: NgForm) {
    if (form.valid) {
      try {
        const result = await this.afAuth.signInWithEmailAndPassword(form.value.email, form.value.password);
        console.log('Login successful!', result);
    
        this.sharedService.loggedInSubject.next(true);
    
        this.router.navigate(['/dashboard']); // Redirect to dashboard
      
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Wrong email or password ' });

    }

    }
  else{
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields ' });

}
  
  // handleError(error: any) {
  //   let errorMessage = 'An error occurred during login.';
  //   switch (error.code) {
  //     case 'auth/wrong-password':
  //       errorMessage = 'Invalid email or password.';
  //       break;
  //     case 'auth/user-not-found':
  //       errorMessage = 'The email address you entered is not associated with an account.';
  //       break;
  //     // Add more error cases as needed
  //     default:
  //       // Handle other Firebase errors or generic errors
  //   }
  
  
}
}