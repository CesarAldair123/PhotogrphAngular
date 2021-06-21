import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PostRequest } from 'src/app/models/PostRequets';
import { AuthService } from 'src/app/services/AuthService/auth.service';
import { PostService } from 'src/app/services/PostService/post.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  postForm: FormGroup;
  file: File | undefined | null;
  error: boolean = false;

  constructor(private postService: PostService,
    private authService: AuthService,
    private router: Router) { 
    this.postForm = new FormGroup({
      title: new FormControl("",Validators.required),
      description: new FormControl("",Validators.required),
      filePath: new FormControl("", Validators.required)
    });
  }

  ngOnInit(): void {
  }

  get description(){
    return this.postForm.get("description");
  }

  get title(){
    return this.postForm.get("title");
  }

  selectFile(event: Event){
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    this.file = fileList?.item(0);
  }

  onSubmit(){
    if (!this.authService.userIsLogged()) {
      this.router.navigateByUrl("/login");
      return
    }
    if(!(this.title && this.description && this.file)){
      this.error = true;
      return;
    }

    const postRequest: PostRequest = {
      name: this.title.value,
      description: this.description.value,
      file: this.file as File
    };

    this.postService.save(postRequest)
    .subscribe(res=>{
      console.log(res);
      Swal.fire("Post Submitted","","success");
      this.postForm.reset();
    });
  }
}
