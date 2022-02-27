import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { of } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';
import { IUser } from './core/interfaces/user.interface';
import { UserService } from './core/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private userService: UserService,
    private router: Router,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        mergeMap((event: NavigationEnd) => {
          if (event.url.includes('/user')) {
            const url = event.url.split('/')[2];
            return this.userService.getUser(url);
          }
          return of(null);
        })
      )
      .subscribe((user: IUser | null) => {
        if (user) {
          console.log(user);
          this.titleService.setTitle(
            `ATS | ${user.name.first} ${user.name.last}`
          );
        } else {
          console.log('not a user URL');
          this.titleService.setTitle('ATS');
        }
      });
  }
}
