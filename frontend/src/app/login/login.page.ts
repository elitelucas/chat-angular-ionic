import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  showError: boolean = false;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  login(form) {
    console.log('form.value')
    console.log(form.value)
    this.authService.login(form.value).subscribe((res) => {
      console.log('res')
      console.log(res)
      if (res.token) {
        this.showError = false;
        this.router.navigateByUrl('chat');
      }
      else {
        this.showError = true;
      }
    });
  }
}
