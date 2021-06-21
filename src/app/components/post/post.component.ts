import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PostService } from 'src/app/services/PostService/post.service';
import {Post} from 'src/app/models/Post';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { CommentService } from 'src/app/services/CommentService/comment.service';
import {Comment} from 'src/app/models/Comment'
import { AuthService } from 'src/app/services/AuthService/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommentRequest } from 'src/app/models/CommentRequest';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  post: Post | undefined;
  comments: Comment[] | undefined;
  faChevronUp = faChevronUp;
  faChevronDown = faChevronDown;
  commentForm: FormGroup;

  constructor(private route: ActivatedRoute,
    private postService: PostService,
    private commentService: CommentService,
    private authService: AuthService,
    private router: Router) { 
      this.commentForm = new FormGroup({
        comment: new FormControl("",Validators.required)
      });
    }

  ngOnInit(): void {
    let id = this.route.snapshot.params.id;
    this.getPost(id);
    this.getComments(id);
  }

  getComments(id: number){
    this.commentService.getCommentsByPostId(id)
    .subscribe(comments => {
      this.comments = comments
    })
  }

  getPost(id: number){
    this.postService.getPost(id).subscribe(post=>{
      this.post = post;
    });
  }

  upvote(post: Post | undefined): void{
    if(post == undefined) return;
    if (!this.authService.userIsLogged()) {
      this.router.navigateByUrl("/login");
      return
    }
    this.postService.upvote(post.id)
    .subscribe(_=>{
      if(post.userVote == 1){
        post.userVote = 0;
        post.voteCount--;
      }else if(post.userVote == -1){
        post.userVote = 1;
        post.voteCount += 2;
      }else{
        post.userVote = 1;
        post.voteCount += 1;
      }
    },
    error=>{
      console.warn(error);
    })
    
  }

  downvote(post: Post | undefined): void{
    if(post == undefined) return;
    if (!this.authService.userIsLogged()) {
      this.router.navigateByUrl("/login");
      return
    }
    this.postService.downvote(post.id)
    .subscribe(_=>{
      if(post.userVote == -1){
        post.userVote = 0;
        post.voteCount++;
      }else if(post.userVote == 1){
        post.userVote = -1;
        post.voteCount -= 2;
      }else{
        post.userVote = -1;
        post.voteCount -= 1;
      }
    },
    error=>{
      console.warn(error);
    });
  }

  submitComment(){
    if (!this.authService.userIsLogged()) {
      this.router.navigateByUrl("/login");
      return
    }
    const commentRequest: CommentRequest = {
      postId: this.post?.id,
      comment: this.commentForm.get("comment")?.value
    }
    this.commentService.saveComment(commentRequest)
    .subscribe(_=>{
      Swal.fire("Comment submited","","success");
      this.comments?.push({
        comment: commentRequest.comment,
        username: this.authService.getUsername(),
        created: "now"
      })
    })
  }

}
