import { Component, OnInit, signal, inject, DestroyRef } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private placesService = inject(PlacesService);

  isFetching = signal(false);
  error = signal('');
  places = this.placesService.loadedUserPlaces;

  ngOnInit() {
    this.isFetching.set(true);

    const subscription =
      this.placesService.loadUserPlaces().subscribe({
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

  onRemovePlace(place: Place) {
    const subscription =
      this.placesService.removeUserPlace(place).subscribe();

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }
}
