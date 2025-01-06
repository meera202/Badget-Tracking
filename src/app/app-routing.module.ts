import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './Auth/auth-guard';
import { ExpensesComponent } from './expenses/expenses.component';
import {  IncomeComponent } from './income/income.component';
import { GoalsComponent } from './goals/goals.component';
const routes: Routes = [
  {path:'',redirectTo:'login',pathMatch:'full'},
  {path:'signup',component:SignupComponent},
  {path:'login',component:LoginComponent},
  {path:'dashboard',component:DashboardComponent,canActivate: [AuthGuard]},
  {path:'statistics',component:StatisticsComponent,canActivate: [AuthGuard]},
  {path:'expenses',component:ExpensesComponent,canActivate: [AuthGuard]},
  {path:'goals',component:GoalsComponent,canActivate: [AuthGuard]},
  {path:'income',component:IncomeComponent,canActivate: [AuthGuard]},
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
