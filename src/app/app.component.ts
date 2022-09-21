import {Component, OnInit} from '@angular/core';
import {LoadingService} from './loading/loading.service';
import {MessageServices} from './messages/message.services';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    LoadingService,
    MessageServices
  ]
})
export class AppComponent implements  OnInit {

    constructor() {

    }

    ngOnInit() {


    }

  logout() {

  }

}
