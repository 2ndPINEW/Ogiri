import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayRoutingModule } from './play-routing.module';
import { PlayComponent } from './pages/play/play.component';
import { ListComponent } from './pages/list/list.component';

@NgModule({
  declarations: [PlayComponent, ListComponent],
  imports: [CommonModule, PlayRoutingModule],
})
export class PlayModule {}
