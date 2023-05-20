import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { OgiriService, Report } from 'src/app/shared/services/ogiri.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
})
export class PlayComponent {
  id$ = this.route.paramMap.pipe(map((params) => params.get('id')));
  report: Report | undefined;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ogiriService: OgiriService
  ) {}

  ngOnInit(): void {
    this.id$.subscribe((id) => {
      if (!id) {
        this.router.navigate(['play']);
        return;
      }
      this.ogiriService.reportOgiri$({ ogiriId: id }).subscribe((res) => {
        console.log(res);
        this.report = res;
      });
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString();
  }
}
