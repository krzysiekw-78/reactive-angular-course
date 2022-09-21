import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Course} from '../model/course';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import * as moment from 'moment';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {CoursesService} from '../services/courses.service';
import {LoadingService} from '../loading/loading.service';
import {MessageServices} from '../messages/message.services';

@Component({
  selector: 'course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.css'],
  providers: [
    LoadingService,
    MessageServices
  ]
})
export class CourseDialogComponent implements AfterViewInit {

  // zwrócmy uwagę na to, że LoadingService umieszczony jest jako osobny provider
  // zarówno tu, jak i w app component
  // stworzone zostaną zatem dwie instancje tego serwisu
  // jednak, gdy wywołamy tutaj metodę włączającą loader (umieszczony w app.component) na widoku html
  // to się on nie włączy - bo jest powiązany z instancją loader serwisu, ale tą z app. component
  // i wszystkich umieszczonych poniżej w tej gałęzi komponentów
  // okno dialogowe (material) pochodzi zaś z zupełnie innej gałęzi
  // stąd na widoku html musimy dodać taki <loading>, aby loader zadziałał

  form: FormGroup;

  course: Course;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course,
    private coursesService: CoursesService,
    private loadingService: LoadingService,
    private messagesService: MessageServices) {

    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required]
    });

  }

  ngAfterViewInit() {

  }

  save() {
    const changes = this.form.value;

    const saveCourses$ = this.coursesService.saveCourse(this.course.id, changes)
      .pipe(
        catchError(err => {
          const message = 'Could not save course';
          console.log(message, err);
          this.messagesService.showErrors(message);
          return throwError(err);
        })
      );

    // i teraz, żeby zadziałał loader, zmieniamy zapis, aby metoda z loader serwisu
    // obserwowała utwotrzoną wyżej zmienną

    this.loadingService.showLoaderUntilCompleted(saveCourses$)
      .subscribe(
        val => {
          this.dialogRef.close(val);
        }
      );
  }

  // WCZEŚNIEJ:
  // save() {
  //   const changes = this.form.value;
  //   this.coursesService.saveCourse(this.course.id, changes)
  //     .subscribe(
  //       val => {
  //         this.dialogRef.close(val);
  //       }
  //     );
  // }

  close() {
    this.dialogRef.close();
  }

}
