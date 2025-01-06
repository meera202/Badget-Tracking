import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BodyComponent } from './body/body.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { AngularFireModule } from "@angular/fire/compat";
import { provideHttpClient } from '@angular/common/http';
import { environment } from './shared.service';
import { ChartModule } from 'primeng/chart';
import { FormsModule } from '@angular/forms';
import { SignupComponent } from './signup/signup.component';
import {provideAuth, getAuth} from '@angular/fire/auth';
import { LoginComponent } from './login/login.component';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import {StyleClassModule} from 'primeng/styleclass';
import { ExpensesComponent } from './expenses/expenses.component';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag'; 
import { RatingModule } from 'primeng/rating';
import { DropdownModule } from 'primeng/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogModule } from 'primeng/dialog';
import { IncomeComponent } from './income/income.component';
import { GoalsComponent } from './goals/goals.component';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [
    AppComponent,
    BodyComponent,
    SidenavComponent,
    DashboardComponent,
    StatisticsComponent,
    SignupComponent,
    LoginComponent,
    ExpensesComponent,
    IncomeComponent,
    GoalsComponent,
    
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    ChartModule,
    FormsModule,
    ButtonModule,
    CheckboxModule,
    provideAuth(() => getAuth()),
    StyleClassModule,
    DataViewModule,
    TagModule,RatingModule
    ,DropdownModule
    ,BrowserAnimationsModule,
    DialogModule,
    FloatLabelModule,ToastModule
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(),MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
