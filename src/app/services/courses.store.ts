import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {catchError, map, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {LoadingService} from '../loading/loading.service';
import {MessageServices} from '../messages/message.services';

@Injectable({
  providedIn: 'root'
})
export class CoursesStore {
  private subject = new BehaviorSubject<Course[]>([]);

  // user będzie miał dostęp do wartości courses
  // bez dostępu do wartości emitowanej przez subject (bo jest private)
  courses$: Observable<Course[]> = this.subject.asObservable();

  constructor(private hhtp: HttpClient,
              private loading: LoadingService,
              private messages: MessageServices) {
    this.loadAllCourses();
  }

  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$
      .pipe(
        map(courses =>
          courses.filter(course => course.category === category)
            .sort(sortCoursesBySeqNo)
        )
      )
  }

  private loadAllCourses() {
    const loadCourses$ = this.hhtp.get<Course[]>('/api/courses')
      .pipe(
        map(response => response['payload']),
        catchError(err => {
          const message = 'Could not load courses';
          this.messages.showErrors(message);
          return throwError(err);
        }),
        tap(courses => this.subject.next(courses))
      );
    this.loading.showLoaderUntilCompleted(loadCourses$)
      .subscribe();
  }

}
