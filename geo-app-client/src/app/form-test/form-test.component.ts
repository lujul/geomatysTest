import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  selector: 'app-form-test',
  templateUrl: './form-test.component.html',
  styleUrls: ['./form-test.component.css']
})

export class FormTestComponent implements OnInit {

  constructor(private http: HttpClient) { }
  ngOnInit() {
  }
  @ViewChild('coverFilesInput') imgType: ElementRef;
  uploadSuccess: boolean = false;
  selectedFile: File = null;
  showUpload: boolean = false;
  show: boolean = false;
  showImage: boolean = false;
  showCROP: boolean = false;

  XValidate: boolean = true;
  YValidate: boolean = true;
  HValidate: boolean = true;
  WValidate: boolean = true;
  // tslint:disable-next-line:quotemark
  height: number = 0;
  width: number = 0;
  xCoord: number = 0;
  yCoord: number = 0;
  rectangleH: number = 0;
  rectangleW: number = 0;
  uploadImageSrc = "";

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
    this.http.post<UserResponse>('http://localhost:5000/cropAndUploadFile', fd2).subscribe(res => {
      console.log(res.fileDownloadUri);
      this.uploadImageSrc = res.fileDownloadUri;
    });
  }

}
