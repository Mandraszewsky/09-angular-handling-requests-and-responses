import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { HttpEventType, HttpHandlerFn, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';
import { tap } from 'rxjs';

// http interceptor
function loggingInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
    // manipulate request, for example: add special headers
    const req = request.clone({
        headers: request.headers.set('DEBUG', 'TESTING')
    });
    console.log('[Request] = ', request);

    return next(request).pipe(
        tap({
            next: event => {
                if (event.type === HttpEventType.Response) {
                    console.log('[Response] = ', event.body);
                }
            }
        })
    );
}


bootstrapApplication(AppComponent, {
    providers: [provideHttpClient(
        withInterceptors([loggingInterceptor])
    )]
}).catch((err) => console.error(err));
