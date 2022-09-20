import {Component, OnInit} from '@angular/core';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {interval, noop, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delay, delayWhen, filter, finalize, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import {CoursesService} from '../services/courses.service';
import {LoadingService} from '../loading/loading.service';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;


  constructor(
    private coursesService: CoursesService,
    private loadingService: LoadingService) {
  }

  ngOnInit() {
    this.reloadCourses();
  }

  reloadCourses() {
    // to było wcześniej
    // this.loadingService.loadingOn();

    // finalize używamy, kiedy observable z loadAllCourses()
    // będzie completed lub error
    const courses$ = this.coursesService.loadAllCourses()
      .pipe(
        map(courses => courses.sort(sortCoursesBySeqNo)),
        // finalize(() => this.loadingService.loadingOff())
      );

    // wcześniej włączyliśmy loader na początku i zakończyliśmy go
    // poprzez finalize. Możemy także poprzez nową observable:
    const loadCourses$ = this.loadingService.showLoaderUntilCompleted(courses$);

    this.beginnerCourses$ = loadCourses$
      .pipe(
        map(courses => courses.filter(course => course.category === 'BEGINNER'))
      );
    this.advancedCourses$ = loadCourses$
      .pipe(
        map(courses => courses.filter(course => course.category === 'ADVANCED'))
      );

    // zanim wprowadziliśmy loadCourses$ było tak:
    // odwoływaliśmy się do courses$

    // this.beginnerCourses$ = courses$
    //   .pipe(
    //     map(courses => courses.filter(course => course.category === 'BEGINNER'))
    //   );
    // this.advancedCourses$ = courses$
    //   .pipe(
    //     map(courses => courses.filter(course => course.category === 'ADVANCED'))
    //   );
  }
}




