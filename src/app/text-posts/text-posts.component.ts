import {Component, OnInit, OnDestroy} from '@angular/core';
import {NgForm} from '@angular/forms';

// import {ReversePipe} from 'ngx-pipes/src/app/pipes/array/reverse';
// import {OrderByPipe} from 'ngx-pipes/src/app/pipes/array/order-by';

import {AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2/database';

import {AuthService} from '../providers/auth.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-text-posts',
    templateUrl: './text-posts.component.html',
    styleUrls: ['./text-posts.component.css']
})
export class TextPostsComponent implements OnInit, OnDestroy {
    private numPostsSubscription: Subscription;
    private numPostsObject: FirebaseObjectObservable<any>;
    private numPosts: number;
    private postsArray: FirebaseListObservable<any>;
    private submitText: String;
    private userDisplayName: String;
    private userUID: String;
    // private db: AngularFireDatabase;


    constructor(public authService: AuthService, db: AngularFireDatabase) {
        this.submitText = '';

        this.postsArray = db.list('/text-posts/posts');

        this.numPostsObject = db.object('/text-posts/num-posts', {preserveSnapshot: true});
    }

    ngOnInit() {
        this.numPostsSubscription = this.numPostsObject.subscribe(snapshot => {
            let val = snapshot.val();
            if (!val) {
                val = 0;
            }
            this.numPosts = val;
        });

        this.authService.afAuth.auth.onAuthStateChanged((auth) => {
            if (auth == null) {
                // not logged in
                this.userDisplayName = '';
                this.userUID = '';
            } else {
                // logged in
                this.userDisplayName = auth.displayName;
                this.userUID = auth.uid;
            }
        });
    }

    ngOnDestroy() {
        this.numPostsSubscription.unsubscribe();
    }

    onSubmit(form: NgForm) {
        // console.log('SUBMISSION');
        if (form.valid) {
            this.postsArray.push(
                {
                    'title': form.value.title,
                    'text': form.value.text,
                    'poster-displayname': this.userDisplayName,
                    'poster-uid': this.userUID,
                    'post-datetime': Date.now()
                });
            form.resetForm();
            this.submitText = 'Successfully made post!';
            this.numPostsObject.set(this.numPosts + 1);
        } else {
            this.submitText = 'Please fill out all the required data';
        }
    }

    removePost(key) {
        this.postsArray.remove(key);
        this.numPostsObject.set(this.numPosts - 1);
    }

    formatDate(millis) {
        const date = new Date(millis);
        return date.toLocaleString();
    }

}
