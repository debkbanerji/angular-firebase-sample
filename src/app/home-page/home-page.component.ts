import {Component, OnInit} from '@angular/core';

import {Router} from '@angular/router';

import {AuthService} from '../providers/auth.service';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.css', '../shared/bootstrap-material-design.min.css']
})
export class HomePageComponent implements OnInit {

    constructor(public authService: AuthService, private router: Router) {
    }

    ngOnInit() {
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['login']);
    }
}
