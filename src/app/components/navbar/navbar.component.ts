import { Component, OnInit, DoCheck } from '@angular/core';
import { AuthService } from 'src/app/services/AuthService/auth.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  loggedIn: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  ngDoCheck(){
    if(this.authService.getRefreshToken())
      this.loggedIn = true;
  }

  logout(){
    this.authService.logout()?.subscribe(response=>{
      this.loggedIn = false;
      swal.fire("Logged out Correctly!","","success");
    });
  }
}
