import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { IncomeService } from '../income/income.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  totalIncomeSaved: number | undefined;
  totalExpenses: number | undefined;

  data: any;
  options: any;

  constructor(private sharedService: SharedService, private incomeService: IncomeService, private http: HttpClient) { }

  ngOnInit(): void {
    // Fetch total income saved
    this.incomeService.getIncomeFromDatabase().subscribe((incomeData: any) => {
      this.totalIncomeSaved = incomeData.income;
      
      // Fetch total expenses
      this.getExpensesFromDatabase().subscribe((expensesData: any) => {
        let totalExpenses = 0;
        for (const category in expensesData) {
          if (expensesData.hasOwnProperty(category)) {
            for (const item in expensesData[category]) {
              if (expensesData[category].hasOwnProperty(item)) {
                totalExpenses += expensesData[category][item].price;
              }
            }
          }
        }
        this.totalExpenses = totalExpenses;

        // Update chart data
        this.updateChartData();
      });
    });
  }

  updateChartData(): void {
    this.data = {
      labels: ['Expenses', 'Income'],
      datasets: [
        {
          data: [this.totalExpenses, this.totalIncomeSaved],
          backgroundColor: ['#FF6384', '#36A2EB'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB']
        }
      ]
    };
  }

  getExpensesFromDatabase() {
    const userId = this.sharedService.userId;
    const url = `https://budget-tracking-website-8ec2c-default-rtdb.europe-west1.firebasedatabase.app/userData/${userId}/expenses.json`;
    return this.http.get(url);
  }
}
