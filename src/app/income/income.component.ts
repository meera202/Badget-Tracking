import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { SharedService } from '../shared.service';
import { IncomeService } from './income.service';
import { MessageService } from 'primeng/api';
export interface Income {
  name: string;
  category: string;
  amount: number; // Change 'price' to 'amount'
}
export interface Category {
  name: string;
  value: any; // You can define any type for the value property
}
@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss']
})
export class IncomeComponent implements OnInit {
  userId = this.sharedservice.userId;
  showDialog: boolean = false;

  incomes: Income[] = []; // Rename 'products' to 'incomes'
  categories: Category[] = [
    { name: 'Salary', value: 'salary' },
    { name: 'Freelance', value: 'freelance' },
    { name: 'Investments', value: 'investments' },
    { name: 'Other', value: 'other' }
    // Add more categories as needed
  ];

  selectedCategory: any;
  totalIncomeAmount: number | undefined;

  constructor(private messageService:MessageService,private http: HttpClient, private sharedservice: SharedService, private incomeService: IncomeService) { }

  ngOnInit(): void {
    this.loadIncomesFromFirebase();
  }

  layout: 'list' | 'grid' = 'list';

  loadIncomesFromFirebase() {
    const url = `https://budget-tracking-website-8ec2c-default-rtdb.europe-west1.firebasedatabase.app/userData/${this.userId}/incomes.json`;

    this.http.get<any>(url).subscribe(data => {
      if (data) {
        this.incomes = [];
        Object.keys(data).forEach(category => {
          Object.keys(data[category]).forEach(item => {
            const amount = data[category][item].amount;
            this.incomes.push({ name: item, category, amount });
          });
        });
      }
    });
  }

  async onSubmit(incomeForm: any) {
    if(incomeForm.valid){
    const { name, amount } = incomeForm.value;

    const existingIncomeIndex = this.incomes.findIndex(income => income.name === name && income.category === this.selectedCategory.name);

    if (existingIncomeIndex !== -1) {
      this.incomes[existingIncomeIndex].amount = amount;

      this.http.patch(`https://budget-tracking-website-8ec2c-default-rtdb.europe-west1.firebasedatabase.app/userData/${this.userId}/incomes/${this.selectedCategory.name}/${name}.json`, { amount })
        .subscribe(res => {
          console.log(res);
          this.updateTotalIncomeAmount();
        });
    } else {
      const formData = {
        name: name,
        category: this.selectedCategory.name,
        amount: amount
      };

      this.incomes.push(formData);

      this.http.put(`https://budget-tracking-website-8ec2c-default-rtdb.europe-west1.firebasedatabase.app/userData/${this.userId}/incomes/${this.selectedCategory.name}/${name}.json`, formData)
        .subscribe(res => {
          console.log(res);
          this.updateTotalIncomeAmount();
        });
    }
    this.showDialog = false;
  }
  else{
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields ' });

  }
}

  updateTotalIncomeAmount(): void {
    this.totalIncomeAmount = this.getTotalIncomeAmount();
    this.incomeService.updateIncomeInDatabase(this.totalIncomeAmount);
  }

  deleteIncome(income: Income) {
    const index = this.incomes.findIndex(i => i.name === income.name && i.category === income.category);
    if (index !== -1) {
      this.incomes.splice(index, 1);

      this.http.delete(`https://budget-tracking-website-8ec2c-default-rtdb.europe-west1.firebasedatabase.app/userData/${this.userId}/incomes/${income.category}/${income.name}.json`)
        .subscribe(res => {
          console.log(res);
        });
      this.incomeService.updateIncomeInDatabase(this.getTotalIncomeAmount());
    }
  }

  getTotalIncomeAmount(): number {
    let totalAmount = 0;
    for (const income of this.incomes) {
      totalAmount += income.amount;
    }
    return totalAmount;
  }
}
