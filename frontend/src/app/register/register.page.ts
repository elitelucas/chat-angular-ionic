import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  isDuplicatedEmail:boolean = false;


  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  register(form) {
    this.authService.register(form.value).subscribe((res) => {
      console.log('res')
      console.log(res)
      if(res.status == "409") {
        this.isDuplicatedEmail = true;
        return;
      }
      this.router.navigateByUrl('login');
    });
  }

}
