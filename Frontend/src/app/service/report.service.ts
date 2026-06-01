import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@src/environments/environment';
import {Report} from '@src/app/model/Report';
import {Observable} from 'rxjs';
import {HttpResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) {
  }

  saveReport(message: string, mediaFile: any): Observable<HttpResponse<any>> {
    const userId = sessionStorage.getItem('userId');
    // @ts-ignore
    const report = new Report(message, mediaFile, userId);
    return this.http.post<any>(environment.baseUrl + `/api/v1/reports`, report);
  }
}
