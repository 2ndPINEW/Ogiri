import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayComponent } from './pages/play/play.component';
import { ListComponent } from './pages/list/list.component';

const routes: Routes = [
  { path: '', component: ListComponent },
  { path: ':id', component: PlayComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayRoutingModule {}
