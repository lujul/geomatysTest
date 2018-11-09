import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';


export interface UserResponse {
  fileDownloadUri: string;
  fileName: string;
  fileType: string;
  height: string;
  size: string;
  width: string;

}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  @ViewChild('coverFilesInput') imgType: ElementRef;
  uploadSuccess = false;
  selectedFile: File = null;

  showUpload = false;
  XValidate = true;
  YValidate = true;
  HValidate = true;
  WValidate = true;
  show = false;
  showImage = false;
  showCROP = false;

  // tslint:disable-next-line:quotemark
  height = 0;
  width = 0;
  xCoord = 0;
  yCoord = 0;
  rectangleH = 0;
  rectangleW = 0;
  uploadImageSrc = "";

  constructor(private http: HttpClient) { }
  onFileSelected(e) {
    this.selectedFile = <File>e.target.files[0];
    this.showUpload = true;
  }

  onChange(evt: any) {

    this.uploadSuccess = true;
    this.selectedFile = evt.target.files[0];
    // const image: any = evt.target.files[0];
    let fr = new FileReader();
    fr.onload = (evt2: any) => { // when file has loaded
      var img = new Image();

      img.onload = () => {
        this.width = img.width;
        this.height = img.height;
      
      };
      this.uploadImageSrc = evt2.target.result;
      img.src = fr.result; // This is the data URL 
    };

    fr.readAsDataURL(this.selectedFile);
    this.imgType.nativeElement.value = "";
    this.showUpload = true;
    this.showImage = true;
    this.show = true;
  }



  onUpload() {
    const fd = new FormData();
    fd.append('file', this.selectedFile, this.selectedFile.name);

    this.http.post<UserResponse>('http://localhost:8080/uploadFile', fd).subscribe(res => {
      console.log(res.fileDownloadUri);
      this.uploadImageSrc = res.fileDownloadUri;
      this.showImage = true;
      this.show = true;
      this.height = +res.height;
      this.width = +res.width;
    });

  }
  changeX(event) {
    console.log(event);
    this.xCoord = +event;
    if (this.xCoord <= this.height) {
      this.XValidate = true;


    } else {
      console.log("non valide");
      this.XValidate = false;
    }
    this.testShowCROP();
  }

  changeY(event) {
    this.yCoord = +event;
    if (this.yCoord <= this.width) {
      this.YValidate = true;


    } else {
      console.log("non valide");
      this.YValidate = false;
    }
    this.testShowCROP();
  }
  changeRectangleH(event) {
    this.rectangleH = +event;
    if (this.rectangleH <= this.height - this.xCoord && this.rectangleH >= 0) {
      this.HValidate = true;


    } else {
      console.log("non valide");
      this.HValidate = false;
    }
    this.testShowCROP();
  }

  changeRectangleW(event) {
    this.rectangleW = +event;
    if (this.rectangleW <= this.width - this.yCoord && this.rectangleW >= 0) {
      this.WValidate = true;


    } else {
      console.log("non valide");
      this.WValidate = false;
    }
    this.testShowCROP();

  }
  testShowCROP() {
    if (this.rectangleH >= 1 && this.rectangleW >= 1 && this.XValidate && this.YValidate) {
      this.showCROP = true;

    } else {
      this.showCROP = false;
    }
  }

  onSubmit() {
    const fd2 = new FormData();
    fd2.append('file', this.selectedFile, this.selectedFile.name);
    fd2.append('xCoord', '' + this.xCoord);
    fd2.append('yCoord', '' + this.yCoord);
    fd2.append('hRect', '' + this.rectangleW);
    fd2.append('wRect', '' + this.rectangleH);

    this.http.post<UserResponse>('http://localhost:8080/cropAndUploadFile', fd2).subscribe(res => {
      console.log(res.fileDownloadUri);
      this.uploadImageSrc = res.fileDownloadUri;


    });

  }


}
