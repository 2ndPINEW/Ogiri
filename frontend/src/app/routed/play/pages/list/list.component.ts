import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { Ogiri, OgiriService } from 'src/app/shared/services/ogiri.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent {
  ogiris$ = new Subject<Ogiri[]>();

  constructor(private ogiriService: OgiriService) {}

  ngOnInit(): void {
    this.ogiriService.allOgiris$().subscribe((res) => {
      console.log(res);
      this.ogiris$.next(res);
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString();
  }
}
