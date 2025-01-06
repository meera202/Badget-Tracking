import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from './shared.service';


@Injectable({
  providedIn: 'root'
})
export class ExpensesDataService  {

  constructor(private http: HttpClient,private sharedService:SharedService) { }
  userId=this.sharedService.userId;

  // Method to update expenses in the database
  updateExpensesInDatabase(expenses: number): void {
    // Make HTTP request to update expenses in the database
    // Example:
    this.http.patch(`https://budget-tracking-website-8ec2c-default-rtdb.europe-west1.firebasedatabase.app/userData/${this.userId}/expenses.json`, { expenses }).subscribe(response => {
      console.log('Expenses updated in the database:', response);
    });
  }
  getExpensesFromDatabase() {
    const url = `https://budget-tracking-website-8ec2c-default-rtdb.europe-west1.firebasedatabase.app/userData/${this.userId}/expenses.json`;
    
    // Make HTTP GET request to fetch expenses from the database
    return this.http.get(url);
  }
 

  

  layout: 'list' | 'grid' = 'list'; // Default layout example, can be 'list' or 'grid'

}

