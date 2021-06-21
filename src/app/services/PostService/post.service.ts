import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../../models/Post';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PostRequest } from 'src/app/models/PostRequets';
import { Response } from 'src/app/models/Response';

@Injectable({
  providedIn: 'root'
})
export class PostService{

  constructor(private http: HttpClient) { }

  public save(postRequest: PostRequest): Observable<Response>{
    let data: FormData = new FormData();
    data.append("file", postRequest.file);
    data.append("name",postRequest.name);
    data.append("description",postRequest.description);
    console.log(data);
    return this.http.post<Response>(`${environment.apiUrl}api/post`,data);
  }

  public getPosts(): Observable<Post[]>{
    return this.http.get<Post[]>(`${environment.apiUrl}api/post`);
  }

  public getPost(id: number): Observable<Post>{
    return this.http.get<Post>(`${environment.apiUrl}api/post/${id}`);
  }

  public upvote(id: number): Observable<Response>{
    return this.http.post<Response>(`${environment.apiUrl}api/post/${id}/upvote`, null);
  }

  public downvote(id: number): Observable<Response>{
    return this.http.post<Response>(`${environment.apiUrl}api/post/${id}/downvote`, null);
  }
}
