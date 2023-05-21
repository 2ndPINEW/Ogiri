import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription, map, timer } from 'rxjs';
import {
  Answer,
  OgiriService,
  Report,
} from 'src/app/shared/services/ogiri.service';
import { UserService } from 'src/app/shared/services/user.service';

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
  answer = '';
  error = '';
  hint = 'エンターキーで送信';

  showRandomAnswer: boolean = false;
  randomAnswer: Answer | undefined;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ogiriService: OgiriService,
    private userService: UserService
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
      this.reportSubscription = timer(0, 10000).subscribe(() => {
        this.ogiriService.reportOgiri$({ ogiriId: id }).subscribe((res) => {
          this.report = res;
          const myId = this.userService.userId();
          const myAnswer = res.answers.find(
            (answer) => answer.users.id === myId
          );
          if (myAnswer) {
            this.disabled = true;
            this.hint = '回答済みです';
            this.answer = myAnswer.answer;
          }
          this.showRandomAnswer = false;
          timer(1000).subscribe(() => {
            const otherAnswers = res.answers.filter(
              (answer) => answer.users.id !== myId
            );
            if (otherAnswers.length > 0) {
              this.randomAnswer =
                otherAnswers[Math.floor(Math.random() * otherAnswers.length)];
              this.showRandomAnswer = true;
            }
          });
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
          // this.router.navigate(['/', 'result', this.report?.id]);
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

  sendAnswer(): void {
    this.error = '';
    if (!this.answer) {
      this.error = '回答を入力してください';
      return;
    }
    this.ogiriService
      .answerOgiri$({
        answer: this.answer,
        ogiriId: this.route.snapshot.paramMap.get('id') ?? '',
      })
      .subscribe(() => {
        this.disabled = true;
        this.hint = '回答を送信しました';
      });
  }
}
