import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';

import { Place } from './place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);
  private httpClient = inject(HttpClient);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces('http://localhost:3000/places', 'Something went wrong while fetching the data. Please try again later.')
  }

  loadUserPlaces() {
    return this.fetchPlaces('http://localhost:3000/user-places', 'Something went wrong while fetching the data. Please try again later.')
      .pipe(tap({
        next: (userPlaces) => this.userPlaces.set(userPlaces)
      }));
    // tap = some kind observable of subscription, without subscription, determines what should be happen when other observable emits a new value
  }

  addPlaceToUserPlaces(place: Place) {
    // optimisting updating (updating array before sending http request)
    const prevPlaces = this.userPlaces();

    if (!prevPlaces.some((placeInArray) => placeInArray.id == place.id)) {
      this.userPlaces.set([...prevPlaces, place]);
    }

    return this.httpClient.put('http://localhost:3000/user-places', {
      placeId: place.id
    }).pipe(catchError(error => {
      this.userPlaces.set(prevPlaces);
      return throwError(() => new Error('Failed to store selected place.'));
    }));
  }

  removeUserPlace(place: Place) { }

  private fetchPlaces(url: string, errorMessage: string) {
    return this.httpClient.get<{ places: Place[] }>(url)
      //, { observe: 'response' } // extra configuration, optional, telling angular this will be a response type 
      .pipe( // extra configuration, optional, just taking out body data without headers etc., also with catchError observable, optional
        map((response) => response.places),
        catchError(() => throwError(() => new Error(errorMessage)))
      )
  }
}
