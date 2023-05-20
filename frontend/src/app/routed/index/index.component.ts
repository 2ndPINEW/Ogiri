import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OgiriService } from 'src/app/shared/services/ogiri.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent {
  constructor(private ogiriService: OgiriService, private router: Router) {}

  ngOnInit(): void {
    this.ogiriService.openOgiris$().subscribe((res) => {
      if (res.length === 1) {
        this.router.navigate(['play', res[0].id]);
      } else if (res.length > 1) {
        this.router.navigate(['play']);
      }
    });
  }
}
