import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-canvas-test',
  templateUrl: './canvas-test.component.html',
  styleUrls: ['./canvas-test.component.css']
})
export class CanvasTestComponent implements OnInit {

  @ViewChild("layout") myCanvas: ElementRef;
  selectedFile: File = null;
  uploadImageSrc = "";
  height: number = 0;
  width: number = 0;
  startX: number = null;
  startY: number = null;
  drag = false;
  constructor() { }
  ngOnInit() {

  }



  onChange(evt: any) {
    this.selectedFile = evt.target.files[0];
    let context: CanvasRenderingContext2D = this.myCanvas.nativeElement.getContext("2d");

    // const image: any = evt.target.files[0];
    let fr = new FileReader();
    fr.onload = (evt2: any) => { // when file has loaded

      var img = new Image();
      img.onload = () => {
        this.width = img.width;
        this.height = img.height;
        context.canvas.height = img.height;
        context.canvas.width = img.width;
        context.drawImage(img, 0, 0);

      };
      img.src = event.target.result;

    //  this.uploadImageSrc = evt2.target.result;

    //  img.src = fr.result; // This is the data URL
    };
   fr.readAsDataURL(this.selectedFile);

  }

  mdEvent(e) {
    //persist starting position
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.drag = true;
  }

  mmEvent(e) {

    if (this.drag) {

      //redraw image on canvas
      let base_image = new Image();
      base_image.src = this.selectedFile;
      let context: CanvasRenderingContext2D = this.myCanvas.nativeElement.getContext("2d");
      let sx = this.startX;
      let sy = this.startY;

      let canvasTop = this.myCanvas.nativeElement.getBoundingClientRect().top;
      let canvasLeft = this.myCanvas.nativeElement.getBoundingClientRect().left;

      base_image.onload = function() {
        context.canvas.height = base_image.height;
        context.canvas.width = base_image.width;
        context.drawImage(base_image, 0, 0);

        //draw rectangle on canvas
        let x = sx - canvasLeft;
        let y = sy - canvasTop;
        let w = e.clientX - canvasLeft - x;
        let h = e.clientY - canvasTop - y;
        context.setLineDash([6]);
        context.strokeRect(x, y, w, h);
      };


    }
  }

  muEvent(e) {
    //draw final rectangle on canvas
    let x = this.startX - this.myCanvas.nativeElement.getBoundingClientRect().left;
    let y = this.startY - this.myCanvas.nativeElement.getBoundingClientRect().top;
    let w = e.clientX - this.myCanvas.nativeElement.getBoundingClientRect().left - x;
    let h = e.clientY - this.myCanvas.nativeElement.getBoundingClientRect().top - y;
    this.myCanvas.nativeElement.getContext("2d").setLineDash([6]);
    this.myCanvas.nativeElement.getContext("2d").strokeRect(x, y, w, h);

    this.drag = false;
  }


}
