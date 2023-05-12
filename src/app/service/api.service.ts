import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  login(data: any) {
    return this.http.post<any>("http://localhost:8081/api/v1.0/moviebooking/login", data);
  }
}