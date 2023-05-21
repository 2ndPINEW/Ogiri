import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { Ogiri, OgiriService } from 'src/app/shared/services/ogiri.service';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss'],
})
export class ArchiveComponent {
  ogiris$ = new Subject<Ogiri[]>();

  constructor(private ogiriService: OgiriService) {}

  ngOnInit(): void {
    this.ogiriService.allOgiris$().subscribe((res) => {
      this.ogiris$.next(res);
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString();
  }
}
