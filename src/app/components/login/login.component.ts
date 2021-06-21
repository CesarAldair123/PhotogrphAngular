import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginRequest } from 'src/app/models/LoginRequest';
import { AuthService } from 'src/app/services/AuthService/auth.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  incorrectCredentials: boolean = false;

  constructor(private authService : AuthService,
    private route: ActivatedRoute,
    private router: Router) {
    //If a user is logged in, then redirect to home page
    if(localStorage.getItem("refreshToken") !== null) router.navigateByUrl("/");

    //Create the FormGroup
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('',Validators.required)
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((data)=>{
      if(data.registered==="true"){
        swal.fire("Verify your email before login", "", "success");
      }
    });
  }

  onSubmit(){
    let loginRequest: LoginRequest ={
      username: this.username?.value,
      password: this.password?.value
    }

    this.authService.login(loginRequest)
    .subscribe(_=>{
      this.router.navigateByUrl("/");
    },
    error=>{
      if(error.status === 403){
        this.incorrectCredentials = true;
      }
    })
  }

  get username(){
    return this.loginForm.get('username');
  }

  get password(){
    return this.loginForm.get('password');
  }

}
