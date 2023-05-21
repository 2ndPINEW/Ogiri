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
  disabled = false;

  constructor(private userService: UserService, private router: Router) {}

  login(): void {
    this.disabled = true;
    console.log(this.userName);
    if (!this.userName) {
      this.disabled = false;
      alert('名前を入力してください');
      return;
    }

    this.userService.login$({ userName: this.userName }).subscribe((res) => {
      this.router.navigate(['/']);
    });
  }
}
