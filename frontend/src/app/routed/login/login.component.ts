import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  userName = '';

  constructor(private userService: UserService, private router: Router) {}

  login(): void {
    console.log(this.userName);
    if (!this.userName) {
      alert('名前を入力してください');
      return;
    }

    this.userService.login$({ userName: this.userName }).subscribe((res) => {
      console.log(res);
      this.router.navigate(['/']);
    });
  }
}
