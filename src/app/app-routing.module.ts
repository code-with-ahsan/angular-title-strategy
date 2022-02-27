import { Injectable, NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  Routes,
  RouterModule,
  TitleStrategy,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { first, map, mergeMap, skip, take } from 'rxjs/operators';
import { UserService } from './core/services/user.service';
import { HomeComponent } from './home/home.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

@Injectable({ providedIn: 'root' })
export class UserPageTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      this.title.setTitle(`ATS - ${title}`);
    }
  }
}

@Injectable({ providedIn: 'root' })
export class UserNameTitleResolver {
  constructor(private userService: UserService) {}
  resolve(route: ActivatedRouteSnapshot) {
    const userId = route.paramMap.get('uuid');
    return this.userService
      .getUser(userId)
      .pipe(map((user) => `${user.name.first} ${user.name.last}`));
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
    title: UserNameTitleResolver,
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
      useClass: UserPageTitleStrategy,
    },
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
