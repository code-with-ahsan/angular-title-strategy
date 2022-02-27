import { Injectable, NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  Routes,
  RouterModule,
  ActivatedRouteSnapshot,
  TitleStrategy,
  RouterStateSnapshot,
} from '@angular/router';
import { map } from 'rxjs/operators';
import { IUser } from './core/interfaces/user.interface';
import { UserService } from './core/services/user.service';
import { HomeComponent } from './home/home.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

@Injectable({ providedIn: 'root' })
export class UserTitleResolver {
  constructor(private userService: UserService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const userId = route.paramMap.get('uuid');
    return this.userService
      .getUser(userId)
      .pipe(map((user: IUser) => `${user.name.first} ${user.name.last}`));
  }
}

@Injectable({ providedIn: 'root' })
export class CustomTitleStrategy extends TitleStrategy {
  constructor(private title: Title) {
    super();
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot);
    if (!title) {
      this.title.setTitle('ATS');
      return;
    }
    this.title.setTitle(`ATS | ${title}`);
  }
}

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
    title: 'Home',
  },
  {
    path: 'user/:uuid',
    component: UserDetailComponent,
    title: UserTitleResolver,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
    }),
  ],
  providers: [
    {
      provide: TitleStrategy,
      useClass: CustomTitleStrategy,
    },
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
