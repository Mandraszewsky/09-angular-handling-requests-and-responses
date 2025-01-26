import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesService } from '../places.service';

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

  private destroyRef = inject(DestroyRef);
  private placesService = inject(PlacesService);


  ngOnInit() {
    this.isFetching.set(true);

    const subscription =
      this.placesService.loadAvailablePlaces().subscribe({
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

  onSelectPlace(selectedPlace: Place) {
    const subscription =
      this.placesService.addPlaceToUserPlaces(selectedPlace).subscribe({
        next: (respone) => console.log(respone)
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }

}
