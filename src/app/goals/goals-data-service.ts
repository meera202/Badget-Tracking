import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../shared.service';
@Injectable({
  providedIn: 'root'
})
export class GoalsDataService {
  userId: string | null = null;

  constructor(private http: HttpClient, private sharedService: SharedService) {
    this.userId = this.sharedService.userId;
  }

  // Method to update goals in the database
  updateGoalsInDatabase(goals: any[]): void {
    if (!this.userId) {
      return;
    }
    // Make HTTP request to update goals in the database
    this.http.put(`https://budget-tracking-website-8ec2c-default-rtdb.europe-west1.firebasedatabase.app/userData/${this.userId}/goals.json`, goals).subscribe(response => {
      console.log('Goals updated in the database:', response);
    });
  }

  // Method to fetch goals from the database
  getGoalsFromDatabase() {
    if (!this.userId) {
      return;
    }
    const url = `https://budget-tracking-website-8ec2c-default-rtdb.europe-west1.firebasedatabase.app/userData/${this.userId}/goals.json`;

    // Make HTTP GET request to fetch goals from the database
    return this.http.get(url);
  }
}
