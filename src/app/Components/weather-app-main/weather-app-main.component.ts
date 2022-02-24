import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-weather-app-main',
  templateUrl: './weather-app-main.component.html',
  styleUrls: ['./weather-app-main.component.css']
})
export class WeatherAppMainComponent implements OnInit {
  WeatherData:any;
  userIP = '';
  lat= '';
  lon='';
 
  constructor(private httpClient: HttpClient) {} 
  ngOnInit(): void {
    this.loadIp();
    this.WeatherData={
      main:{},
    };
  }

  loadIp() {
    this.httpClient
    .get('https://jsonip.com/')
      .pipe(
        switchMap((value:any) => {
        this.userIP = value.ip;
        let url = `http://api.ipstack.com/${value.ip}?access_key=c0c88c72ecc2e1e47b143d3eceb1a8c6`;
        return this.httpClient.get(url);
        })
      )
      .subscribe(
        (res:any) => {
        console.log(res)
        this.lat = res.latitude;
        this.lon = res.longitude;
        console.log(this.lat);
        console.log(this.lon);
        this.getWeatherData(this.lat, this.lon);
        },
        (error) => {
        console.log(error);
        }
      );
  }

  getWeatherData(lat:any,lon:any){
    fetch('http://api.openweathermap.org/data/2.5/weather?lat='+this.lat+'&lon='+this.lon+'&appid=926fa58b83e23c8c1552c0cdc7bbcd56')
    .then(response=>response.json())
    .then(data=>{this.setWeatherData(data);})
  }

  setWeatherData(data: any){
    this.WeatherData = data;
    this.WeatherData.temp_celsius = (this.WeatherData.main.temp - 273.15).toFixed(0);
  }
}
