import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {filter} from 'rxjs/operators';

@Injectable()
export class MessageServices {
  private subject = new BehaviorSubject<string[]>([]);

  // ustawiamy, żeby wywołanie observable
  // nastąpiło jeżeli nie ma pustej tablicy
  errors$: Observable<string[]> = this.subject.asObservable()
    .pipe(
      filter(messages => messages && messages.length > 0)
    );

  showErrors(...errors: string[]) {
    this.subject.next(errors);
  }
}
