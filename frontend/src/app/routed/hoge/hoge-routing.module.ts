import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HogeComponent } from './hoge.component';

const routes: Routes = [{ path: '', component: HogeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HogeRoutingModule { }
