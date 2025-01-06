import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { SharedService } from '../shared.service';
import { GoalsDataService } from './goals-data-service';
import { MessageService } from 'primeng/api';

export interface Goal {
  name: string;
  description: string;
  targetAmount: number;
}

@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.scss']
})
export class GoalsComponent implements OnInit {
  userId: string | null = null;
  showDialog: boolean = false;
  goals: Goal[] = [];

  constructor(private http: HttpClient, private sharedService: SharedService, private goalsService: GoalsDataService,private messageService:MessageService) { }

  ngOnInit(): void {
    this.userId = this.sharedService.userId;
    this.loadGoalsFromFirebase();
  }

  loadGoalsFromFirebase() {
    if (!this.userId) {
      return;
    }
    const url = `https://budget-tracking-website-8ec2c-default-rtdb.europe-west1.firebasedatabase.app/userData/${this.userId}/goals.json`;

    this.http.get<any>(url).subscribe(data => {
      if (data) {
        this.goals = Object.values(data);
      }
    });
  }

  async onSubmit(goalForm: NgForm) {
    if(goalForm.valid){
    const { name, description, targetAmount } = goalForm.value;

    const existingGoalIndex = this.goals.findIndex(goal => goal.name === name);

    if (existingGoalIndex !== -1) {
      this.goals[existingGoalIndex] = { name, description, targetAmount };
      this.updateGoalInDatabase(name, { description, targetAmount });
    } else {
      const newGoal: Goal = { name, description, targetAmount };
      this.goals.push(newGoal);
      this.saveGoalToDatabase(name, newGoal);
    }
    this.showDialog = false;
  }
  else{
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields ' });

  }
}

  updateGoalInDatabase(goalName: string, data: { description: string, targetAmount: number }) {
    if (!this.userId) {
      return;
    }
    const url = `https://budget-tracking-website-8ec2c-default-rtdb.europe-west1.firebasedatabase.app/userData/${this.userId}/goals/${goalName}.json`;

    this.http.patch(url, data).subscribe(res => {
      console.log(res);
      this.goalsService.updateGoalsInDatabase(this.goals);
    });
  }

  saveGoalToDatabase(goalName: string, data: Goal) {
    if (!this.userId) {
      return;
    }
    const url = `https://budget-tracking-website-8ec2c-default-rtdb.europe-west1.firebasedatabase.app/userData/${this.userId}/goals/${goalName}.json`;

    this.http.put(url, data).subscribe(res => {
      console.log(res);
      this.goalsService.updateGoalsInDatabase(this.goals);
    });
  }

  deleteGoal(goalName: string) {
    const index = this.goals.findIndex(goal => goal.name === goalName);
    if (index !== -1) {
      this.goals.splice(index, 1);
      this.deleteGoalFromDatabase(goalName);
    }
  }

  deleteGoalFromDatabase(goalName: string) {
    if (!this.userId) {
      return;
    }
    const url = `https://budget-tracking-website-8ec2c-default-rtdb.europe-west1.firebasedatabase.app/userData/${this.userId}/goals/${goalName}.json`;

    this.http.delete(url).subscribe(res => {
      console.log(res);
      this.goalsService.updateGoalsInDatabase(this.goals);
    });
  }
}
