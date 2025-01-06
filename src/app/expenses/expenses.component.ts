import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { SharedService } from '../shared.service';
import { ExpensesDataService } from '../expenses-data.service';
import { MessageService } from 'primeng/api';
export interface Product {
  name: string;
  category: string;
  price: number;
}
export interface Category {
  name: string;
  value: any; // You can define any type for the value property
}


@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss'] // corrected the typo in styleUrls
})

export class ExpensesComponent implements OnInit {

   userId=this.sharedservice.userId;
   showDialog: boolean = false;

  products: Product[] = [];
  categories: Category[] = [
    { name: 'Electronics', value: 'electronics' },
    { name: 'Clothing', value: 'clothing' },
    { name: 'Books', value: 'books' },
    { name: 'Goods', value: 'goods' }
    // Add more categories as needed
  ];



  selectedCity: string | undefined; // Declare selectedCity property
selectedCategory: any;
  totalExpensesCost: number | undefined;

  constructor(private messageService:MessageService, private http: HttpClient,private sharedservice:SharedService ,private expensesService:ExpensesDataService) { }

  ngOnInit(): void {
    this.loadProductsFromFirebase();

  }

  

  layout: 'list' | 'grid' = 'list'; // Default layout example, can be 'list' or 'grid'

  loadProductsFromFirebase() {
    const url = `https://budget-tracking-website-8ec2c-default-rtdb.europe-west1.firebasedatabase.app/userData/${this.userId}/expenses.json`;
  
    this.http.get<any>(url).subscribe(data => {
      if (data) {
        // Clear the existing products array before populating it with new data
        this.products = [];
        // Iterate over the categories in the response
        Object.keys(data).forEach(category => {
          // Iterate over the items in each category
          Object.keys(data[category]).forEach(item => {
            const price = data[category][item].price; // Access the price property
            this.products.push({ name: item, category, price });
          });
        });
      }
    });
  }
  async onSubmit(expenseForm: any) {
    if(expenseForm.valid){
    // Get the form values
    const { name, price } = expenseForm.value;
  
    // Search for the product in the products array
    const existingProductIndex = this.products.findIndex(product => product.name === name && product.category === this.selectedCategory.name);
  
    if (existingProductIndex !== -1) {
      // If the product already exists, update its price
      this.products[existingProductIndex].price = price;
  
      // Update the price in the Firebase database
      this.http.patch(`https://budget-tracking-website-8ec2c-default-rtdb.europe-west1.firebasedatabase.app/userData/${this.userId}/expenses/${this.selectedCategory.name}/${name}.json`, { price })
        .subscribe(res => {
          console.log(res);
          // Handle response or any additional actions after updating data
          // Recalculate total expenses cost after updating item
          this.updateTotalExpensesCost();
        });
    } else {
      // If the product does not exist, add it to the list and Firebase database
      const formData = {
        name: name,
        category: this.selectedCategory.name,
        price: price
      };
  
      this.products.push(formData);
  
      this.http.put(`https://budget-tracking-website-8ec2c-default-rtdb.europe-west1.firebasedatabase.app/userData/${this.userId}/expenses/${this.selectedCategory.name}/${name}.json`, formData)
        .subscribe(res => {
          console.log(res);
          // Handle response or any additional actions after updating data
          // Recalculate total expenses cost after adding new item
          this.updateTotalExpensesCost();
        });
    }
    this.showDialog = false;
  }
  else{
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields ' });

  }
}

  // Method to update total expenses cost
  updateTotalExpensesCost(): void {
    this.totalExpensesCost = this.getTotalExpensesCost();
    this.expensesService.updateExpensesInDatabase(this.totalExpensesCost);
  }

  
  deleteProduct(product: Product) {
    // Remove the product from the products array
    const index = this.products.findIndex(p => p.name === product.name && p.category === product.category);
    if (index !== -1) {
      this.products.splice(index, 1);

      // Delete the product from the database
      this.http.delete(`https://budget-tracking-website-8ec2c-default-rtdb.europe-west1.firebasedatabase.app/userData/${this.userId}/expenses/${product.category}/${product.name}.json`)
        .subscribe(res => {
          console.log(res);
        });
        this.expensesService.updateExpensesInDatabase(this.getTotalExpensesCost());


    }
  }
  getTotalExpensesCost(): number {
    let totalCost = 0;
    for (const product of this.products) {
      totalCost += product.price;
    }
    return totalCost;
  }
}