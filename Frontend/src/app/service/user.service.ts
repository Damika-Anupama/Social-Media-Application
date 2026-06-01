import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '@src/environments/environment';
import {UserProfileBody} from '@src/app/model/UserProfileBody';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  sendVerificationCode(num: number, email: string) {
    const body = {
      recipient: email,
      msgBody: num,
      subject: 'Verification Code - Palindrome Sign-up',
    }
    this.http.post(environment.baseUrl + `/api/v1/mails/sendMail`, body)
  }
  constructor(private http: HttpClient) {
  }

  createAccount(uname: string, email: string, contactNumber: string, sex: string, pwd: string): Observable<HttpResponse<any>> {
    let gender: string;
    if (sex === 'Male') {
      gender = 'MALE';
    } else if (sex === 'Female') {
      gender = 'FEMALE';
    } else {
      gender = 'OTHER';
    }

    const body = {
      username: uname,
      password: pwd,
      role: 'USER',
      email,
      gender,
      shortDescription: 'Hello, I\'m a newbie 🐰',
      contactNum: contactNumber
    };
    return this.http.post<HttpResponse<any>>(environment.baseUrl + `/api/v1/users`, body, {
      observe: 'response'
    });
  }

  findUser(query: string): Observable<string> {
    const httpParams = new HttpParams().append('q', query)
      .append('ignoreProgressBar', '');
    return this.http.get<string>(environment.baseUrl + `/api/v1/users/name/` + query);
  }
  findEmail(query: string): Observable<string> {
    const httpParams = new HttpParams().append('q', query)
      .append('ignoreProgressBar', '');
    return this.http.get<string>(environment.baseUrl + `/api/v1/users/email/` + query);
  }
  getUserDetailsById(query: string | null): Observable<any> {
    return this.http.get<any>(environment.baseUrl + `/api/v1/users/${query}`);
  }

  getProfilePic(query: string | null): Observable<any> {
    return this.http.get<any>(environment.baseUrl + `/api/v1/users/picture/` + query);
  }

  authenticate(uname: string, pwd: string): Observable<any> {
    const body: FormData = new FormData();
    body.append('username',uname)
    body.append('password',pwd)
    return this.http.post(environment.baseUrl + `/api/v1/authenticate`, body);
  }

  updateUser(userId: string, profilePic: string, shortDes: string, username: string, email: string, phoneNumber: string): Observable<any> {
    const body: FormData = new FormData();
    body.append('id', userId);
    body.append('username', username);
    body.append('email', email);
    body.append('shortDes', shortDes);
    body.append('profilePic', profilePic);
    body.append('phoneNum', phoneNumber);
    console.log(userId,username,)
    return this.http.put(environment.baseUrl + `/api/v1/users/${userId}`, body,{
      headers : new HttpHeaders({
        // 'Content-Type': 'multipart/form-data'
      })
    });
  }
  // return this.http.put(environment.baseUrl + `/api/v1/users/${userId}`, body,{
  
  getProfileInfo(userId: string | null): Observable<UserProfileBody> {
    return this.http.get<UserProfileBody>(environment.baseUrl + '/api/v1/users/info/' + userId);
  }
}
