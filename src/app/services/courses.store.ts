import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {catchError, map, shareReplay, tap} from 'rxjs/operators';
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

  constructor(private http: HttpClient,
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

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    // last emitted value from subject
    const courses = this.subject.getValue();

    const index = courses.findIndex(course => course.id == courseId);

    const newCourse: Course = {
      ...courses[index],
      ...changes
    }
    const newCourses: Course[] = courses.slice(0);
    newCourses[index] = newCourse;

    this.subject.next(newCourses);

   return this.http.put(`/api/courses/${courseId}`, changes)
     .pipe(
       catchError(err => {
         const message = 'Could not save courses';
         this.messages.showErrors(message);
         return throwError(err);
       }),
       shareReplay()
     );
  }

  private loadAllCourses() {
    const loadCourses$ = this.http.get<Course[]>('/api/courses')
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
