import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {concatMap, finalize, switchAll, switchMap, tap} from 'rxjs/operators';

@Injectable()
export class LoadingService {

  // z Subject możemy kontrolować
  // kiedy loading$ emituje true albo false
  // behaviorSubject, bo pamięta ostatnią wartość emitowaną przez subject
  // oraz musi mieć wartość początkową
  private loadingSubject = new BehaviorSubject<boolean>(false);

  // bo nie chcemy eskponować loadingSubject
  // tylko chcemy kontrolować wartość true or false
  // poprzez observable loading$
  // ale chodzi o to, że do loading$ będzie można się TYLKO zasubskrybować
  // i odczytać wartość (a nie ją kontrolować)
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  // obs$ - Observable, that we want to track
  // returns another observable of the same type
  showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    // null, aby zainicjować observable
    return of(null)
      .pipe(
        // po zainicjowaniu nullem, włączamy loader
        tap(() => this.loadingOn()),
        // w przykładzie był concatMap, ale chodzi o to, że przełączamy się na wartość
        // emitowaną przez input observable obs$
        switchMap(() => obs$),
        // kiedy input observable obs$ przestaje emitować wartości
        // wyłączamy loader
        finalize(() => this.loadingOff())
      )
  }
  // tu indicator pojawi się tylko, jeżeli wogóle zasubskrybujemy się do observabla

  loadingOn() {
    this.loadingSubject.next(true);
  }

  loadingOff() {
    this.loadingSubject.next(false);
  }
}
