import { Component } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    console.log(this.userService.isUserLoggedIn());
    this.userService.login$({ userName: 'pi' }).subscribe((res) => {
      console.log(res);
    });
  }
}
