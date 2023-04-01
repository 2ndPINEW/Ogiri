import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HogeRoutingModule } from './hoge-routing.module';
import { HogeComponent } from './hoge.component';


@NgModule({
  declarations: [
    HogeComponent
  ],
  imports: [
    CommonModule,
    HogeRoutingModule
  ]
})
export class HogeModule { }
