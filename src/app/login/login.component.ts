import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { NgToastService } from 'ng-angular-popup';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide: boolean = true;
  loginForm!: FormGroup
  constructor(private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toastService: NgToastService,
    private cookieService: CookieService,
    private router: Router) { }
  ngOnInit(): void {
    if (this.cookieService.get("loggedIn") == "Yes") {
      this.router.navigate(['/dashboard'])
    }
    this.loginForm = this.formBuilder.group({
      loginId: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })
  }

  doLogin() {
    if (this.loginForm.valid) {
      this.apiService.login(this.loginForm.value).subscribe(
        {
          next: (res) => {
            console.log(res);
            this.cookieService.set("loginId", res.loginId);
            this.cookieService.set("jwtToken", res.jwtToken);
            this.cookieService.set("firstName", res.firstName);
            this.cookieService.set("emailId", res.emailId)
            this.cookieService.set("contactNumber", res.contactNumber)
            this.cookieService.set("lastName", res.lastName);
            this.cookieService.set("loggedIn", "Yes");
            this.apiService.authenticateAdmin().subscribe({
              next: (res) =>  {
                this.cookieService.set("usertype", "admin")
                console.log("admin")
              },
              error: (res) => {
                console.log("Cant reach here as admin")
                this.apiService.authenticateUser().subscribe({
                  next: (res) => { 
                    this.cookieService.set("admin", "user")
                    console.log("user")
                  },
                  error: (res) => console.log("Cant reach here as user")
                })
              }
            })
            this.router.navigate(['/dashboard'])
            this.toastService.success({
              detail: "Login Success",
              summary: "You are logged in as " + res.firstName,
              duration: 3000
            })
          },
          error: (res) => {
            console.log(res);
            this.toastService.warning({
              detail: "Login Failed",
              summary: res.error.message,
              duration: 3000
            })
          }
        }
      )
    }
  }
  doNavigateForgotPage() {
    this.router.navigate(["forgotpassword"]);
  }
}
