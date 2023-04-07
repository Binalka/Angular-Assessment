import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private _http: HttpClient) {}

  adduserFn(data: any): Observable<any> {
    return this._http.post('http://localhost:3000/userfn', data);
  }

  updateuserFn(id: number, data: any): Observable<any> {
    return this._http.put(`http://localhost:3000/userfn/${id}`, data);
  }

  getuserFnList(): Observable<any> {
    return this._http.get('http://localhost:3000/userfn');
  }

  deleteuserFn(id: number): Observable<any> {
    return this._http.delete(`http://localhost:3000/userfn/${id}`);
  }
}
