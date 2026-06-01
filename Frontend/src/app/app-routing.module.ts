import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './view/welcome/welcome.component';
import { SignUpComponent } from './view/sign-up/sign-up.component';
import { SignInComponent } from './view/sign-in/sign-in.component';
import { NotFoundComponent } from './view/not-found/not-found.component';
import { HomeGuard } from './guard/home.guard';
import { HomeComponent } from './view/home/home.component';
import { ForgotPasswordComponent } from './view/forgot-password/forgot-password.component';
import { ServerErrorComponent } from './view/server-error/server-error.component';
import { VerifyAccountComponent } from './view/verify-account/verify-account.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/welcome'
  },
  {
    component: WelcomeComponent,
    path: 'welcome'
  },
  {
    component: SignUpComponent,
    path: 'sign-up'
  },{
    component: VerifyAccountComponent,
    path: 'verify-account'
  },
  {
    component: SignInComponent,
    path: 'sign-in'
  },
  {
    component: ForgotPasswordComponent,
    path: 'forgot-password'
  },
  {
    component: ServerErrorComponent,
    path: 'server-error'
  },
  {
    path: 'home',
    loadChildren: () => import('./view/home/home.module').then(m => m.HomeModule),
    data: { preload: true },
    canActivate: [HomeGuard]
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
