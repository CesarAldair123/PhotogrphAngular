import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/AuthService/auth.service';
import { SignupRequest } from 'src/app/models/SignupRequest';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;

  constructor(private authService: AuthService, 
    private router: Router) {
    //If a user is logged in, then redirect to home page
    if(localStorage.getItem("refreshToken") !== null) router.navigateByUrl("/");

    //Create the FormGroup
    this.signupForm = new FormGroup({
      username: new FormControl('',Validators.required),
      email: new FormControl('',[Validators.email,Validators.required]),
      birthdate: new FormControl('',Validators.required),
      password: new FormControl('',Validators.required)
    });
  }

  ngOnInit(): void {

  }

  onSubmit(){
    //Creating the SignupRequest Object with all the required data
    let signupRequest: SignupRequest = {
      username: this.username?.value,
      email: this.email?.value,
      password: this.password?.value,
      birthdate: this.birthdate?.value
    };

    //We call the signup method to do a request to the server
    this.authService
    .signup(signupRequest)
    .subscribe((response)=>{ //If all is ok then redirect to login route 
      this.router.navigate(["/login?registered=true"])
    },
    (error)=>{ //If not set a error in the username field or email field
      if(error.status == 409){
        let message: string = error.error.error;
        if(message.startsWith('Username')) 
          this.username?.setErrors({notUnique:true});
        else 
          this.email?.setErrors({notUnique:true});
      }
    });
  }

  get username(){
    return this.signupForm.get('username');
  }

  get email(){
    return this.signupForm.get('email');
  }

  get password(){
    return this.signupForm.get('password');
  }

  get birthdate(){
    return this.signupForm.get('birthdate');
  }
}
