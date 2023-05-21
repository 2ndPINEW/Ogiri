import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayRoutingModule } from './play-routing.module';
import { PlayComponent } from './pages/play/play.component';
import { ListComponent } from './pages/list/list.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [PlayComponent, ListComponent],
  imports: [CommonModule, PlayRoutingModule, FormsModule],
})
export class PlayModule {}
