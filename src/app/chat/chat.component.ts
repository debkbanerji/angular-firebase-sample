import {Component, OnInit, OnDestroy} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {Subscription} from 'rxjs/Subscription';
import {AuthService} from '../providers/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
    private userUID: string;
    private friendUID: string;
    private paramSubscription: Subscription;

    constructor(public authService: AuthService, private db: AngularFireDatabase, private router: Router, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.paramSubscription = this.route.params.subscribe(params => {
            const chatKey = params['chat-key'];
            console.log(chatKey);

            // TODO: Update last interacted - do this in the other component
            // TODO: Decide whether it is necessary to check uid
        });
    }

    ngOnDestroy() {
        this.paramSubscription.unsubscribe();
    }
}
