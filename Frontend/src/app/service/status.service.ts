import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '@src/environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatusService {


  constructor(private http: HttpClient) {
  }

//   saveSuggestion(message: string, priority: string, feeling: string): Observable<HttpResponse<any>> {
//     const user = sessionStorage.getItem('userId');
//     const body = {
//       message,
//       priority,
//       feeling,
//       user,
//     };
//     return this.http.post<any>(environment.baseUrl + `/api/v1/suggestion`, body);
//   }

  getAllStatusesByUserId(): Observable<any> {
    const userId =sessionStorage.getItem("userId");
    return this.http.get(environment.baseUrl + `/api/v1/status/user/${userId}`);
  }

//   deleteSuggestion(id: number): Observable<any> {
//     return this.http.delete(environment.baseUrl + `/api/v1/suggestion/user/` + id);
//   }
}
