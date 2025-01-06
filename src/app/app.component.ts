import { Component, OnInit } from '@angular/core';
import { SharedService } from './shared.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'

})
export class AppComponent  {
  constructor(private sharedService:SharedService){}
 
  title = 'sidenav';
  isSideNavCollapsed = false;
  screenWidth = 0;
  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
  loggedin(){
     if(this.sharedService.userId!=null)
      return true;
    else
    return false;

  }
}