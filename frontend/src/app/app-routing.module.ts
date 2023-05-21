import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./routed/index/index.module').then((m) => m.IndexModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./routed/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'play',
    loadChildren: () =>
      import('./routed/play/play.module').then((m) => m.PlayModule),
  },
  { path: 'result', loadChildren: () => import('./routed/result/result.module').then(m => m.ResultModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
