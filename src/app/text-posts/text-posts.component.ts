import {Component, OnInit} from '@angular/core';

import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';

@Component({
    selector: 'app-text-posts',
    templateUrl: './text-posts.component.html',
    styleUrls: ['./text-posts.component.css']
})
export class TextPostsComponent implements OnInit {
    private posts: FirebaseListObservable<any>;

    constructor(db: AngularFireDatabase) {
        this.posts = db.list('/text-posts');
    }

    ngOnInit() {
    }

}
