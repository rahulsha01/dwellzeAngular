import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, RouterEvent } from '@angular/router';
import { MenuModel } from './layout/menu/menu';
import * as fromShared from './shared';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { AppState, CryptoService } from './shared';

@Component({
  selector: 'dwlz-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'dwellze';
  localStorageKey = 'nav-nesting';
  toggleNav = true;
  parent = null;
  current = null;
  selected = null;
  parentIndex = [];
  active = 0;
  paths = [];
  breadcrumbs;
  tabLink;
  togleSetting = false;
  isLoggedIn = false;
  societyName: any;

  constructor(
    private Storage: fromShared.StorageService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private el: ElementRef,
    private appState: AppState,
    private crypto: CryptoService
  ) {

    this.route.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event) => {
      //  (event);
      this.breadcrumbs = [];
      let currentRoute = this.activatedRoute.root,
        url = '';
      do {
        const childrenRoutes = currentRoute.children;
        currentRoute = null;
        // tslint:disable-next-line:no-shadowed-variable
        childrenRoutes.forEach(route => {
          //  (route.snapshot.data);
          if (route.outlet === 'primary') {
            const routeSnapshot = route.snapshot;
            url += '/' + routeSnapshot.url.map(segment => segment.path).join('/');
            this.breadcrumbs.push({
              label: route.snapshot.data,
              url: url
            });
            currentRoute = route;
          }
        });
      } while (currentRoute);
      if (this.breadcrumbs) {
        this.tabLink = this.breadcrumbs[this.breadcrumbs.length - 1].label.breadcrumb;
      }
    });
  }

  ngOnInit() {
    this.composeMenu();
    this.checkStorage();
    this.subscribeLoginState();
    this.societyName = this.appState.societyName;
  }

  subscribeLoginState() {
    this.appState.isLoggedIn.subscribe(res => {
      this.isLoggedIn = res;
    });

  }

  composeMenu() {
    this.parent = null;
    this.current = MenuModel;
  }

  checkStorage() {
    const prevStorage = this.Storage.getStorage(this.localStorageKey);
    if (prevStorage) {
      this.Storage.removeStorage(this.localStorageKey);
    }
  }


  selectedNavigation(e, i) {
    // this.tabLink = e;
    this.active = i;
    this.route.navigate([e.link]);
    if (e.children) {
      this.active = 0;
      this.appendLocalStorage(i);
      this.current = e.children;
      this.parent = e;
      this.parentIndex = this.Storage.getStorage(this.localStorageKey).split(',').map(value => {
        // tslint:disable-next-line:radix
        return parseInt(value);
        //  (e.children);
      });
    }
  }

  backToParent(e) {
    this.parentIndex.pop();
    this.Storage.setStorage(this.localStorageKey, this.parentIndex.toString());
    if (this.parentIndex.length) {
      this.parent = MenuModel[this.parentIndex[0]];
      this.parentIndex.shift();
      for (let i = 0; i <= this.parentIndex.length - 1; i++) {
        this.parent += this.parent.children[i];
      }
      this.current = this.parent.children;
    } else {
      this.current = MenuModel;
      this.parent = null;
    }
    this.active = 0;
  }

  toggleSideNav() {
    this.toggleNav = !this.toggleNav;
  }

  appendLocalStorage(value) {
    //  (value);
    const prevValue = this.Storage.getStorage(this.localStorageKey);
    if (prevValue) {
      const currentValue = prevValue + ',' + value;
      this.Storage.setStorage(this.localStorageKey, currentValue);
    } else {
      this.Storage.setStorage(this.localStorageKey, value);
    }

  }

  // @HostListener('document:click', ['$event'])
  // click(event) {
  //   if (this.el.nativeElement.querySelector('#tool').contains(event.target)) {
  //     this.togleSetting = true;
  //   }  else {
  //     this.togleSetting = false;
  //   }
  // }
  logOut() {
    this.appState.logOut();
    this.togleSetting = false;
  }
  toggleSetting() {
    this.togleSetting = !this.togleSetting;
  }

}
