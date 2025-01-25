import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');

  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);


  ngOnInit() {
    this.isFetching.set(true);

    const subscription = this.httpClient.get<{ places: Place[] }>('http://localhost:3000/places', {
      observe: 'response' // extra configuration, optional, telling angular this will be a response type
    })
    .pipe( // extra configuration, optional, just taking out body data without headers etc., also with catchError observable, optional
      map((response) => response.body?.places), 
      catchError((error) => throwError(() => new Error('Something went wrong while fetching the data. Please try again later.')))
    )
    .subscribe({
      next: (places) => {
        console.log(places);
        this.places.set(places);
      },
      complete: () => {
        this.isFetching.set(false);
      },
      error: (error) => {
        console.log(error);
        this.error.set(error.message);
      }
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }

}
