export class ImageCropperDataShare {
    constructor() {
        this.share = {};
    }
    setPressed(canvas) {
        this.pressed = canvas;
    }
    setReleased(canvas) {
        if (canvas === this.pressed) {
            //  this.pressed = undefined;
        }
    }
    setOver(canvas) {
        this.over = canvas;
    }
    setStyle(canvas, style) {
        if (this.pressed !== undefined) {
            if (this.pressed === canvas) {
                // TODO: check this
                // angular.element(document.documentElement).css('cursor', style);
            }
        }
        else {
            if (canvas === this.over) {
                // TODO: check this
                // angular.element(document.documentElement).css('cursor', style);
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2VDcm9wcGVyRGF0YVNoYXJlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWltZy1jcm9wcGVyL3NyYy9saWIvaW1hZ2UtY3JvcHBlci9pbWFnZUNyb3BwZXJEYXRhU2hhcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxPQUFPLHFCQUFxQjtJQUFsQztRQUNTLFVBQUssR0FBUSxFQUFFLENBQUM7SUErQnpCLENBQUM7SUEzQlEsVUFBVSxDQUFDLE1BQXlCO1FBQ3pDLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0lBQ3hCLENBQUM7SUFFTSxXQUFXLENBQUMsTUFBeUI7UUFDMUMsSUFBSSxNQUFNLEtBQUssSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUMzQiw2QkFBNkI7U0FDOUI7SUFDSCxDQUFDO0lBRU0sT0FBTyxDQUFDLE1BQXlCO1FBQ3RDLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO0lBQ3JCLENBQUM7SUFFTSxRQUFRLENBQUMsTUFBeUIsRUFBRSxLQUFVO1FBQ25ELElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxTQUFTLEVBQUU7WUFDOUIsSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLE1BQU0sRUFBRTtnQkFDM0IsbUJBQW1CO2dCQUNuQixrRUFBa0U7YUFDbkU7U0FDRjthQUFNO1lBQ0wsSUFBSSxNQUFNLEtBQUssSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDeEIsbUJBQW1CO2dCQUNuQixrRUFBa0U7YUFDbkU7U0FDRjtJQUNILENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBJbWFnZUNyb3BwZXJEYXRhU2hhcmUge1xuICBwdWJsaWMgc2hhcmU6IGFueSA9IHt9O1xuICBwdWJsaWMgcHJlc3NlZDogSFRNTENhbnZhc0VsZW1lbnQ7XG4gIHB1YmxpYyBvdmVyOiBIVE1MQ2FudmFzRWxlbWVudDtcblxuICBwdWJsaWMgc2V0UHJlc3NlZChjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50KTogdm9pZCB7XG4gICAgdGhpcy5wcmVzc2VkID0gY2FudmFzO1xuICB9XG5cbiAgcHVibGljIHNldFJlbGVhc2VkKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQpOiB2b2lkIHtcbiAgICBpZiAoY2FudmFzID09PSB0aGlzLnByZXNzZWQpIHtcbiAgICAgIC8vICB0aGlzLnByZXNzZWQgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHNldE92ZXIoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCk6IHZvaWQge1xuICAgIHRoaXMub3ZlciA9IGNhbnZhcztcbiAgfVxuXG4gIHB1YmxpYyBzZXRTdHlsZShjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCBzdHlsZTogYW55KTogdm9pZCB7XG4gICAgaWYgKHRoaXMucHJlc3NlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAodGhpcy5wcmVzc2VkID09PSBjYW52YXMpIHtcbiAgICAgICAgLy8gVE9ETzogY2hlY2sgdGhpc1xuICAgICAgICAvLyBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KS5jc3MoJ2N1cnNvcicsIHN0eWxlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGNhbnZhcyA9PT0gdGhpcy5vdmVyKSB7XG4gICAgICAgIC8vIFRPRE86IGNoZWNrIHRoaXNcbiAgICAgICAgLy8gYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkuY3NzKCdjdXJzb3InLCBzdHlsZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=