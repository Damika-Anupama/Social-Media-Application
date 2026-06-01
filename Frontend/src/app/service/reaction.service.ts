import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@src/environments/environment';
import { ComBody } from '../model/ComBody';
@Injectable({
    providedIn: 'root'
})
export class ReactionService {

    constructor(private http: HttpClient) {
    }

    saveReaction(type: string, launchId: Number): Observable<HttpResponse<any>> {
        const body = {
            type:type,
            launchId:launchId,
            userId: sessionStorage.getItem("userId")
        }
        return this.http.post<HttpResponse<any>>(environment.baseUrl + '/api/v1/reactions', body, {
            observe: 'response'
        });
    }
    
    updateReaction(type: string, launchId: Number, reactionId: Number): Observable<HttpResponse<any>> {
        const body = {
            type:type,
            reactionId:reactionId,
            launchId:launchId,
            userId: sessionStorage.getItem("userId")
        }
        return this.http.put<HttpResponse<any>>(environment.baseUrl + `/api/v1/reactions/${reactionId}`, body, {
            observe: 'response'
        });
    }    
}
