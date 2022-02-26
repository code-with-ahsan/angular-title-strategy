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
    private router: Router,
    private userService: UserService,
    private title: Title
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => {
          return !!(event instanceof NavigationEnd);
        }),
        mergeMap((event: NavigationEnd) => {
          if (event.url.includes('/user/')) {
            return this.userService.getUser(event.url.split('/')[2]);
          }
          return of(null);
        })
      )
      .subscribe((user: IUser | null) => {
        console.log(user);
        if (!user) {
          this.title.setTitle(`ATS`);
          return;
        }
        this.title.setTitle(`ATS | ${user.name.first} ${user.name.last}`);
      });
  }
}
