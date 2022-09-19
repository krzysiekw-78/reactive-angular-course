import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

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
    return undefined;
  }

  loadingOn() {
    this.loadingSubject.next(true);
  }

  loadingOff() {
    this.loadingSubject.next(false);
  }
}
