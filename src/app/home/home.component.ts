import {Component, OnInit} from '@angular/core';
import {Course} from '../model/course';
import {Observable} from 'rxjs';
import {CoursesStore} from '../services/courses.store';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor(
    private coursesStore: CoursesStore) {
  }

  ngOnInit() {
    this.reloadCourses();
  }

  reloadCourses() {
    this.beginnerCourses$ = this.coursesStore.filterByCategory('BEGINNER');
    this.advancedCourses$ = this.coursesStore.filterByCategory('ADVANCED');

  }

  // reloadCourses_OLD() {
  //   // to było wcześniej
  //   // this.loadingService.loadingOn();
  //
  //   // finalize używamy, kiedy observable z loadAllCourses()
  //   // będzie completed lub error
  //   const courses$ = this.coursesService.loadAllCourses()
  //     .pipe(
  //       map(courses => courses.sort(sortCoursesBySeqNo)),
  //       // finalize(() => this.loadingService.loadingOff())
  //       catchError(err => {
  //         const message = 'Could not load courses';
  //         this.messagesService.showErrors(message);
  //         console.log(message, err);
  //
  //         // throwError emituje nową observable i kończy natychmiast
  //         // cykl observabli, który tutaj jest w pipe
  //         return throwError(err);
  //       })
  //     );
  //
  //   // wcześniej włączyliśmy loader na początku i zakończyliśmy go
  //   // poprzez finalize. Możemy także poprzez nową observable:
  //   const loadCourses$ = this.loadingService.showLoaderUntilCompleted(courses$);
  //
  //   this.beginnerCourses$ = loadCourses$
  //     .pipe(
  //       map(courses => courses.filter(course => course.category === 'BEGINNER'))
  //     );
  //   this.advancedCourses$ = loadCourses$
  //     .pipe(
  //       map(courses => courses.filter(course => course.category === 'ADVANCED'))
  //     );
  //
  //   // zanim wprowadziliśmy loadCourses$ było tak:
  //   // odwoływaliśmy się do courses$
  //
  //   // this.beginnerCourses$ = courses$
  //   //   .pipe(
  //   //     map(courses => courses.filter(course => course.category === 'BEGINNER'))
  //   //   );
  //   // this.advancedCourses$ = courses$
  //   //   .pipe(
  //   //     map(courses => courses.filter(course => course.category === 'ADVANCED'))
  //   //   );
  // }
}




