import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { isApiError } from 'src/app/shared/services/api.interface';
import { OgiriService } from 'src/app/shared/services/ogiri.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent {
  showUi = false;
  error: false | string = false;

  constructor(private ogiriService: OgiriService, private router: Router) {}

  ngOnInit(): void {
    this.ogiriService.openOgiris$().subscribe({
      next: (res) => {
        if (res.length === 1) {
          this.router.navigate(['play', res[0].id]);
        } else if (res.length > 1) {
          this.router.navigate(['play']);
        } else {
          this.showUi = true;
        }
      },
      error: (err) => {
        this.showUi = true;
        this.error = '通信エラーが発生しました';
        if (isApiError(err)) {
          this.error = `通信エラーが発生しました: ${err.message}`;
        }
      },
    });
  }
}
