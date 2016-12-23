import {WebAPI} from './web-api';

export class App {
  static inject() { return [WebAPI]; }

  constructor(api) {
    this.api = api;
  }

  configureRouter(config, router){
    config.title = 'Growfolio';
    config.map([
      { route: '',              moduleId: 'portfolio',   title: 'Portfolio'},
      // { route: 'contacts/:id',  moduleId: 'contact-detail', name:'contacts' }
    ]);

    this.router = router;
  }
}