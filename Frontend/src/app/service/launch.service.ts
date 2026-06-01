import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '@src/environments/environment';
import {LaunchBody} from '@src/app/model/LaunchBody';

@Injectable({
  providedIn: 'root'
})
export class LaunchService {

  constructor(private http: HttpClient) {
  }

  createLaunch(file: File, description: string, feeling: string): Observable<HttpResponse<any>> {
    const userId: string | null = sessionStorage.getItem('userId');
    const body: FormData = new FormData();
    body.append('file', file);
    body.append('description', description);
    body.append('feeling', feeling);
    // @ts-ignore
    body.append('user', userId);
    console.log(body)
    return this.http.post<HttpResponse<any>>(environment.baseUrl + '/api/v1/launches', body, {
      observe: 'response'
    });
  }

  getAllLaunches(): Observable<any> {
    return this.http.get<LaunchBody>(environment.baseUrl + `/api/v1/launches`);
  }

  getRelevantLaunches(): Observable<any> {
    const id = sessionStorage.getItem('userId');
    return this.http.get<LaunchBody>(environment.baseUrl + `/api/v1/launches/user/${id}`);
  }
}

