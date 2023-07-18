import { Component, ViewChild, Input, Output, EventEmitter, Inject } from '@angular/core';
import { CropperSettings } from './cropper-settings';
import { ImageCropper } from './imageCropper';
import { CropPosition } from './model/cropPosition';
import { Exif } from './exif';
import { DOCUMENT } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class ImageCropperComponent {
    constructor(renderer, document) {
        this.document = document;
        this.cropPositionChange = new EventEmitter();
        this.exif = new Exif();
        // tslint:disable-next-line:no-output-on-prefix
        this.onCrop = new EventEmitter();
        this.imageSet = new EventEmitter();
        this.dragUnsubscribers = [];
        this.renderer = renderer;
    }
    ngAfterViewInit() {
        const canvas = this.cropcanvas.nativeElement;
        if (!this.settings) {
            this.settings = new CropperSettings();
        }
        if (this.settings.cropperClass) {
            this.renderer.setAttribute(canvas, 'class', this.settings.cropperClass);
        }
        if (!this.settings.dynamicSizing) {
            this.renderer.setAttribute(canvas, 'width', this.settings.canvasWidth.toString());
            this.renderer.setAttribute(canvas, 'height', this.settings.canvasHeight.toString());
        }
        else {
            this.windowListener = this.resize.bind(this);
            window.addEventListener('resize', this.windowListener);
        }
        if (!this.cropper) {
            this.cropper = new ImageCropper(this.settings);
        }
        this.cropper.prepare(canvas);
    }
    ngOnChanges(changes) {
        if (this.isCropPositionChanged(changes)) {
            this.cropper.updateCropPosition(this.cropPosition.toBounds());
            if (this.cropper.isImageSet()) {
                const bounds = this.cropper.getCropBounds();
                this.image.image = this.cropper.getCroppedImageHelper().src;
                this.onCrop.emit(bounds);
            }
            this.updateCropBounds();
        }
        if (changes.inputImage) {
            this.setImage(changes.inputImage.currentValue);
        }
        if (changes.settings && this.cropper) {
            this.cropper.updateSettings(this.settings);
            if (this.cropper.isImageSet()) {
                this.image.image = this.cropper.getCroppedImageHelper().src;
                this.onCrop.emit(this.cropper.getCropBounds());
            }
        }
    }
    ngOnDestroy() {
        this.removeDragListeners();
        if (this.settings.dynamicSizing && this.windowListener) {
            window.removeEventListener('resize', this.windowListener);
        }
    }
    onTouchMove(event) {
        this.cropper.onTouchMove(event);
    }
    onTouchStart(event) {
        this.cropper.onTouchStart(event);
    }
    onTouchEnd(event) {
        this.cropper.onTouchEnd(event);
        if (this.cropper.isImageSet()) {
            this.image.image = this.cropper.getCroppedImageHelper().src;
            this.onCrop.emit(this.cropper.getCropBounds());
            this.updateCropBounds();
        }
    }
    onMouseDown(event) {
        this.dragUnsubscribers.push(this.renderer.listen(this.document, 'mousemove', this.onMouseMove.bind(this)));
        this.dragUnsubscribers.push(this.renderer.listen(this.document, 'mouseup', this.onMouseUp.bind(this)));
        this.cropper.onMouseDown(event);
        // if (!this.cropper.isImageSet() && !this.settings.noFileInput) {
        //   // load img
        //   this.fileInput.nativeElement.click();
        // }
    }
    removeDragListeners() {
        this.dragUnsubscribers.forEach(unsubscribe => unsubscribe());
    }
    onMouseUp(event) {
        this.removeDragListeners();
        if (this.cropper.isImageSet()) {
            this.cropper.onMouseUp(event);
            this.image.image = this.cropper.getCroppedImageHelper().src;
            this.onCrop.emit(this.cropper.getCropBounds());
            this.updateCropBounds();
        }
    }
    onMouseMove(event) {
        this.cropper.onMouseMove(event);
    }
    fileChangeListener($event) {
        if ($event.target.files.length === 0) {
            return;
        }
        const file = $event.target.files[0];
        if (this.settings.allowedFilesRegex.test(file.name)) {
            const image = new Image();
            const fileReader = new FileReader();
            fileReader.addEventListener('loadend', (loadEvent) => {
                image.addEventListener('load', () => {
                    this.setImage(image);
                });
                image.src = loadEvent.target.result;
            });
            fileReader.readAsDataURL(file);
        }
    }
    resize() {
        const canvas = this.cropcanvas.nativeElement;
        this.settings.canvasWidth = canvas.offsetWidth;
        this.settings.canvasHeight = canvas.offsetHeight;
        this.cropper.resizeCanvas(canvas.offsetWidth, canvas.offsetHeight, true);
    }
    reset() {
        this.cropper.reset();
        this.renderer.setAttribute(this.cropcanvas.nativeElement, 'class', this.settings.cropperClass);
        this.image.image = this.cropper.getCroppedImageHelper().src;
    }
    setImage(image, newBounds = null) {
        this.imageSet.emit(true);
        this.renderer.setAttribute(this.cropcanvas.nativeElement, 'class', `${this.settings.cropperClass} ${this.settings.croppingClass}`);
        this.raf = window.requestAnimationFrame(() => {
            if (this.raf) {
                window.cancelAnimationFrame(this.raf);
            }
            if (image.naturalHeight > 0 && image.naturalWidth > 0) {
                image.height = image.naturalHeight;
                image.width = image.naturalWidth;
                window.cancelAnimationFrame(this.raf);
                this.getOrientedImage(image, (img) => {
                    if (this.settings.dynamicSizing) {
                        const canvas = this.cropcanvas.nativeElement;
                        this.settings.canvasWidth = canvas.offsetWidth;
                        this.settings.canvasHeight = canvas.offsetHeight;
                        this.cropper.resizeCanvas(canvas.offsetWidth, canvas.offsetHeight, false);
                    }
                    this.cropper.setImage(img);
                    if (this.cropPosition && this.cropPosition.isInitialized()) {
                        this.cropper.updateCropPosition(this.cropPosition.toBounds());
                    }
                    this.image.original = img;
                    let bounds = this.cropper.getCropBounds();
                    this.image.image = this.cropper.getCroppedImageHelper().src;
                    if (!this.image) {
                        this.image = image;
                    }
                    if (newBounds != null) {
                        bounds = newBounds;
                        this.cropper.setBounds(bounds);
                        this.cropper.updateCropPosition(bounds);
                    }
                    this.onCrop.emit(bounds);
                });
            }
        });
    }
    isCropPositionChanged(changes) {
        if (this.cropper &&
            changes.cropPosition &&
            this.isCropPositionUpdateNeeded) {
            return true;
        }
        else {
            this.isCropPositionUpdateNeeded = true;
            return false;
        }
    }
    updateCropBounds() {
        const cropBound = this.cropper.getCropBounds();
        this.cropPositionChange.emit(new CropPosition(cropBound.left, cropBound.top, cropBound.width, cropBound.height));
        this.isCropPositionUpdateNeeded = false;
    }
    getOrientedImage(image, callback) {
        let img;
        this.exif.getData(image, () => {
            const orientation = this.exif.getTag(image, 'Orientation');
            if ([3, 6, 8].indexOf(orientation) > -1) {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                let cw = image.width;
                let ch = image.height;
                let cx = 0;
                let cy = 0;
                let deg = 0;
                switch (orientation) {
                    case 3:
                        cx = -image.width;
                        cy = -image.height;
                        deg = 180;
                        break;
                    case 6:
                        cw = image.height;
                        ch = image.width;
                        cy = -image.height;
                        deg = 90;
                        break;
                    case 8:
                        cw = image.height;
                        ch = image.width;
                        cx = -image.width;
                        deg = 270;
                        break;
                    default:
                        break;
                }
                canvas.width = cw;
                canvas.height = ch;
                ctx.rotate((deg * Math.PI) / 180);
                ctx.drawImage(image, cx, cy);
                img = document.createElement('img');
                img.width = cw;
                img.height = ch;
                img.addEventListener('load', () => {
                    callback(img);
                });
                img.src = canvas.toDataURL('image/png');
            }
            else {
                img = image;
                callback(img);
            }
        });
    }
}
ImageCropperComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.8", ngImport: i0, type: ImageCropperComponent, deps: [{ token: i0.Renderer2 }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Component });
ImageCropperComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.8", type: ImageCropperComponent, selector: "img-cropper", inputs: { settings: "settings", image: "image", inputImage: "inputImage", cropper: "cropper", cropPosition: "cropPosition" }, outputs: { cropPositionChange: "cropPositionChange", onCrop: "onCrop", imageSet: "imageSet" }, viewQueries: [{ propertyName: "cropcanvas", first: true, predicate: ["cropcanvas"], descendants: true, static: true }, { propertyName: "fileInput", first: true, predicate: ["fileInput"], descendants: true }], usesOnChanges: true, ngImport: i0, template: "<span class=\"ng2-imgcrop\">\n  <input\n    *ngIf=\"!settings.noFileInput\"\n    #fileInput\n    type=\"file\"\n    accept=\"image/*\"\n    (change)=\"fileChangeListener($event)\"\n  />\n  <canvas\n    #cropcanvas\n    (mousedown)=\"onMouseDown($event)\"\n    (touchmove)=\"onTouchMove($event)\"\n    (touchend)=\"onTouchEnd($event)\"\n    (touchstart)=\"onTouchStart($event)\"\n  >\n  </canvas>\n</span>\n", dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.8", ngImport: i0, type: ImageCropperComponent, decorators: [{
            type: Component,
            args: [{ selector: 'img-cropper', template: "<span class=\"ng2-imgcrop\">\n  <input\n    *ngIf=\"!settings.noFileInput\"\n    #fileInput\n    type=\"file\"\n    accept=\"image/*\"\n    (change)=\"fileChangeListener($event)\"\n  />\n  <canvas\n    #cropcanvas\n    (mousedown)=\"onMouseDown($event)\"\n    (touchmove)=\"onTouchMove($event)\"\n    (touchend)=\"onTouchEnd($event)\"\n    (touchstart)=\"onTouchStart($event)\"\n  >\n  </canvas>\n</span>\n" }]
        }], ctorParameters: function () { return [{ type: i0.Renderer2 }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; }, propDecorators: { cropcanvas: [{
                type: ViewChild,
                args: ['cropcanvas', { static: true }]
            }], fileInput: [{
                type: ViewChild,
                args: ['fileInput']
            }], settings: [{
                type: Input
            }], image: [{
                type: Input
            }], inputImage: [{
                type: Input
            }], cropper: [{
                type: Input
            }], cropPosition: [{
                type: Input
            }], cropPositionChange: [{
                type: Output
            }], onCrop: [{
                type: Output
            }], imageSet: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2UtY3JvcHBlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtaW1nLWNyb3BwZXIvc3JjL2xpYi9pbWFnZS1jcm9wcGVyL2ltYWdlLWNyb3BwZXIuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWltZy1jcm9wcGVyL3NyYy9saWIvaW1hZ2UtY3JvcHBlci9pbWFnZS1jcm9wcGVyLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBSVQsU0FBUyxFQUVULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUVHLE1BQU0sRUFDdEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3JELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFFcEQsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUM5QixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7OztBQU8zQyxNQUFNLE9BQU8scUJBQXFCO0lBZ0NoQyxZQUFZLFFBQW1CLEVBQ08sUUFBUTtRQUFSLGFBQVEsR0FBUixRQUFRLENBQUE7UUFyQnZDLHVCQUFrQixHQUErQixJQUFJLFlBQVksRUFFckUsQ0FBQztRQUVJLFNBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1FBRTFCLCtDQUErQztRQUM5QixXQUFNLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDdEQsYUFBUSxHQUEwQixJQUFJLFlBQVksRUFBVyxDQUFDO1FBVWhFLHNCQUFpQixHQUFtQixFQUFFLENBQUM7UUFJN0MsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDM0Is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QUFDO2dCQUNwQyxHQUFHLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztnQkFDZixHQUFHLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztnQkFDaEIsR0FBRyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7b0JBQ2hDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDaEIsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsR0FBRyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2FBQ3pDO2lCQUFNO2dCQUNMLEdBQUcsR0FBRyxLQUFLLENBQUM7Z0JBQ1osUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ2Y7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7O2tIQWxVVSxxQkFBcUIsMkNBaUNaLFFBQVE7c0dBakNqQixxQkFBcUIsc2ZDekJsQyx3WkFpQkE7MkZEUWEscUJBQXFCO2tCQUxqQyxTQUFTOytCQUVFLGFBQWE7OzBCQW9DVixNQUFNOzJCQUFDLFFBQVE7NENBOUI1QixVQUFVO3NCQURULFNBQVM7dUJBQUMsWUFBWSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtnQkFFakIsU0FBUztzQkFBaEMsU0FBUzt1QkFBQyxXQUFXO2dCQUVOLFFBQVE7c0JBQXZCLEtBQUs7Z0JBQ1UsS0FBSztzQkFBcEIsS0FBSztnQkFDVSxVQUFVO3NCQUF6QixLQUFLO2dCQUNVLE9BQU87c0JBQXRCLEtBQUs7Z0JBQ1UsWUFBWTtzQkFBM0IsS0FBSztnQkFFQyxrQkFBa0I7c0JBRHhCLE1BQU07Z0JBUVUsTUFBTTtzQkFBdEIsTUFBTTtnQkFDRyxRQUFRO3NCQUFqQixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBBZnRlclZpZXdJbml0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgVmlld0NoaWxkLFxuICBFbGVtZW50UmVmLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIFJlbmRlcmVyMixcbiAgU2ltcGxlQ2hhbmdlcywgSW5qZWN0XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ3JvcHBlclNldHRpbmdzIH0gZnJvbSAnLi9jcm9wcGVyLXNldHRpbmdzJztcbmltcG9ydCB7IEltYWdlQ3JvcHBlciB9IGZyb20gJy4vaW1hZ2VDcm9wcGVyJztcbmltcG9ydCB7IENyb3BQb3NpdGlvbiB9IGZyb20gJy4vbW9kZWwvY3JvcFBvc2l0aW9uJztcbmltcG9ydCB7IEJvdW5kcyB9IGZyb20gJy4vbW9kZWwvYm91bmRzJztcbmltcG9ydCB7IEV4aWYgfSBmcm9tICcuL2V4aWYnO1xuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5AQ29tcG9uZW50KHtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmNvbXBvbmVudC1zZWxlY3RvclxuICBzZWxlY3RvcjogJ2ltZy1jcm9wcGVyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2ltYWdlLWNyb3BwZXIuY29tcG9uZW50Lmh0bWwnXG59KVxuZXhwb3J0IGNsYXNzIEltYWdlQ3JvcHBlckNvbXBvbmVudFxuICBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgQFZpZXdDaGlsZCgnY3JvcGNhbnZhcycsIHsgc3RhdGljOiB0cnVlIH0pXG4gIGNyb3BjYW52YXM6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ2ZpbGVJbnB1dCcpIGZpbGVJbnB1dDogRWxlbWVudFJlZjtcblxuICBASW5wdXQoKSBwdWJsaWMgc2V0dGluZ3M6IENyb3BwZXJTZXR0aW5ncztcbiAgQElucHV0KCkgcHVibGljIGltYWdlOiBhbnk7XG4gIEBJbnB1dCgpIHB1YmxpYyBpbnB1dEltYWdlOiBhbnk7XG4gIEBJbnB1dCgpIHB1YmxpYyBjcm9wcGVyOiBJbWFnZUNyb3BwZXI7XG4gIEBJbnB1dCgpIHB1YmxpYyBjcm9wUG9zaXRpb246IENyb3BQb3NpdGlvbjtcbiAgQE91dHB1dCgpXG4gIHB1YmxpYyBjcm9wUG9zaXRpb25DaGFuZ2U6IEV2ZW50RW1pdHRlcjxDcm9wUG9zaXRpb24+ID0gbmV3IEV2ZW50RW1pdHRlcjxcbiAgICBDcm9wUG9zaXRpb25cbiAgPigpO1xuXG4gIHByaXZhdGUgZXhpZiA9IG5ldyBFeGlmKCk7XG5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLW91dHB1dC1vbi1wcmVmaXhcbiAgQE91dHB1dCgpIHB1YmxpYyBvbkNyb3A6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgaW1hZ2VTZXQ6IEV2ZW50RW1pdHRlcjxib29sZWFuPiA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuICBwdWJsaWMgY3JvcHBlZFdpZHRoOiBudW1iZXI7XG4gIHB1YmxpYyBjcm9wcGVkSGVpZ2h0OiBudW1iZXI7XG4gIHB1YmxpYyBpbnRlcnZhbFJlZjogbnVtYmVyO1xuICBwdWJsaWMgcmFmOiBudW1iZXI7XG4gIHB1YmxpYyByZW5kZXJlcjogUmVuZGVyZXIyO1xuICBwdWJsaWMgd2luZG93TGlzdGVuZXI6IEV2ZW50TGlzdGVuZXJPYmplY3Q7XG5cbiAgcHJpdmF0ZSBpc0Nyb3BQb3NpdGlvblVwZGF0ZU5lZWRlZDogYm9vbGVhbjtcbiAgcHJpdmF0ZSBkcmFnVW5zdWJzY3JpYmVyczogKCgpID0+IHZvaWQpW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihyZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgICAgICAgICAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIGRvY3VtZW50KSB7XG4gICAgdGhpcy5yZW5kZXJlciA9IHJlbmRlcmVyO1xuICB9XG5cbiAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICBjb25zdCBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ID0gdGhpcy5jcm9wY2FudmFzLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICBpZiAoIXRoaXMuc2V0dGluZ3MpIHtcbiAgICAgIHRoaXMuc2V0dGluZ3MgPSBuZXcgQ3JvcHBlclNldHRpbmdzKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuY3JvcHBlckNsYXNzKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZShjYW52YXMsICdjbGFzcycsIHRoaXMuc2V0dGluZ3MuY3JvcHBlckNsYXNzKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuc2V0dGluZ3MuZHluYW1pY1NpemluZykge1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUoXG4gICAgICAgIGNhbnZhcyxcbiAgICAgICAgJ3dpZHRoJyxcbiAgICAgICAgdGhpcy5zZXR0aW5ncy5jYW52YXNXaWR0aC50b1N0cmluZygpXG4gICAgICApO1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUoXG4gICAgICAgIGNhbnZhcyxcbiAgICAgICAgJ2hlaWdodCcsXG4gICAgICAgIHRoaXMuc2V0dGluZ3MuY2FudmFzSGVpZ2h0LnRvU3RyaW5nKClcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMud2luZG93TGlzdGVuZXIgPSB0aGlzLnJlc2l6ZS5iaW5kKHRoaXMpO1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMud2luZG93TGlzdGVuZXIpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5jcm9wcGVyKSB7XG4gICAgICB0aGlzLmNyb3BwZXIgPSBuZXcgSW1hZ2VDcm9wcGVyKHRoaXMuc2V0dGluZ3MpO1xuICAgIH1cblxuICAgIHRoaXMuY3JvcHBlci5wcmVwYXJlKGNhbnZhcyk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzQ3JvcFBvc2l0aW9uQ2hhbmdlZChjaGFuZ2VzKSkge1xuICAgICAgdGhpcy5jcm9wcGVyLnVwZGF0ZUNyb3BQb3NpdGlvbih0aGlzLmNyb3BQb3NpdGlvbi50b0JvdW5kcygpKTtcbiAgICAgIGlmICh0aGlzLmNyb3BwZXIuaXNJbWFnZVNldCgpKSB7XG4gICAgICAgIGNvbnN0IGJvdW5kcyA9IHRoaXMuY3JvcHBlci5nZXRDcm9wQm91bmRzKCk7XG4gICAgICAgIHRoaXMuaW1hZ2UuaW1hZ2UgPSB0aGlzLmNyb3BwZXIuZ2V0Q3JvcHBlZEltYWdlSGVscGVyKCkuc3JjO1xuICAgICAgICB0aGlzLm9uQ3JvcC5lbWl0KGJvdW5kcyk7XG4gICAgICB9XG4gICAgICB0aGlzLnVwZGF0ZUNyb3BCb3VuZHMoKTtcbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlcy5pbnB1dEltYWdlKSB7XG4gICAgICB0aGlzLnNldEltYWdlKGNoYW5nZXMuaW5wdXRJbWFnZS5jdXJyZW50VmFsdWUpO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VzLnNldHRpbmdzICYmIHRoaXMuY3JvcHBlcikge1xuICAgICAgdGhpcy5jcm9wcGVyLnVwZGF0ZVNldHRpbmdzKHRoaXMuc2V0dGluZ3MpO1xuICAgICAgaWYgKHRoaXMuY3JvcHBlci5pc0ltYWdlU2V0KCkpIHtcbiAgICAgICAgdGhpcy5pbWFnZS5pbWFnZSA9IHRoaXMuY3JvcHBlci5nZXRDcm9wcGVkSW1hZ2VIZWxwZXIoKS5zcmM7XG4gICAgICAgIHRoaXMub25Dcm9wLmVtaXQodGhpcy5jcm9wcGVyLmdldENyb3BCb3VuZHMoKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMucmVtb3ZlRHJhZ0xpc3RlbmVycygpO1xuICAgIGlmICh0aGlzLnNldHRpbmdzLmR5bmFtaWNTaXppbmcgJiYgdGhpcy53aW5kb3dMaXN0ZW5lcikge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMud2luZG93TGlzdGVuZXIpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvblRvdWNoTW92ZShldmVudDogVG91Y2hFdmVudCk6IHZvaWQge1xuICAgIHRoaXMuY3JvcHBlci5vblRvdWNoTW92ZShldmVudCk7XG4gIH1cblxuICBwdWJsaWMgb25Ub3VjaFN0YXJ0KGV2ZW50OiBUb3VjaEV2ZW50KTogdm9pZCB7XG4gICAgdGhpcy5jcm9wcGVyLm9uVG91Y2hTdGFydChldmVudCk7XG4gIH1cblxuICBwdWJsaWMgb25Ub3VjaEVuZChldmVudDogVG91Y2hFdmVudCk6IHZvaWQge1xuICAgIHRoaXMuY3JvcHBlci5vblRvdWNoRW5kKGV2ZW50KTtcbiAgICBpZiAodGhpcy5jcm9wcGVyLmlzSW1hZ2VTZXQoKSkge1xuICAgICAgdGhpcy5pbWFnZS5pbWFnZSA9IHRoaXMuY3JvcHBlci5nZXRDcm9wcGVkSW1hZ2VIZWxwZXIoKS5zcmM7XG4gICAgICB0aGlzLm9uQ3JvcC5lbWl0KHRoaXMuY3JvcHBlci5nZXRDcm9wQm91bmRzKCkpO1xuICAgICAgdGhpcy51cGRhdGVDcm9wQm91bmRzKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uTW91c2VEb3duKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgdGhpcy5kcmFnVW5zdWJzY3JpYmVycy5wdXNoKHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMuZG9jdW1lbnQsICdtb3VzZW1vdmUnLCB0aGlzLm9uTW91c2VNb3ZlLmJpbmQodGhpcykpKTtcbiAgICB0aGlzLmRyYWdVbnN1YnNjcmliZXJzLnB1c2godGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5kb2N1bWVudCwgJ21vdXNldXAnLCB0aGlzLm9uTW91c2VVcC5iaW5kKHRoaXMpKSk7XG5cbiAgICB0aGlzLmNyb3BwZXIub25Nb3VzZURvd24oZXZlbnQpO1xuICAgIC8vIGlmICghdGhpcy5jcm9wcGVyLmlzSW1hZ2VTZXQoKSAmJiAhdGhpcy5zZXR0aW5ncy5ub0ZpbGVJbnB1dCkge1xuICAgIC8vICAgLy8gbG9hZCBpbWdcbiAgICAvLyAgIHRoaXMuZmlsZUlucHV0Lm5hdGl2ZUVsZW1lbnQuY2xpY2soKTtcbiAgICAvLyB9XG4gIH1cblxuICBwcml2YXRlIHJlbW92ZURyYWdMaXN0ZW5lcnMoKSB7XG4gICAgdGhpcy5kcmFnVW5zdWJzY3JpYmVycy5mb3JFYWNoKHVuc3Vic2NyaWJlID0+IHVuc3Vic2NyaWJlKCkpO1xuICB9XG5cbiAgcHVibGljIG9uTW91c2VVcChldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIHRoaXMucmVtb3ZlRHJhZ0xpc3RlbmVycygpO1xuICAgIGlmICh0aGlzLmNyb3BwZXIuaXNJbWFnZVNldCgpKSB7XG4gICAgICB0aGlzLmNyb3BwZXIub25Nb3VzZVVwKGV2ZW50KTtcbiAgICAgIHRoaXMuaW1hZ2UuaW1hZ2UgPSB0aGlzLmNyb3BwZXIuZ2V0Q3JvcHBlZEltYWdlSGVscGVyKCkuc3JjO1xuICAgICAgdGhpcy5vbkNyb3AuZW1pdCh0aGlzLmNyb3BwZXIuZ2V0Q3JvcEJvdW5kcygpKTtcbiAgICAgIHRoaXMudXBkYXRlQ3JvcEJvdW5kcygpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvbk1vdXNlTW92ZShldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIHRoaXMuY3JvcHBlci5vbk1vdXNlTW92ZShldmVudCk7XG4gIH1cblxuICBwdWJsaWMgZmlsZUNoYW5nZUxpc3RlbmVyKCRldmVudDogYW55KSB7XG4gICAgaWYgKCRldmVudC50YXJnZXQuZmlsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZmlsZTogRmlsZSA9ICRldmVudC50YXJnZXQuZmlsZXNbMF07XG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuYWxsb3dlZEZpbGVzUmVnZXgudGVzdChmaWxlLm5hbWUpKSB7XG4gICAgICBjb25zdCBpbWFnZTogYW55ID0gbmV3IEltYWdlKCk7XG4gICAgICBjb25zdCBmaWxlUmVhZGVyOiBGaWxlUmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblxuICAgICAgZmlsZVJlYWRlci5hZGRFdmVudExpc3RlbmVyKCdsb2FkZW5kJywgKGxvYWRFdmVudDogYW55KSA9PiB7XG4gICAgICAgIGltYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXRJbWFnZShpbWFnZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpbWFnZS5zcmMgPSBsb2FkRXZlbnQudGFyZ2V0LnJlc3VsdDtcbiAgICAgIH0pO1xuXG4gICAgICBmaWxlUmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZXNpemUoKSB7XG4gICAgY29uc3QgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IHRoaXMuY3JvcGNhbnZhcy5uYXRpdmVFbGVtZW50O1xuICAgIHRoaXMuc2V0dGluZ3MuY2FudmFzV2lkdGggPSBjYW52YXMub2Zmc2V0V2lkdGg7XG4gICAgdGhpcy5zZXR0aW5ncy5jYW52YXNIZWlnaHQgPSBjYW52YXMub2Zmc2V0SGVpZ2h0O1xuICAgIHRoaXMuY3JvcHBlci5yZXNpemVDYW52YXMoY2FudmFzLm9mZnNldFdpZHRoLCBjYW52YXMub2Zmc2V0SGVpZ2h0LCB0cnVlKTtcbiAgfVxuXG4gIHB1YmxpYyByZXNldCgpOiB2b2lkIHtcbiAgICB0aGlzLmNyb3BwZXIucmVzZXQoKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZShcbiAgICAgIHRoaXMuY3JvcGNhbnZhcy5uYXRpdmVFbGVtZW50LFxuICAgICAgJ2NsYXNzJyxcbiAgICAgIHRoaXMuc2V0dGluZ3MuY3JvcHBlckNsYXNzXG4gICAgKTtcbiAgICB0aGlzLmltYWdlLmltYWdlID0gdGhpcy5jcm9wcGVyLmdldENyb3BwZWRJbWFnZUhlbHBlcigpLnNyYztcbiAgfVxuXG4gIHB1YmxpYyBzZXRJbWFnZShpbWFnZTogSFRNTEltYWdlRWxlbWVudCwgbmV3Qm91bmRzOiBhbnkgPSBudWxsKSB7XG4gICAgdGhpcy5pbWFnZVNldC5lbWl0KHRydWUpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKFxuICAgICAgdGhpcy5jcm9wY2FudmFzLm5hdGl2ZUVsZW1lbnQsXG4gICAgICAnY2xhc3MnLFxuICAgICAgYCR7dGhpcy5zZXR0aW5ncy5jcm9wcGVyQ2xhc3N9ICR7dGhpcy5zZXR0aW5ncy5jcm9wcGluZ0NsYXNzfWBcbiAgICApO1xuICAgIHRoaXMucmFmID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5yYWYpIHtcbiAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMucmFmKTtcbiAgICAgIH1cbiAgICAgIGlmIChpbWFnZS5uYXR1cmFsSGVpZ2h0ID4gMCAmJiBpbWFnZS5uYXR1cmFsV2lkdGggPiAwKSB7XG4gICAgICAgIGltYWdlLmhlaWdodCA9IGltYWdlLm5hdHVyYWxIZWlnaHQ7XG4gICAgICAgIGltYWdlLndpZHRoID0gaW1hZ2UubmF0dXJhbFdpZHRoO1xuXG4gICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLnJhZik7XG4gICAgICAgIHRoaXMuZ2V0T3JpZW50ZWRJbWFnZShpbWFnZSwgKGltZzogSFRNTEltYWdlRWxlbWVudCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmR5bmFtaWNTaXppbmcpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgPSB0aGlzLmNyb3BjYW52YXMubmF0aXZlRWxlbWVudDtcbiAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuY2FudmFzV2lkdGggPSBjYW52YXMub2Zmc2V0V2lkdGg7XG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzLmNhbnZhc0hlaWdodCA9IGNhbnZhcy5vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICB0aGlzLmNyb3BwZXIucmVzaXplQ2FudmFzKFxuICAgICAgICAgICAgICBjYW52YXMub2Zmc2V0V2lkdGgsXG4gICAgICAgICAgICAgIGNhbnZhcy5vZmZzZXRIZWlnaHQsXG4gICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuY3JvcHBlci5zZXRJbWFnZShpbWcpO1xuICAgICAgICAgIGlmICh0aGlzLmNyb3BQb3NpdGlvbiAmJiB0aGlzLmNyb3BQb3NpdGlvbi5pc0luaXRpYWxpemVkKCkpIHtcbiAgICAgICAgICAgIHRoaXMuY3JvcHBlci51cGRhdGVDcm9wUG9zaXRpb24odGhpcy5jcm9wUG9zaXRpb24udG9Cb3VuZHMoKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5pbWFnZS5vcmlnaW5hbCA9IGltZztcbiAgICAgICAgICBsZXQgYm91bmRzID0gdGhpcy5jcm9wcGVyLmdldENyb3BCb3VuZHMoKTtcbiAgICAgICAgICB0aGlzLmltYWdlLmltYWdlID0gdGhpcy5jcm9wcGVyLmdldENyb3BwZWRJbWFnZUhlbHBlcigpLnNyYztcblxuICAgICAgICAgIGlmICghdGhpcy5pbWFnZSkge1xuICAgICAgICAgICAgdGhpcy5pbWFnZSA9IGltYWdlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChuZXdCb3VuZHMgIT0gbnVsbCkge1xuICAgICAgICAgICAgYm91bmRzID0gbmV3Qm91bmRzO1xuICAgICAgICAgICAgdGhpcy5jcm9wcGVyLnNldEJvdW5kcyhib3VuZHMpO1xuICAgICAgICAgICAgdGhpcy5jcm9wcGVyLnVwZGF0ZUNyb3BQb3NpdGlvbihib3VuZHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLm9uQ3JvcC5lbWl0KGJvdW5kcyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBpc0Nyb3BQb3NpdGlvbkNoYW5nZWQoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IGJvb2xlYW4ge1xuICAgIGlmIChcbiAgICAgIHRoaXMuY3JvcHBlciAmJlxuICAgICAgY2hhbmdlcy5jcm9wUG9zaXRpb24gJiZcbiAgICAgIHRoaXMuaXNDcm9wUG9zaXRpb25VcGRhdGVOZWVkZWRcbiAgICApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmlzQ3JvcFBvc2l0aW9uVXBkYXRlTmVlZGVkID0gdHJ1ZTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUNyb3BCb3VuZHMoKTogdm9pZCB7XG4gICAgY29uc3QgY3JvcEJvdW5kOiBCb3VuZHMgPSB0aGlzLmNyb3BwZXIuZ2V0Q3JvcEJvdW5kcygpO1xuICAgIHRoaXMuY3JvcFBvc2l0aW9uQ2hhbmdlLmVtaXQoXG4gICAgICBuZXcgQ3JvcFBvc2l0aW9uKFxuICAgICAgICBjcm9wQm91bmQubGVmdCxcbiAgICAgICAgY3JvcEJvdW5kLnRvcCxcbiAgICAgICAgY3JvcEJvdW5kLndpZHRoLFxuICAgICAgICBjcm9wQm91bmQuaGVpZ2h0XG4gICAgICApXG4gICAgKTtcbiAgICB0aGlzLmlzQ3JvcFBvc2l0aW9uVXBkYXRlTmVlZGVkID0gZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIGdldE9yaWVudGVkSW1hZ2UoXG4gICAgaW1hZ2U6IEhUTUxJbWFnZUVsZW1lbnQsXG4gICAgY2FsbGJhY2s6IChpbWc6IEhUTUxJbWFnZUVsZW1lbnQpID0+IHZvaWRcbiAgKSB7XG4gICAgbGV0IGltZzogYW55O1xuXG4gICAgdGhpcy5leGlmLmdldERhdGEoaW1hZ2UsICgpID0+IHtcbiAgICAgIGNvbnN0IG9yaWVudGF0aW9uID0gdGhpcy5leGlmLmdldFRhZyhpbWFnZSwgJ09yaWVudGF0aW9uJyk7XG5cbiAgICAgIGlmIChbMywgNiwgOF0uaW5kZXhPZihvcmllbnRhdGlvbikgPiAtMSkge1xuICAgICAgICBjb25zdCBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgIGNvbnN0IGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEID0gY2FudmFzLmdldENvbnRleHQoXG4gICAgICAgICAgJzJkJ1xuICAgICAgICApIGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgICAgICAgbGV0IGN3OiBudW1iZXIgPSBpbWFnZS53aWR0aDtcbiAgICAgICAgbGV0IGNoOiBudW1iZXIgPSBpbWFnZS5oZWlnaHQ7XG4gICAgICAgIGxldCBjeCA9IDA7XG4gICAgICAgIGxldCBjeSA9IDA7XG4gICAgICAgIGxldCBkZWcgPSAwO1xuXG4gICAgICAgIHN3aXRjaCAob3JpZW50YXRpb24pIHtcbiAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICBjeCA9IC1pbWFnZS53aWR0aDtcbiAgICAgICAgICAgIGN5ID0gLWltYWdlLmhlaWdodDtcbiAgICAgICAgICAgIGRlZyA9IDE4MDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgIGN3ID0gaW1hZ2UuaGVpZ2h0O1xuICAgICAgICAgICAgY2ggPSBpbWFnZS53aWR0aDtcbiAgICAgICAgICAgIGN5ID0gLWltYWdlLmhlaWdodDtcbiAgICAgICAgICAgIGRlZyA9IDkwO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgY3cgPSBpbWFnZS5oZWlnaHQ7XG4gICAgICAgICAgICBjaCA9IGltYWdlLndpZHRoO1xuICAgICAgICAgICAgY3ggPSAtaW1hZ2Uud2lkdGg7XG4gICAgICAgICAgICBkZWcgPSAyNzA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBjYW52YXMud2lkdGggPSBjdztcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IGNoO1xuICAgICAgICBjdHgucm90YXRlKChkZWcgKiBNYXRoLlBJKSAvIDE4MCk7XG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1hZ2UsIGN4LCBjeSk7XG4gICAgICAgIGltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgICAgICBpbWcud2lkdGggPSBjdztcbiAgICAgICAgaW1nLmhlaWdodCA9IGNoO1xuICAgICAgICBpbWcuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgICAgICAgICBjYWxsYmFjayhpbWcpO1xuICAgICAgICB9KTtcbiAgICAgICAgaW1nLnNyYyA9IGNhbnZhcy50b0RhdGFVUkwoJ2ltYWdlL3BuZycpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW1nID0gaW1hZ2U7XG4gICAgICAgIGNhbGxiYWNrKGltZyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiIsIjxzcGFuIGNsYXNzPVwibmcyLWltZ2Nyb3BcIj5cbiAgPGlucHV0XG4gICAgKm5nSWY9XCIhc2V0dGluZ3Mubm9GaWxlSW5wdXRcIlxuICAgICNmaWxlSW5wdXRcbiAgICB0eXBlPVwiZmlsZVwiXG4gICAgYWNjZXB0PVwiaW1hZ2UvKlwiXG4gICAgKGNoYW5nZSk9XCJmaWxlQ2hhbmdlTGlzdGVuZXIoJGV2ZW50KVwiXG4gIC8+XG4gIDxjYW52YXNcbiAgICAjY3JvcGNhbnZhc1xuICAgIChtb3VzZWRvd24pPVwib25Nb3VzZURvd24oJGV2ZW50KVwiXG4gICAgKHRvdWNobW92ZSk9XCJvblRvdWNoTW92ZSgkZXZlbnQpXCJcbiAgICAodG91Y2hlbmQpPVwib25Ub3VjaEVuZCgkZXZlbnQpXCJcbiAgICAodG91Y2hzdGFydCk9XCJvblRvdWNoU3RhcnQoJGV2ZW50KVwiXG4gID5cbiAgPC9jYW52YXM+XG48L3NwYW4+XG4iXX0=