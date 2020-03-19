import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherBoardService {

  constructor(private http: HttpClient) { }

  readCsvData = () => {
    return this.http.get('../../assets/austin_weather.csv', { responseType: 'text' });
  }
}
