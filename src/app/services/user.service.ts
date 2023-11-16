import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpEvent, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { CustomHttpRespone } from '../models/custom-http-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private host: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /*//Afficher liste des users
  public getUsers():Observable<User[]>{
    return this.http.get<User[]>(`${this.host}/user/listUsers`);
  }*/

  public getUsers(): Observable<User[] | HttpErrorResponse> {
      return this.http.get<User[]>(`${this.host}/user/listUsers`);
  }

  public addUser(formData: FormData): Observable<User | HttpErrorResponse> {
    return this.http.post<User>(`${this.host}/user/addNewUser`, formData);
  }

  /*public updateUser(formData: FormData): Observable<User | HttpErrorResponse> {
    return this.http.post<User>(`${this.host}/user/updateUser`, formData);
  }*/

  updateUser(formData: FormData): Observable<User | HttpErrorResponse> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.http.post<User>(`${this.host}/user/updateUser`, formData, { headers });
  }

  public resetPassword(email: string): Observable<any | HttpErrorResponse> {
    return this.http.get(`${this.host}/user/resetPassword/${email}`);
  }

  public updateProfileImage(formData: FormData): Observable<HttpEvent<User>> {
    return this.http.post<User>(`${this.host}/user/updateProfileImage`, formData,
    {reportProgress: true,
      observe: 'events'
    });
  }

  public deleteUser(username: string): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.delete<CustomHttpRespone>(`${this.host}/user/deleteUser/${username}`);
  }

  public addUsersToLocalCache(users: User[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

  public getUsersFromLocalCache(): User[]  {
    if (localStorage.getItem('users')) {
      return JSON.parse(localStorage.getItem('users'));
    }
    return null;
  }

  findUserById(id: any):Observable<User> {
    return this.http.get<User>(`${this.host}/user/getUserById/${id}`)
  }

  public createUserFormData(loggedInUsername: string, user: User, profileImage: File): FormData  {
    const formData = new FormData();
    formData.append('currentUsername', loggedInUsername);
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);
    formData.append('username', user.username);
    formData.append('password', user.password);
    formData.append('email', user.email);
    formData.append('role', user.role);
    formData.append('profileImage', profileImage);
    formData.append('isActive', JSON.stringify(user.active));
    formData.append('isNonLocked', JSON.stringify(user.notLocked));
    return formData;

  }

}
