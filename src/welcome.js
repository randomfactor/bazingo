//import {computedFrom} from 'aurelia-framework';
import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

@inject(HttpClient)
export class Welcome {
  heading = 'List of TV Shows from RethinkDB:';
  firstName = 'John';
  lastName = 'Doe';
  previousValue = this.fullName;
  tvShows = [];

  constructor(http) {
    this.http = http;
  }

  activate() {
    /*return this.http.fetch('http://localhost:3000/api/tv-shows')
      .then(response => response.json())
      .then(data => this.tvShows = data.data);*/
    this.tvShows = [{name: "Gilligan's Island"}, {name: "Lost in Space"}];
  }

  //Getters can't be directly observed, so they must be dirty checked.
  //However, if you tell Aurelia the dependencies, it no longer needs to dirty check the property.
  //To optimize by declaring the properties that this getter is computed from, uncomment the line below
  //as well as the corresponding import above.
  //@computedFrom('firstName', 'lastName')
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  submit() {
    this.previousValue = this.fullName;
    alert(`Welcome, ${this.fullName}!`);
  }

  canDeactivate() {
    if (this.fullName !== this.previousValue) {
      return confirm('Are you sure you want to leave?');
    }
  }
}

export class UpperValueConverter {
  toView(value) {
    return value && value.toUpperCase();
  }
}
