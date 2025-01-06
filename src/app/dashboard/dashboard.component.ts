import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IncomeComponent } from '../income/income.component';
import { SharedService } from '../shared.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Subscription } from 'rxjs';
import {  GoalsComponent } from '../goals/goals.component';
export interface Goal {
  name: string;
  description: string;
  targetAmount: number;
}
interface IncomeItem {
  amount: number;
  category: string;
  name: string;
}
interface ExpenseItem {
  name: string;
  category: string;
  price: number; // Make sure price is defined with the correct type
}

interface ExpenseData {
  [category: string]: {
    [id: string]: ExpenseItem;
  };
}
interface IncomeData {
  [category: string]: {
    [id: string]: IncomeItem;
  };
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userId: string | null = null;
  userIdSubscription: Subscription | undefined;
  goals: Goal[] = [];

  incomeData: IncomeData = {}; // Initialize incomeData with empty object
  chartData: any;
  expenseData: ExpenseData = {}; // Initialize expenseData with empty object
  expenseChartData: any;
  constructor(private http: HttpClient,private sharedservice:SharedService,private afAuth: AngularFireAuth) { }

  ngOnInit(): void {
    this.userIdSubscription = this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.fetchIncomeData();
        this.fetchExpenseData();
       this.loadGoalsFromFirebase();

      }
    });
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

  
  ngOnDestroy(): void {
    if (this.userIdSubscription) {
      this.userIdSubscription.unsubscribe();
    }
  }
  

  fetchIncomeData(): void {
    const url = `https://budget-tracking-website-8ec2c-default-rtdb.europe-west1.firebasedatabase.app/userData/${this.userId}/incomes.json`;
    console.log(url)
    this.http.get<IncomeData>(url).subscribe(data => {
      this.incomeData = data;
      this.prepareChartData();
    });
  }

  prepareChartData(): void {
    this.chartData = {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'] // Add more colors if needed
      }]
    };

    // Calculate total income amount for each category
    const categoryTotalMap: { [category: string]: number } = {}; // Define categoryTotalMap with type
    Object.values(this.incomeData).forEach(category => {
      Object.values(category).forEach((item: IncomeItem) => {
        if (categoryTotalMap[item.category]) {
          categoryTotalMap[item.category] += item.amount;
        } else {
          categoryTotalMap[item.category] = item.amount;
        }
      });
    });

    // Populate chart data
    Object.entries(categoryTotalMap).forEach(([category, totalAmount]) => {
      this.chartData.labels.push(category);
      this.chartData.datasets[0].data.push(totalAmount);
    });
  }
  getTotalIncome(): number {
    let totalIncome = 0;
    Object.values(this.incomeData).forEach(category => {
      Object.values(category).forEach((item: IncomeItem) => {
        totalIncome += item.amount;
      });
    });
    return totalIncome;
  }
  fetchExpenseData(): void {
    const url = `https://budget-tracking-website-8ec2c-default-rtdb.europe-west1.firebasedatabase.app/userData/${this.userId}/expenses.json`;
    this.http.get<ExpenseData>(url).subscribe(data => {
      this.expenseData = data;
      this.prepareExpenseChartData();
    });
  }

  prepareExpenseChartData(): void {
    this.expenseChartData = {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'] // Add more colors if needed
      }]
    };

    const categoryTotalMap: { [category: string]: number } = {};

    // Calculate total expense amount for each category
    Object.values(this.expenseData).forEach(category => {
      Object.values(category).forEach((item: ExpenseItem) => {
        if (categoryTotalMap[item.category]) {
          categoryTotalMap[item.category] += item.price; // Use 'price' instead of 'amount'
        } else {
          categoryTotalMap[item.category] = item.price; // Use 'price' instead of 'amount'
        }
      });
    });

    // Populate chart data
    Object.entries(categoryTotalMap).forEach(([category, totalAmount]) => {
      this.expenseChartData.labels.push(category);
      this.expenseChartData.datasets[0].data.push(totalAmount);
    });
  }
  getTotalExpenses(): number {
    let totalExpenses = 0;
    Object.values(this.expenseData).forEach(category => {
      Object.values(category).forEach((item: ExpenseItem) => {
        totalExpenses += item.price;
      });
    });
    return totalExpenses;
  }
  
}

