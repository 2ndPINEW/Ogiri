import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription, map, timer } from 'rxjs';
import { OgiriService, Report } from 'src/app/shared/services/ogiri.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent {
  readonly myId = this.userService.userId();
  id$ = this.route.paramMap.pipe(map((params) => params.get('id')));

  reportSubscription: Subscription | undefined;
  report: Report | undefined;

  remainingTimeString$ = new Subject<string>();

  subscription = new Subscription();

  constructor(
    private ogiriService: OgiriService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id$.subscribe((id) => {
      if (!id) {
        this.router.navigate(['play']);
        return;
      }

      this.reportSubscription?.unsubscribe();
      this.reportSubscription = timer(0, 10000).subscribe(() => {
        this.ogiriService.reportOgiri$({ ogiriId: id }).subscribe({
          next: (res) => {
            this.report = res;
          },
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.reportSubscription?.unsubscribe();
  }
}
