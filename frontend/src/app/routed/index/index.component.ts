import { Component } from '@angular/core';
import { OgiriService } from 'src/app/shared/services/ogiri.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent {
  constructor(private ogiriService: OgiriService) {}

  ngOnInit(): void {
    this.ogiriService.openOgiris$().subscribe((res) => {
      console.log(res);
      this.ogiriService
        .reportOgiri$({ ogiriId: res[0].id })
        .subscribe((res) => {
          console.log(res);
        });
      // this.ogiriService
      //   .answerOgiri$({
      //     ogiriId: res[0].id,
      //     answer: 'ヒマラヤ山脈が好き',
      //   })
      //   .subscribe((res) => {
      //     console.log(res);
      //   });
    });
  }
}
