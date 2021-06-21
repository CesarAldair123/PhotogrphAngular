import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/Post';
import { PostService } from 'src/app/services/PostService/post.service';
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/AuthService/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  posts: Post[] | undefined;
  faChevronUp = faChevronUp;
  faChevronDown = faChevronDown;

  constructor(private postService: PostService,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.postService.getPosts()
      .subscribe((posts: Post[]) => this.posts = posts);
  }

  upvote(post: Post): void {
    if (!this.authService.userIsLogged()) {
      this.router.navigateByUrl("/login");
      return
    }
    this.postService.upvote(post.id)
      .subscribe(_ => {
        if (post.userVote == 1) {
          post.userVote = 0;
          post.voteCount--;
        } else if (post.userVote == -1) {
          post.userVote = 1;
          post.voteCount += 2;
        } else {
          post.userVote = 1;
          post.voteCount += 1;
        }
      },
        error => {
          console.warn(error);
        })

  }

  downvote(post: Post): void {
    if (!this.authService.userIsLogged()) {
      this.router.navigateByUrl("/login");
      return;
    }
    this.postService.downvote(post.id)
      .subscribe(_ => {
        if (post.userVote == -1) {
          post.userVote = 0;
          post.voteCount++;
        } else if (post.userVote == 1) {
          post.userVote = -1;
          post.voteCount -= 2;
        } else {
          post.userVote = -1;
          post.voteCount -= 1;
        }
      },
        error => {
          console.warn(error);
        });
  }

}
