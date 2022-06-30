import './polyfills';
//import './i18n';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

export function bootstrap() {
  return platformBrowserDynamic()
    .bootstrapModule(AppModule).catch((err) => console.log(err));
}
