import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {Comment} from 'src/app/models/Comment'
import { CommentRequest } from 'src/app/models/CommentRequest';
import { Response } from 'src/app/models/Response';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  getCommentsByPostId(id: number): Observable<Comment[]>{
    return this.http.get<Comment[]>(`${environment.apiUrl}api/comment?post=${id}`);
  }

  saveComment(commentRequest: CommentRequest): Observable<Response>{
    return this.http.post<Response>(`${environment.apiUrl}api/comment`,commentRequest);
  }
}
