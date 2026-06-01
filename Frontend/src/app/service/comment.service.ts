import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@src/environments/environment';
import { ComBody } from '../model/ComBody';
@Injectable({
    providedIn: 'root'
})
export class CommentService {

    constructor(private http: HttpClient) {
    }

    saveComment(comment: string, launchId: Number): Observable<HttpResponse<any>> {
        const body = {
            comment:comment,
            launch:launchId,
            user: sessionStorage.getItem("userId")
        }
        return this.http.post<HttpResponse<any>>(environment.baseUrl + '/api/v1/comments', body, {
            observe: 'response'
        });
    }
    
}
