import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';

import {AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2/database';

import {AuthService} from '../providers/auth.service';

@Component({
    selector: 'app-text-posts',
    templateUrl: './text-posts.component.html',
    styleUrls: ['./text-posts.component.css']
})
export class TextPostsComponent implements OnInit {
    private numPosts: FirebaseObjectObservable<any>;
    private posts: FirebaseListObservable<any>;
    private submitText: String;
    private userDisplayName: String;
    private userUID: String;

    constructor(public authService: AuthService, db: AngularFireDatabase) {
        this.submitText = '';
        this.posts = db.list('/text-posts/posts');
        this.numPosts = db.object('/text-posts/num-posts');
        this.authService.afAuth.auth.onAuthStateChanged((auth) => {
            if (auth == null) {
                // not logged in
                this.userDisplayName = 'fffffffffff';
                this.userUID = '';
            } else {
                // logged in
                this.userDisplayName = auth.displayName;
                this.userUID = auth.uid;
            }
        });
    }


    ngOnInit() {
    }

    onSubmit(form: NgForm) {
        if (form.valid) {
            this.posts.push(
                {
                    'title': form.value.title,
                    'text': form.value.text,
                    'poster-displayname': this.userDisplayName,
                    'poster-uid': this.userUID,
                    'post-datetime': Date.now()
                });
            form.resetForm();
            this.submitText = 'Successfully made post!';
        } else {
            this.submitText = 'Please fill out all the required data';
        }
    }

    formatDate(millis) {
        const date = new Date(millis);
        return date.toLocaleString();
    }

}
