import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription, map, timer } from 'rxjs';
import { OgiriService, Report } from 'src/app/shared/services/ogiri.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
})
export class PlayComponent {
  id$ = this.route.paramMap.pipe(map((params) => params.get('id')));
  report: Report | undefined;
  remainingTimeString$ = new Subject<string>();

  subscription = new Subscription();
  reportSubscription: Subscription | undefined;

  disabled = false;

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
      if (this.reportSubscription) {
        this.reportSubscription.unsubscribe();
      }
      this.reportSubscription = timer(0, 1000).subscribe(() => {
        this.ogiriService.reportOgiri$({ ogiriId: id }).subscribe((res) => {
          this.report = res;
        });
      });
    });

    this.subscription.add(
      timer(0, 100).subscribe(() => {
        if (!this.report) {
          return;
        }

        const endedAt = new Date(this.report.ended_at);
        const remainingTime = endedAt.getTime() - Date.now();

        if (remainingTime < 0) {
          this.remainingTimeString$.next('00:00:00');
          this.router.navigate(['/', 'result', this.report?.id]);
          return;
        }

        this.remainingTimeString$.next(
          new Date(remainingTime).toISOString().substr(11, 8)
        );
      })
    );
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
