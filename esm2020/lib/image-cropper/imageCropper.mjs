import { Bounds } from './model/bounds';
import { CornerMarker } from './model/cornerMarker';
import { CropTouch } from './model/cropTouch';
import { DragMarker } from './model/dragMarker';
import { ImageCropperModel } from './model/imageCropperModel';
import { ImageCropperDataShare } from './imageCropperDataShare';
import { PointPool } from './model/pointPool';
export class ImageCropper extends ImageCropperModel {
    constructor(cropperSettings) {
        super();
        this.imageCropperDataShare = new ImageCropperDataShare();
        const x = 0;
        const y = 0;
        const width = cropperSettings.width;
        const height = cropperSettings.height;
        const keepAspect = cropperSettings.keepAspect;
        const touchRadius = cropperSettings.touchRadius;
        const centerTouchRadius = cropperSettings.centerTouchRadius;
        const minWidth = cropperSettings.minWidth;
        const minHeight = cropperSettings.minHeight;
        const croppedWidth = cropperSettings.croppedWidth;
        const croppedHeight = cropperSettings.croppedHeight;
        this.cropperSettings = cropperSettings;
        this.crop = this;
        this.x = x;
        this.y = y;
        this.canvasHeight = cropperSettings.canvasHeight;
        this.canvasWidth = cropperSettings.canvasWidth;
        this.width = width;
        if (width === void 0) {
            this.width = 100;
        }
        this.height = height;
        if (height === void 0) {
            this.height = 50;
        }
        this.keepAspect = keepAspect;
        if (keepAspect === void 0) {
            this.keepAspect = true;
        }
        this.touchRadius = touchRadius;
        if (touchRadius === void 0) {
            this.touchRadius = 20;
        }
        this.minWidth = minWidth;
        this.minHeight = minHeight;
        this.aspectRatio = 0;
        this.currentDragTouches = [];
        this.isMouseDown = false;
        this.ratioW = 1;
        this.ratioH = 1;
        this.fileType = cropperSettings.fileType;
        this.imageSet = false;
        this.pointPool = new PointPool(200);
        this.tl = new CornerMarker(x, y, touchRadius, this.cropperSettings);
        this.tr = new CornerMarker(x + width, y, touchRadius, this.cropperSettings);
        this.bl = new CornerMarker(x, y + height, touchRadius, this.cropperSettings);
        this.br = new CornerMarker(x + width, y + height, touchRadius, this.cropperSettings);
        this.tl.addHorizontalNeighbour(this.tr);
        this.tl.addVerticalNeighbour(this.bl);
        this.tr.addHorizontalNeighbour(this.tl);
        this.tr.addVerticalNeighbour(this.br);
        this.bl.addHorizontalNeighbour(this.br);
        this.bl.addVerticalNeighbour(this.tl);
        this.br.addHorizontalNeighbour(this.bl);
        this.br.addVerticalNeighbour(this.tr);
        this.markers = [this.tl, this.tr, this.bl, this.br];
        this.center = new DragMarker(x + width / 2, y + height / 2, centerTouchRadius, this.cropperSettings);
        this.aspectRatio = height / width;
        this.croppedImage = new Image();
        this.currentlyInteracting = false;
        this.cropWidth = croppedWidth;
        this.cropHeight = croppedHeight;
    }
    sign(x) {
        if (+x === x) {
            return x === 0 ? x : x > 0 ? 1 : -1;
        }
        return NaN;
    }
    getMousePos(canvas, evt) {
        const rect = canvas.getBoundingClientRect();
        return new PointPool().instance.borrow(evt.clientX - rect.left, evt.clientY - rect.top);
    }
    getTouchPos(canvas, touch) {
        const rect = canvas.getBoundingClientRect();
        return new PointPool().instance.borrow(touch.clientX - rect.left, touch.clientY - rect.top);
    }
    detectVerticalSquash(img) {
        const ih = img.height;
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = ih;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, 1, ih);
        if (imageData) {
            const data = imageData.data;
            // search image edge pixel position in case it is squashed vertically.
            let sy = 0;
            let ey = ih;
            let py = ih;
            while (py > sy) {
                const alpha = data[(py - 1) * 4 + 3];
                if (alpha === 0) {
                    ey = py;
                }
                else {
                    sy = py;
                }
                // tslint:disable-next-line:no-bitwise
                py = (ey + sy) >> 1;
            }
            const ratio = py / ih;
            return ratio === 0 ? 1 : ratio;
        }
        else {
            return 1;
        }
    }
    getDataUriMimeType(dataUri) {
        // Get a substring because the regex does not perform well on very large strings.
        // Cater for optional charset. Length 50 shoould be enough.
        const dataUriSubstring = dataUri.substring(0, 50);
        let mimeType = 'image/png';
        // data-uri scheme
        // data:[<media type>][;charset=<character set>][;base64],<data>
        const regEx = RegExp(/^(data:)([\w\/\+]+);(charset=[\w-]+|base64).*,(.*)/gi);
        const matches = regEx.exec(dataUriSubstring);
        if (matches && matches[2]) {
            mimeType = matches[2];
            if (mimeType === 'image/jpg') {
                mimeType = 'image/jpeg';
            }
        }
        return mimeType;
    }
    prepare(canvas) {
        this.buffer = document.createElement('canvas');
        this.cropCanvas = document.createElement('canvas');
        // todo get more reliable parent width value.
        const responsiveWidth = canvas.parentElement
            ? canvas.parentElement.clientWidth
            : 0;
        if (responsiveWidth > 0 && this.cropperSettings.dynamicSizing) {
            this.cropCanvas.width = responsiveWidth;
            this.buffer.width = responsiveWidth;
            canvas.width = responsiveWidth;
        }
        else {
            this.cropCanvas.width = this.cropWidth;
            this.buffer.width = canvas.width;
        }
        this.cropCanvas.height = this.cropHeight;
        this.buffer.height = canvas.height;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.draw(this.ctx);
    }
    updateSettings(cropperSettings) {
        this.cropperSettings = cropperSettings;
    }
    resizeCanvas(width, height, setImage = false) {
        this.canvas.width = this.cropCanvas.width = this.width = this.canvasWidth = this.buffer.width = width;
        this.canvas.height = this.cropCanvas.height = this.height = this.canvasHeight = this.buffer.height = height;
        if (setImage) {
            this.setImage(this.srcImage);
        }
    }
    reset() {
        this.setImage(undefined);
    }
    draw(ctx) {
        const bounds = this.getBounds();
        if (this.srcImage) {
            ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            const sourceAspect = this.srcImage.height / this.srcImage.width;
            const canvasAspect = this.canvasHeight / this.canvasWidth;
            let w = this.canvasWidth;
            let h = this.canvasHeight;
            if (canvasAspect > sourceAspect) {
                w = this.canvasWidth;
                h = this.canvasWidth * sourceAspect;
            }
            else {
                h = this.canvasHeight;
                w = this.canvasHeight / sourceAspect;
            }
            this.ratioW = w / this.srcImage.width;
            this.ratioH = h / this.srcImage.height;
            if (canvasAspect < sourceAspect) {
                this.drawImageIOSFix(ctx, this.srcImage, 0, 0, this.srcImage.width, this.srcImage.height, this.buffer.width / 2 - w / 2, 0, w, h);
            }
            else {
                this.drawImageIOSFix(ctx, this.srcImage, 0, 0, this.srcImage.width, this.srcImage.height, 0, this.buffer.height / 2 - h / 2, w, h);
            }
            this.buffer.getContext('2d').drawImage(this.canvas, 0, 0, this.canvasWidth, this.canvasHeight);
            ctx.lineWidth = this.cropperSettings.cropperDrawSettings.strokeWidth;
            ctx.strokeStyle = this.cropperSettings.cropperDrawSettings.strokeColor;
            ctx.fillStyle = this.cropperSettings.cropperDrawSettings.backgroundFillColor;
            if (!this.cropperSettings.rounded) {
                ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
                ctx.drawImage(this.buffer, bounds.left, bounds.top, Math.max(bounds.width, 1), Math.max(bounds.height, 1), bounds.left, bounds.top, bounds.width, bounds.height);
                ctx.strokeRect(bounds.left, bounds.top, bounds.width, bounds.height);
            }
            else {
                ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                ctx.save();
                ctx.beginPath();
                ctx.arc(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2, bounds.width / 2, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.clip();
                if (canvasAspect < sourceAspect) {
                    this.drawImageIOSFix(ctx, this.srcImage, 0, 0, this.srcImage.width, this.srcImage.height, this.buffer.width / 2 - w / 2, 0, w, h);
                }
                else {
                    this.drawImageIOSFix(ctx, this.srcImage, 0, 0, this.srcImage.width, this.srcImage.height, 0, this.buffer.height / 2 - h / 2, w, h);
                }
                ctx.restore();
            }
            let marker;
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < this.markers.length; i++) {
                marker = this.markers[i];
                marker.draw(ctx);
            }
            this.center.draw(ctx);
        }
        else {
            ctx.fillStyle = 'rgba(192,192,192,1)';
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    dragCenter(x, y, marker) {
        const bounds = this.getBounds();
        const left = x - bounds.width / 2;
        const right = x + bounds.width / 2;
        const top = y - bounds.height / 2;
        const bottom = y + bounds.height / 2;
        if (right >= this.maxXClamp) {
            x = this.maxXClamp - bounds.width / 2;
        }
        if (left <= this.minXClamp) {
            x = bounds.width / 2 + this.minXClamp;
        }
        if (top < this.minYClamp) {
            y = bounds.height / 2 + this.minYClamp;
        }
        if (bottom >= this.maxYClamp) {
            y = this.maxYClamp - bounds.height / 2;
        }
        this.tl.moveX(x - bounds.width / 2);
        this.tl.moveY(y - bounds.height / 2);
        this.tr.moveX(x + bounds.width / 2);
        this.tr.moveY(y - bounds.height / 2);
        this.bl.moveX(x - bounds.width / 2);
        this.bl.moveY(y + bounds.height / 2);
        this.br.moveX(x + bounds.width / 2);
        this.br.moveY(y + bounds.height / 2);
        marker.setPosition(x, y);
    }
    enforceMinSize(x, y, marker) {
        const xLength = x - marker.getHorizontalNeighbour().position.x;
        const yLength = y - marker.getVerticalNeighbour().position.y;
        const xOver = this.minWidth - Math.abs(xLength);
        const yOver = this.minHeight - Math.abs(yLength);
        if (xLength === 0 || yLength === 0) {
            x = marker.position.x;
            y = marker.position.y;
            return new PointPool().instance.borrow(x, y);
        }
        if (this.keepAspect) {
            if (xOver > 0 && yOver / this.aspectRatio > 0) {
                if (xOver > yOver / this.aspectRatio) {
                    if (xLength < 0) {
                        x -= xOver;
                        if (yLength < 0) {
                            y -= xOver * this.aspectRatio;
                        }
                        else {
                            y += xOver * this.aspectRatio;
                        }
                    }
                    else {
                        x += xOver;
                        if (yLength < 0) {
                            y -= xOver * this.aspectRatio;
                        }
                        else {
                            y += xOver * this.aspectRatio;
                        }
                    }
                }
                else {
                    if (yLength < 0) {
                        y -= yOver;
                        if (xLength < 0) {
                            x -= yOver / this.aspectRatio;
                        }
                        else {
                            x += yOver / this.aspectRatio;
                        }
                    }
                    else {
                        y += yOver;
                        if (xLength < 0) {
                            x -= yOver / this.aspectRatio;
                        }
                        else {
                            x += yOver / this.aspectRatio;
                        }
                    }
                }
            }
            else {
                if (xOver > 0) {
                    if (xLength < 0) {
                        x -= xOver;
                        if (yLength < 0) {
                            y -= xOver * this.aspectRatio;
                        }
                        else {
                            y += xOver * this.aspectRatio;
                        }
                    }
                    else {
                        x += xOver;
                        if (yLength < 0) {
                            y -= xOver * this.aspectRatio;
                        }
                        else {
                            y += xOver * this.aspectRatio;
                        }
                    }
                }
                else {
                    if (yOver > 0) {
                        if (yLength < 0) {
                            y -= yOver;
                            if (xLength < 0) {
                                x -= yOver / this.aspectRatio;
                            }
                            else {
                                x += yOver / this.aspectRatio;
                            }
                        }
                        else {
                            y += yOver;
                            if (xLength < 0) {
                                x -= yOver / this.aspectRatio;
                            }
                            else {
                                x += yOver / this.aspectRatio;
                            }
                        }
                    }
                }
            }
        }
        else {
            if (xOver > 0) {
                if (xLength < 0) {
                    x -= xOver;
                }
                else {
                    x += xOver;
                }
            }
            if (yOver > 0) {
                if (yLength < 0) {
                    y -= yOver;
                }
                else {
                    y += yOver;
                }
            }
        }
        if (x < this.minXClamp ||
            x > this.maxXClamp ||
            y < this.minYClamp ||
            y > this.maxYClamp) {
            x = marker.position.x;
            y = marker.position.y;
        }
        return new PointPool().instance.borrow(x, y);
    }
    dragCorner(x, y, marker) {
        let iX = 0;
        let iY = 0;
        let ax = 0;
        let ay = 0;
        let newHeight = 0;
        let newWidth = 0;
        let newY = 0;
        let newX = 0;
        let anchorMarker;
        let fold = 0;
        if (this.keepAspect) {
            anchorMarker = marker.getHorizontalNeighbour().getVerticalNeighbour();
            ax = anchorMarker.position.x;
            ay = anchorMarker.position.y;
            if (x <= anchorMarker.position.x) {
                if (y <= anchorMarker.position.y) {
                    iX = ax - 100 / this.aspectRatio;
                    iY = ay - (100 / this.aspectRatio) * this.aspectRatio;
                    fold = this.getSide(new PointPool().instance.borrow(iX, iY), anchorMarker.position, new PointPool().instance.borrow(x, y));
                    if (fold > 0) {
                        newHeight = Math.abs(anchorMarker.position.y - y);
                        newWidth = newHeight / this.aspectRatio;
                        newY = anchorMarker.position.y - newHeight;
                        newX = anchorMarker.position.x - newWidth;
                        const min = this.enforceMinSize(newX, newY, marker);
                        marker.move(min.x, min.y);
                        new PointPool().instance.returnPoint(min);
                    }
                    else {
                        if (fold < 0) {
                            newWidth = Math.abs(anchorMarker.position.x - x);
                            newHeight = newWidth * this.aspectRatio;
                            newY = anchorMarker.position.y - newHeight;
                            newX = anchorMarker.position.x - newWidth;
                            const min = this.enforceMinSize(newX, newY, marker);
                            marker.move(min.x, min.y);
                            new PointPool().instance.returnPoint(min);
                        }
                    }
                }
                else {
                    iX = ax - 100 / this.aspectRatio;
                    iY = ay + (100 / this.aspectRatio) * this.aspectRatio;
                    fold = this.getSide(new PointPool().instance.borrow(iX, iY), anchorMarker.position, new PointPool().instance.borrow(x, y));
                    if (fold > 0) {
                        newWidth = Math.abs(anchorMarker.position.x - x);
                        newHeight = newWidth * this.aspectRatio;
                        newY = anchorMarker.position.y + newHeight;
                        newX = anchorMarker.position.x - newWidth;
                        const min = this.enforceMinSize(newX, newY, marker);
                        marker.move(min.x, min.y);
                        new PointPool().instance.returnPoint(min);
                    }
                    else {
                        if (fold < 0) {
                            newHeight = Math.abs(anchorMarker.position.y - y);
                            newWidth = newHeight / this.aspectRatio;
                            newY = anchorMarker.position.y + newHeight;
                            newX = anchorMarker.position.x - newWidth;
                            const min = this.enforceMinSize(newX, newY, marker);
                            marker.move(min.x, min.y);
                            new PointPool().instance.returnPoint(min);
                        }
                    }
                }
            }
            else {
                if (y <= anchorMarker.position.y) {
                    iX = ax + 100 / this.aspectRatio;
                    iY = ay - (100 / this.aspectRatio) * this.aspectRatio;
                    fold = this.getSide(new PointPool().instance.borrow(iX, iY), anchorMarker.position, new PointPool().instance.borrow(x, y));
                    if (fold < 0) {
                        newHeight = Math.abs(anchorMarker.position.y - y);
                        newWidth = newHeight / this.aspectRatio;
                        newY = anchorMarker.position.y - newHeight;
                        newX = anchorMarker.position.x + newWidth;
                        const min = this.enforceMinSize(newX, newY, marker);
                        marker.move(min.x, min.y);
                        new PointPool().instance.returnPoint(min);
                    }
                    else {
                        if (fold > 0) {
                            newWidth = Math.abs(anchorMarker.position.x - x);
                            newHeight = newWidth * this.aspectRatio;
                            newY = anchorMarker.position.y - newHeight;
                            newX = anchorMarker.position.x + newWidth;
                            const min = this.enforceMinSize(newX, newY, marker);
                            marker.move(min.x, min.y);
                            new PointPool().instance.returnPoint(min);
                        }
                    }
                }
                else {
                    iX = ax + 100 / this.aspectRatio;
                    iY = ay + (100 / this.aspectRatio) * this.aspectRatio;
                    fold = this.getSide(new PointPool().instance.borrow(iX, iY), anchorMarker.position, new PointPool().instance.borrow(x, y));
                    if (fold < 0) {
                        newWidth = Math.abs(anchorMarker.position.x - x);
                        newHeight = newWidth * this.aspectRatio;
                        newY = anchorMarker.position.y + newHeight;
                        newX = anchorMarker.position.x + newWidth;
                        const min = this.enforceMinSize(newX, newY, marker);
                        marker.move(min.x, min.y);
                        new PointPool().instance.returnPoint(min);
                    }
                    else {
                        if (fold > 0) {
                            newHeight = Math.abs(anchorMarker.position.y - y);
                            newWidth = newHeight / this.aspectRatio;
                            newY = anchorMarker.position.y + newHeight;
                            newX = anchorMarker.position.x + newWidth;
                            const min = this.enforceMinSize(newX, newY, marker);
                            marker.move(min.x, min.y);
                            new PointPool().instance.returnPoint(min);
                        }
                    }
                }
            }
        }
        else {
            const min = this.enforceMinSize(x, y, marker);
            marker.move(min.x, min.y);
            new PointPool().instance.returnPoint(min);
        }
        this.center.recalculatePosition(this.getBounds());
    }
    getSide(a, b, c) {
        const n = this.sign((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x));
        // TODO move the return of the pools to outside of this function
        new PointPool().instance.returnPoint(a);
        new PointPool().instance.returnPoint(c);
        return n;
    }
    handleRelease(newCropTouch) {
        if (newCropTouch == null) {
            return;
        }
        let index = 0;
        for (let k = 0; k < this.currentDragTouches.length; k++) {
            if (newCropTouch.id === this.currentDragTouches[k].id) {
                this.currentDragTouches[k].dragHandle.setDrag(false);
                index = k;
            }
        }
        this.currentDragTouches.splice(index, 1);
        this.draw(this.ctx);
    }
    handleMove(newCropTouch) {
        let matched = false;
        // tslint:disable-next-line:prefer-for-of
        for (let k = 0; k < this.currentDragTouches.length; k++) {
            if (newCropTouch.id === this.currentDragTouches[k].id &&
                this.currentDragTouches[k].dragHandle != null) {
                const dragTouch = this.currentDragTouches[k];
                const clampedPositions = this.clampPosition(newCropTouch.x - dragTouch.dragHandle.offset.x, newCropTouch.y - dragTouch.dragHandle.offset.y);
                newCropTouch.x = clampedPositions.x;
                newCropTouch.y = clampedPositions.y;
                new PointPool().instance.returnPoint(clampedPositions);
                if (dragTouch.dragHandle instanceof CornerMarker) {
                    this.dragCorner(newCropTouch.x, newCropTouch.y, dragTouch.dragHandle);
                }
                else {
                    this.dragCenter(newCropTouch.x, newCropTouch.y, dragTouch.dragHandle);
                }
                this.currentlyInteracting = true;
                matched = true;
                this.imageCropperDataShare.setPressed(this.canvas);
                break;
            }
        }
        if (!matched) {
            for (const marker of this.markers) {
                if (marker.touchInBounds(newCropTouch.x, newCropTouch.y)) {
                    newCropTouch.dragHandle = marker;
                    this.currentDragTouches.push(newCropTouch);
                    marker.setDrag(true);
                    newCropTouch.dragHandle.offset.x =
                        newCropTouch.x - newCropTouch.dragHandle.position.x;
                    newCropTouch.dragHandle.offset.y =
                        newCropTouch.y - newCropTouch.dragHandle.position.y;
                    this.dragCorner(newCropTouch.x - newCropTouch.dragHandle.offset.x, newCropTouch.y - newCropTouch.dragHandle.offset.y, newCropTouch.dragHandle);
                    break;
                }
            }
            if (newCropTouch.dragHandle === null ||
                typeof newCropTouch.dragHandle === 'undefined') {
                if (this.center.touchInBounds(newCropTouch.x, newCropTouch.y)) {
                    newCropTouch.dragHandle = this.center;
                    this.currentDragTouches.push(newCropTouch);
                    newCropTouch.dragHandle.setDrag(true);
                    newCropTouch.dragHandle.offset.x =
                        newCropTouch.x - newCropTouch.dragHandle.position.x;
                    newCropTouch.dragHandle.offset.y =
                        newCropTouch.y - newCropTouch.dragHandle.position.y;
                    this.dragCenter(newCropTouch.x - newCropTouch.dragHandle.offset.x, newCropTouch.y - newCropTouch.dragHandle.offset.y, newCropTouch.dragHandle);
                }
            }
        }
    }
    updateClampBounds() {
        const sourceAspect = this.srcImage.height / this.srcImage.width;
        const canvasAspect = this.canvas.height / this.canvas.width;
        let w = this.canvas.width;
        let h = this.canvas.height;
        if (canvasAspect > sourceAspect) {
            w = this.canvas.width;
            h = this.canvas.width * sourceAspect;
        }
        else {
            h = this.canvas.height;
            w = this.canvas.height / sourceAspect;
        }
        this.minXClamp = this.canvas.width / 2 - w / 2;
        this.minYClamp = this.canvas.height / 2 - h / 2;
        this.maxXClamp = this.canvas.width / 2 + w / 2;
        this.maxYClamp = this.canvas.height / 2 + h / 2;
    }
    getCropBounds() {
        const bounds = this.getBounds();
        bounds.top = Math.round((bounds.top - this.minYClamp) / this.ratioH);
        bounds.bottom = Math.round((bounds.bottom - this.minYClamp) / this.ratioH);
        bounds.left = Math.round((bounds.left - this.minXClamp) / this.ratioW);
        bounds.right = Math.round((bounds.right - this.minXClamp) / this.ratioW);
        return bounds;
    }
    clampPosition(x, y) {
        if (x < this.minXClamp) {
            x = this.minXClamp;
        }
        if (x > this.maxXClamp) {
            x = this.maxXClamp;
        }
        if (y < this.minYClamp) {
            y = this.minYClamp;
        }
        if (y > this.maxYClamp) {
            y = this.maxYClamp;
        }
        return new PointPool().instance.borrow(x, y);
    }
    isImageSet() {
        return this.imageSet;
    }
    setImage(img) {
        this.srcImage = img;
        if (!img) {
            this.imageSet = false;
            this.draw(this.ctx);
        }
        else {
            this.imageSet = true;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            const bufferContext = this.buffer.getContext('2d');
            bufferContext.clearRect(0, 0, this.buffer.width, this.buffer.height);
            if (!this.cropperSettings.fileType) {
                this.fileType = this.getDataUriMimeType(img.src);
            }
            if (this.cropperSettings.minWithRelativeToResolution) {
                this.minWidth =
                    (this.canvas.width * this.cropperSettings.minWidth) /
                        this.srcImage.width;
                this.minHeight =
                    (this.canvas.height * this.cropperSettings.minHeight) /
                        this.srcImage.height;
            }
            this.updateClampBounds();
            this.canvasWidth = this.canvas.width;
            this.canvasHeight = this.canvas.height;
            const cropPosition = this.getCropPositionFromMarkers();
            this.setCropPosition(cropPosition);
        }
    }
    updateCropPosition(cropBounds) {
        const cropPosition = this.getCropPositionFromBounds(cropBounds);
        this.setCropPosition(cropPosition);
    }
    setCropPosition(cropPosition) {
        this.tl.setPosition(cropPosition[0].x, cropPosition[0].y);
        this.tr.setPosition(cropPosition[1].x, cropPosition[1].y);
        this.bl.setPosition(cropPosition[2].x, cropPosition[2].y);
        this.br.setPosition(cropPosition[3].x, cropPosition[3].y);
        this.center.setPosition(cropPosition[4].x, cropPosition[4].y);
        for (const position of cropPosition) {
            new PointPool().instance.returnPoint(position);
        }
        this.vertSquashRatio = this.detectVerticalSquash(this.srcImage);
        this.draw(this.ctx);
        this.croppedImage = this.getCroppedImageHelper(false, this.cropWidth, this.cropHeight);
    }
    getCropPositionFromMarkers() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        let tlPos;
        let trPos;
        let blPos;
        let brPos;
        let center;
        const sourceAspect = this.srcImage.height / this.srcImage.width;
        const cropBounds = this.getBounds();
        const cropAspect = cropBounds.height / cropBounds.width;
        const cX = this.canvas.width / 2;
        const cY = this.canvas.height / 2;
        if (cropAspect > sourceAspect) {
            const imageH = Math.min(w * sourceAspect, h);
        const cropW = (this.cropperSettings.showFullCropInitial) ? Math.min(h / sourceAspect, w) : imageH / cropAspect;
            tlPos = new PointPool().instance.borrow(cX - cropW / 2, cY + imageH / 2);
            trPos = new PointPool().instance.borrow(cX + cropW / 2, cY + imageH / 2);
            blPos = new PointPool().instance.borrow(cX - cropW / 2, cY - imageH / 2);
            brPos = new PointPool().instance.borrow(cX + cropW / 2, cY - imageH / 2);
        }
        else {
            const imageW = Math.min(h / sourceAspect, w);
            const cropH = (this.cropperSettings.showFullCropInitial) ? Math.min(w * sourceAspect, h) : imageW * cropAspect;
            tlPos = new PointPool().instance.borrow(cX - imageW / 2, cY + cropH / 2);
            trPos = new PointPool().instance.borrow(cX + imageW / 2, cY + cropH / 2);
            blPos = new PointPool().instance.borrow(cX - imageW / 2, cY - cropH / 2);
            brPos = new PointPool().instance.borrow(cX + imageW / 2, cY - cropH / 2);
        }
        center = new PointPool().instance.borrow(cX, cY);
        const positions = [tlPos, trPos, blPos, brPos, center];
        return positions;
    }
    getCropPositionFromBounds(cropPosition) {
        let marginTop = 0;
        let marginLeft = 0;
        const canvasAspect = this.canvasHeight / this.canvasWidth;
        const sourceAspect = this.srcImage.height / this.srcImage.width;
        if (canvasAspect > sourceAspect) {
            marginTop =
                this.buffer.height / 2 - (this.canvasWidth * sourceAspect) / 2;
        }
        else {
            marginLeft = this.buffer.width / 2 - this.canvasHeight / sourceAspect / 2;
        }
        const ratioW = (this.canvasWidth - marginLeft * 2) / this.srcImage.width;
        const ratioH = (this.canvasHeight - marginTop * 2) / this.srcImage.height;
        let actualH = cropPosition.height * ratioH;
        let actualW = cropPosition.width * ratioW;
        const actualX = cropPosition.left * ratioW + marginLeft;
        const actualY = cropPosition.top * ratioH + marginTop;
        if (this.keepAspect) {
            const scaledW = actualH / this.aspectRatio;
            const scaledH = actualW * this.aspectRatio;
            if (this.getCropBounds().height === cropPosition.height) {
                // only width changed
                actualH = scaledH;
            }
            else if (this.getCropBounds().width === cropPosition.width) {
                // only height changed
                actualW = scaledW;
            }
            else {
                // height and width changed
                if (Math.abs(scaledH - actualH) < Math.abs(scaledW - actualW)) {
                    actualW = scaledW;
                }
                else {
                    actualH = scaledH;
                }
            }
        }
        const tlPos = new PointPool().instance.borrow(actualX, actualY + actualH);
        const trPos = new PointPool().instance.borrow(actualX + actualW, actualY + actualH);
        const blPos = new PointPool().instance.borrow(actualX, actualY);
        const brPos = new PointPool().instance.borrow(actualX + actualW, actualY);
        const center = new PointPool().instance.borrow(actualX + actualW / 2, actualY + actualH / 2);
        const positions = [tlPos, trPos, blPos, brPos, center];
        return positions;
    }
    getCroppedImageHelper(preserveSize, fillWidth, fillHeight) {
        if (this.cropperSettings.cropOnResize) {
            return this.getCroppedImage(preserveSize, fillWidth, fillHeight);
        }
        return this.croppedImage
            ? this.croppedImage
            : document.createElement('img');
    }
    // todo: Unused parameters?
    getCroppedImage(preserveSize, fillWidth, fillHeight) {
        const bounds = this.getBounds();
        if (!this.srcImage) {
            return document.createElement('img');
        }
        else {
            const sourceAspect = this.srcImage.height / this.srcImage.width;
            const canvasAspect = this.canvas.height / this.canvas.width;
            let w = this.canvas.width;
            let h = this.canvas.height;
            if (canvasAspect > sourceAspect) {
                w = this.canvas.width;
                h = this.canvas.width * sourceAspect;
            }
            else {
                if (canvasAspect < sourceAspect) {
                    h = this.canvas.height;
                    w = this.canvas.height / sourceAspect;
                }
                else {
                    h = this.canvas.height;
                    w = this.canvas.width;
                }
            }
            this.ratioW = w / this.srcImage.width;
            this.ratioH = h / this.srcImage.height;
            const offsetH = (this.buffer.height - h) / 2 / this.ratioH;
            const offsetW = (this.buffer.width - w) / 2 / this.ratioW;
            const ctx = this.cropCanvas.getContext('2d');
            if (this.cropperSettings.preserveSize || preserveSize) {
                const width = Math.round(bounds.right / this.ratioW - bounds.left / this.ratioW);
                const height = Math.round(bounds.bottom / this.ratioH - bounds.top / this.ratioH);
                this.cropCanvas.width = width;
                this.cropCanvas.height = height;
                this.cropperSettings.croppedWidth = this.cropCanvas.width;
                this.cropperSettings.croppedHeight = this.cropCanvas.height;
            }
            else {
                this.cropCanvas.width = this.cropWidth;
                this.cropCanvas.height = this.cropHeight;
            }
            ctx.clearRect(0, 0, this.cropCanvas.width, this.cropCanvas.height);
            this.drawImageIOSFix(ctx, this.srcImage, Math.max(Math.round(bounds.left / this.ratioW - offsetW), 0), Math.max(Math.round(bounds.top / this.ratioH - offsetH), 0), Math.max(Math.round(bounds.width / this.ratioW), 1), Math.max(Math.round(bounds.height / this.ratioH), 1), 0, 0, this.cropCanvas.width, this.cropCanvas.height);
            if (this.cropperSettings.resampleFn) {
                this.cropperSettings.resampleFn(this.cropCanvas);
            }
            this.croppedImage.width = this.cropCanvas.width;
            this.croppedImage.height = this.cropCanvas.height;
            this.croppedImage.src = this.cropCanvas.toDataURL(this.fileType, this.cropperSettings.compressRatio);
            return this.croppedImage;
        }
    }
    getBounds() {
        let minX = Number.MAX_VALUE;
        let minY = Number.MAX_VALUE;
        let maxX = -Number.MAX_VALUE;
        let maxY = -Number.MAX_VALUE;
        for (const marker of this.markers) {
            if (marker.position.x < minX) {
                minX = marker.position.x;
            }
            if (marker.position.x > maxX) {
                maxX = marker.position.x;
            }
            if (marker.position.y < minY) {
                minY = marker.position.y;
            }
            if (marker.position.y > maxY) {
                maxY = marker.position.y;
            }
        }
        const bounds = new Bounds();
        bounds.left = minX;
        bounds.right = maxX;
        bounds.top = minY;
        bounds.bottom = maxY;
        return bounds;
    }
    setBounds(bounds) {
        // const topLeft: CornerMarker;
        // const topRight: CornerMarker;
        // const bottomLeft: CornerMarker;
        // const bottomRight: CornerMarker;
        const currentBounds = this.getBounds();
        for (const marker of this.markers) {
            if (marker.position.x === currentBounds.left) {
                if (marker.position.y === currentBounds.top) {
                    marker.setPosition(bounds.left, bounds.top);
                }
                else {
                    marker.setPosition(bounds.left, bounds.bottom);
                }
            }
            else {
                if (marker.position.y === currentBounds.top) {
                    marker.setPosition(bounds.right, bounds.top);
                }
                else {
                    marker.setPosition(bounds.right, bounds.bottom);
                }
            }
        }
        this.center.recalculatePosition(bounds);
        this.center.draw(this.ctx);
        this.draw(this.ctx); // we need to redraw all canvas if we have changed bounds
    }
    onTouchMove(event) {
        if (this.crop.isImageSet()) {
            if (event.touches.length === 1) {
                if (this.isMouseDown) {
                    event.preventDefault();
                    // tslint:disable-next-line:prefer-for-of
                    for (let i = 0; i < event.touches.length; i++) {
                        const touch = event.touches[i];
                        const touchPosition = this.getTouchPos(this.canvas, touch);
                        const cropTouch = new CropTouch(touchPosition.x, touchPosition.y, touch.identifier);
                        new PointPool().instance.returnPoint(touchPosition);
                        this.move(cropTouch);
                    }
                }
            }
            else {
                if (event.touches.length === 2) {
                    event.preventDefault();
                    const distance = (event.touches[0].clientX - event.touches[1].clientX) *
                        (event.touches[0].clientX - event.touches[1].clientX) +
                        (event.touches[0].clientY - event.touches[1].clientY) *
                            (event.touches[0].clientY - event.touches[1].clientY);
                    if (this.previousDistance && this.previousDistance !== distance) {
                        const bounds = this.getBounds();
                        if (distance < this.previousDistance) {
                            bounds.top += 1;
                            bounds.left += 1;
                            bounds.right -= 1;
                            bounds.bottom -= 1;
                        }
                        if (distance > this.previousDistance) {
                            if (bounds.top !== this.minYClamp &&
                                bounds.bottom !== this.maxYClamp &&
                                bounds.left !== this.minXClamp &&
                                bounds.right !== this.maxXClamp) {
                                // none
                                bounds.top -= 1;
                                bounds.left -= 1;
                                bounds.right += 1;
                                bounds.bottom += 1;
                            }
                            else if (bounds.top !== this.minYClamp &&
                                bounds.bottom !== this.maxYClamp &&
                                bounds.left === this.minXClamp &&
                                bounds.right !== this.maxXClamp) {
                                // left
                                bounds.top -= 1;
                                bounds.right += 2;
                                bounds.bottom += 1;
                            }
                            else if (bounds.top !== this.minYClamp &&
                                bounds.bottom !== this.maxYClamp &&
                                bounds.left !== this.minXClamp &&
                                bounds.right === this.maxXClamp) {
                                // right
                                bounds.top -= 1;
                                bounds.left -= 2;
                                bounds.bottom += 1;
                            }
                            else if (bounds.top === this.minYClamp &&
                                bounds.bottom !== this.maxYClamp &&
                                bounds.left !== this.minXClamp &&
                                bounds.right !== this.maxXClamp) {
                                // top
                                bounds.left -= 1;
                                bounds.right += 1;
                                bounds.bottom += 2;
                            }
                            else if (bounds.top !== this.minYClamp &&
                                bounds.bottom === this.maxYClamp &&
                                bounds.left !== this.minXClamp &&
                                bounds.right !== this.maxXClamp) {
                                // bottom
                                bounds.top -= 2;
                                bounds.left -= 1;
                                bounds.right += 1;
                            }
                            else if (bounds.top === this.minYClamp &&
                                bounds.bottom !== this.maxYClamp &&
                                bounds.left === this.minXClamp &&
                                bounds.right !== this.maxXClamp) {
                                // top left
                                bounds.right += 2;
                                bounds.bottom += 2;
                            }
                            else if (bounds.top === this.minYClamp &&
                                bounds.bottom !== this.maxYClamp &&
                                bounds.left !== this.minXClamp &&
                                bounds.right === this.maxXClamp) {
                                // top right
                                bounds.left -= 2;
                                bounds.bottom += 2;
                            }
                            else if (bounds.top !== this.minYClamp &&
                                bounds.bottom === this.maxYClamp &&
                                bounds.left === this.minXClamp &&
                                bounds.right !== this.maxXClamp) {
                                // bottom left
                                bounds.top -= 2;
                                bounds.right += 2;
                            }
                            else if (bounds.top !== this.minYClamp &&
                                bounds.bottom === this.maxYClamp &&
                                bounds.left !== this.minXClamp &&
                                bounds.right === this.maxXClamp) {
                                // bottom right
                                bounds.top -= 2;
                                bounds.left -= 2;
                            }
                        }
                        if (bounds.top < this.minYClamp) {
                            bounds.top = this.minYClamp;
                        }
                        if (bounds.bottom > this.maxYClamp) {
                            bounds.bottom = this.maxYClamp;
                        }
                        if (bounds.left < this.minXClamp) {
                            bounds.left = this.minXClamp;
                        }
                        if (bounds.right > this.maxXClamp) {
                            bounds.right = this.maxXClamp;
                        }
                        this.setBounds(bounds);
                    }
                    this.previousDistance = distance;
                }
            }
            this.draw(this.ctx);
        }
    }
    onMouseMove(e) {
        if (this.crop.isImageSet() && this.isMouseDown) {
            const mousePosition = this.getMousePos(this.canvas, e);
            this.move(new CropTouch(mousePosition.x, mousePosition.y, 0));
            let dragTouch = this.getDragTouchForID(0);
            if (dragTouch) {
                dragTouch.x = mousePosition.x;
                dragTouch.y = mousePosition.y;
            }
            else {
                dragTouch = new CropTouch(mousePosition.x, mousePosition.y, 0);
            }
            new PointPool().instance.returnPoint(mousePosition);
            this.drawCursors(dragTouch);
            this.draw(this.ctx);
        }
    }
    move(cropTouch) {
        if (this.isMouseDown) {
            this.handleMove(cropTouch);
        }
    }
    getDragTouchForID(id) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.currentDragTouches.length; i++) {
            if (id === this.currentDragTouches[i].id) {
                return this.currentDragTouches[i];
            }
        }
        return undefined;
    }
    drawCursors(cropTouch) {
        let cursorDrawn = false;
        if (cropTouch != null) {
            if (cropTouch.dragHandle === this.center) {
                this.imageCropperDataShare.setStyle(this.canvas, 'move');
                cursorDrawn = true;
            }
            if (cropTouch.dragHandle !== null &&
                cropTouch.dragHandle instanceof CornerMarker) {
                this.drawCornerCursor(cropTouch.dragHandle, cropTouch.dragHandle.position.x, cropTouch.dragHandle.position.y);
                cursorDrawn = true;
            }
        }
        let didDraw = false;
        if (!cursorDrawn) {
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < this.markers.length; i++) {
                didDraw =
                    didDraw ||
                        this.drawCornerCursor(this.markers[i], cropTouch.x, cropTouch.y);
            }
            if (!didDraw) {
                this.imageCropperDataShare.setStyle(this.canvas, 'initial');
            }
        }
        if (!didDraw &&
            !cursorDrawn &&
            this.center.touchInBounds(cropTouch.x, cropTouch.y)) {
            this.center.setOver(true);
            this.imageCropperDataShare.setOver(this.canvas);
            this.imageCropperDataShare.setStyle(this.canvas, 'move');
        }
        else {
            this.center.setOver(false);
        }
    }
    drawCornerCursor(marker, x, y) {
        if (marker.touchInBounds(x, y)) {
            marker.setOver(true);
            if (marker.getHorizontalNeighbour().position.x > marker.position.x) {
                if (marker.getVerticalNeighbour().position.y > marker.position.y) {
                    this.imageCropperDataShare.setOver(this.canvas);
                    this.imageCropperDataShare.setStyle(this.canvas, 'nwse-resize');
                }
                else {
                    this.imageCropperDataShare.setOver(this.canvas);
                    this.imageCropperDataShare.setStyle(this.canvas, 'nesw-resize');
                }
            }
            else {
                if (marker.getVerticalNeighbour().position.y > marker.position.y) {
                    this.imageCropperDataShare.setOver(this.canvas);
                    this.imageCropperDataShare.setStyle(this.canvas, 'nesw-resize');
                }
                else {
                    this.imageCropperDataShare.setOver(this.canvas);
                    this.imageCropperDataShare.setStyle(this.canvas, 'nwse-resize');
                }
            }
            return true;
        }
        marker.setOver(false);
        return false;
    }
    onTouchStart(event) {
        if (this.crop.isImageSet()) {
            const touch = event.touches[0];
            const touchPosition = this.getTouchPos(this.canvas, touch);
            const cropTouch = new CropTouch(touchPosition.x, touchPosition.y, touch.identifier);
            new PointPool().instance.returnPoint(touchPosition);
            this.isMouseDown = false;
            for (const marker of this.markers) {
                if (marker.touchInBounds(cropTouch.x, cropTouch.y)) {
                    this.isMouseDown = true;
                }
            }
            if (this.center.touchInBounds(cropTouch.x, cropTouch.y)) {
                this.isMouseDown = true;
            }
        }
    }
    onTouchEnd(event) {
        if (this.crop.isImageSet()) {
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < event.changedTouches.length; i++) {
                const touch = event.changedTouches[i];
                const dragTouch = this.getDragTouchForID(touch.identifier);
                if (dragTouch && dragTouch !== undefined) {
                    if (dragTouch.dragHandle instanceof CornerMarker ||
                        dragTouch.dragHandle instanceof DragMarker) {
                        dragTouch.dragHandle.setOver(false);
                    }
                    this.handleRelease(dragTouch);
                }
            }
            if (this.currentDragTouches.length === 0) {
                this.isMouseDown = false;
                this.currentlyInteracting = false;
            }
        }
    }
    // http://stackoverflow.com/questions/11929099/html5-canvas-drawimage-ratio-bug-ios
    drawImageIOSFix(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
        // Works only if whole image is displayed:
        // ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
        // The following works correct also when only a part of the image is displayed:
        // ctx.drawImage(img, sx * this.vertSquashRatio, sy * this.vertSquashRatio, sw * this.vertSquashRatio, sh *
        // this.vertSquashRatio, dx, dy, dw, dh);
        ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
    }
    onMouseDown(event) {
        if (this.crop.isImageSet()) {
            this.isMouseDown = true;
        }
    }
    onMouseUp(event) {
        if (this.crop.isImageSet()) {
            this.imageCropperDataShare.setReleased(this.canvas);
            this.isMouseDown = false;
            this.handleRelease(new CropTouch(0, 0, 0));
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2VDcm9wcGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWltZy1jcm9wcGVyL3NyYy9saWIvaW1hZ2UtY3JvcHBlci9pbWFnZUNyb3BwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3hDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNwRCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFOUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzlELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ2hFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUk5QyxNQUFNLE9BQU8sWUFBYSxTQUFRLGlCQUFpQjtJQU1qRCxZQUFZLGVBQWdDO1FBQzFDLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUkscUJBQXFCLEVBQUUsQ0FBQztRQUN6RCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixNQUFNLEtBQUssR0FBVyxlQUFlLENBQUMsS0FBSyxDQUFDO1FBQzVDLE1BQU0sTUFBTSxHQUFXLGVBQWUsQ0FBQyxNQUFNLENBQUM7UUFDOUMsTUFBTSxVQUFVLEdBQVksZUFBZSxDQUFDLFVBQVUsQ0FBQztRQUN2RCxNQUFNLFdBQVcsR0FBVyxlQUFlLENBQUMsV0FBVyxDQUFDO1FBQ3hELE1BQU0saUJBQWlCLEdBQVcsZUFBZSxDQUFDLGlCQUFpQixDQUFDO1FBQ3BFLE1BQU0sUUFBUSxHQUFXLGVBQWUsQ0FBQyxRQUFRLENB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QUFDLEdBQUcsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDbEMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ25DLE1BQU0sR0FBRyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNsQyxNQUFNLE1BQU0sR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDckMsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUMzQixDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztTQUN2QztRQUNELElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDMUIsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7U0FDdkM7UUFDRCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ3hCLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1NBQ3hDO1FBQ0QsSUFBSSxNQUFNLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUM1QixDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztTQUN4QztRQUNELElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxHQUFHLENB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VyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFFMUMsSUFBSSxVQUFVLEdBQUcsWUFBWSxFQUFFO1lBQzdCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM3QyxNQUFNLEtBQUssR0FBRyxNQUFNLEdBQUcsVUFBVSxDQUFDO1lBQ2xDLEtBQUssR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEtBQUssR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN6RSxLQUFLLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxLQUFLLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDekUsS0FBSyxHQUFHLElBQUksU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsS0FBSyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3pFLEtBQUssR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEtBQUssR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztTQUMxRTthQUFNO1lBQ0wsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzdDLE1BQU0sS0FBSyxHQUFHLE1BQU0sR0FBRyxVQUFVLENBQUM7WUFDbEMsS0FBSyxHQUFHLElBQUksU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsTUFBTSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsS0FB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LEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM1QztJQUNILENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJvdW5kcyB9IGZyb20gJy4vbW9kZWwvYm91bmRzJztcbmltcG9ydCB7IENvcm5lck1hcmtlciB9IGZyb20gJy4vbW9kZWwvY29ybmVyTWFya2VyJztcbmltcG9ydCB7IENyb3BUb3VjaCB9IGZyb20gJy4vbW9kZWwvY3JvcFRvdWNoJztcbmltcG9ydCB7IENyb3BwZXJTZXR0aW5ncyB9IGZyb20gJy4vY3JvcHBlci1zZXR0aW5ncyc7XG5pbXBvcnQgeyBEcmFnTWFya2VyIH0gZnJvbSAnLi9tb2RlbC9kcmFnTWFya2VyJztcbmltcG9ydCB7IEltYWdlQ3JvcHBlck1vZGVsIH0gZnJvbSAnLi9tb2RlbC9pbWFnZUNyb3BwZXJNb2RlbCc7XG5pbXBvcnQgeyBJbWFnZUNyb3BwZXJEYXRhU2hhcmUgfSBmcm9tICcuL2ltYWdlQ3JvcHBlckRhdGFTaGFyZSc7XG5pbXBvcnQgeyBQb2ludFBvb2wgfSBmcm9tICcuL21vZGVsL3BvaW50UG9vbCc7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gJy4vbW9kZWwvcG9pbnQnO1xuaW1wb3J0IHsgSUNvcm5lck1hcmtlciB9IGZyb20gJy4vbW9kZWwvY29ybmVyTWFya2VyJztcblxuZXhwb3J0IGNsYXNzIEltYWdlQ3JvcHBlciBleHRlbmRzIEltYWdlQ3JvcHBlck1vZGVsIHtcbiAgcHJpdmF0ZSBjcm9wOiBJbWFnZUNyb3BwZXI7XG4gIHByaXZhdGUgY3JvcHBlclNldHRpbmdzOiBDcm9wcGVyU2V0dGluZ3M7XG4gIHByaXZhdGUgcHJldmlvdXNEaXN0YW5jZTogbnVtYmVyO1xuICBwcml2YXRlIGltYWdlQ3JvcHBlckRhdGFTaGFyZTogSW1hZ2VDcm9wcGVyRGF0YVNoYXJlO1xuXG4gIGNvbnN0cnVjdG9yKGNyb3BwZXJTZXR0aW5nczogQ3JvcHBlclNldHRpbmdzKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmltYWdlQ3JvcHBlckRhdGFTaGFyZSA9IG5ldyBJbWFnZUNyb3BwZXJEYXRhU2hhcmUoKTtcbiAgICBjb25zdCB4ID0gMDtcbiAgICBjb25zdCB5ID0gMDtcbiAgICBjb25zdCB3aWR0aDogbnVtYmVyID0gY3JvcHBlclNldHRpbmdzLndpZHRoO1xuICAgIGNvbnN0IGhlaWdodDogbnVtYmVyID0gY3JvcHBlclNldHRpbmdzLmhlaWdodDtcbiAgICBjb25zdCBrZWVwQXNwZWN0OiBib29sZWFuID0gY3JvcHBlclNldHRpbmdzLmtlZXBBc3BlY3Q7XG4gICAgY29uc3QgdG91Y2hSYWRpdXM6IG51bWJlciA9IGNyb3BwZXJTZXR0aW5ncy50b3VjaFJhZGl1cztcbiAgICBjb25zdCBjZW50ZXJUb3VjaFJhZGl1czogbnVtYmVyID0gY3JvcHBlclNldHRpbmdzLmNlbnRlclRvdWNoUmFkaXVzO1xuICAgIGNvbnN0IG1pbldpZHRoOiBudW1iZXIgPSBjcm9wcGVyU2V0dGluZ3MubWluV2lkdGg7XG4gICAgY29uc3QgbWluSGVpZ2h0OiBudW1iZXIgPSBjcm9wcGVyU2V0dGluZ3MubWluSGVpZ2h0O1xuICAgIGNvbnN0IGNyb3BwZWRXaWR0aDogbnVtYmVyID0gY3JvcHBlclNldHRpbmdzLmNyb3BwZWRXaWR0aDtcbiAgICBjb25zdCBjcm9wcGVkSGVpZ2h0OiBudW1iZXIgPSBjcm9wcGVyU2V0dGluZ3MuY3JvcHBlZEhlaWdodDtcblxuICAgIHRoaXMuY3JvcHBlclNldHRpbmdzID0gY3JvcHBlclNldHRpbmdzO1xuXG4gICAgdGhpcy5jcm9wID0gdGhpcztcbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG5cbiAgICB0aGlzLmNhbnZhc0hlaWdodCA9IGNyb3BwZXJTZXR0aW5ncy5jYW52YXNIZWlnaHQ7XG4gICAgdGhpcy5jYW52YXNXaWR0aCA9IGNyb3BwZXJTZXR0aW5ncy5jYW52YXNXaWR0aDtcblxuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICBpZiAod2lkdGggPT09IHZvaWQgMCkge1xuICAgICAgdGhpcy53aWR0aCA9IDEwMDtcbiAgICB9XG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgaWYgKGhlaWdodCA9PT0gdm9pZCAwKSB7XG4gICAgICB0aGlzLmhlaWdodCA9IDUwO1xuICAgIH1cbiAgICB0aGlzLmtlZXBBc3BlY3QgPSBrZWVwQXNwZWN0O1xuICAgIGlmIChrZWVwQXNwZWN0ID09PSB2b2lkIDApIHtcbiAgICAgIHRoaXMua2VlcEFzcGVjdCA9IHRydWU7XG4gICAgfVxuICAgIHRoaXMudG91Y2hSYWRpdXMgPSB0b3VjaFJhZGl1cztcbiAgICBpZiAodG91Y2hSYWRpdXMgPT09IHZvaWQgMCkge1xuICAgICAgdGhpcy50b3VjaFJhZGl1cyA9IDIwO1xuICAgIH1cbiAgICB0aGlzLm1pbldpZHRoID0gbWluV2lkdGg7XG4gICAgdGhpcy5taW5IZWlnaHQgPSBtaW5IZWlnaHQ7XG4gICAgdGhpcy5hc3BlY3RSYXRpbyA9IDA7XG4gICAgdGhpcy5jdXJyZW50RHJhZ1RvdWNoZXMgPSBbXTtcbiAgICB0aGlzLmlzTW91c2VEb3duID0gZmFsc2U7XG4gICAgdGhpcy5yYXRpb1cgPSAxO1xuICAgIHRoaXMucmF0aW9IID0gMTtcbiAgICB0aGlzLmZpbGVUeXBlID0gY3JvcHBlclNldHRpbmdzLmZpbGVUeXBlO1xuICAgIHRoaXMuaW1hZ2VTZXQgPSBmYWxzZTtcbiAgICB0aGlzLnBvaW50UG9vbCA9IG5ldyBQb2ludFBvb2woMjAwKTtcblxuICAgIHRoaXMudGwgPSBuZXcgQ29ybmVyTWFya2VyKHgsIHksIHRvdWNoUmFkaXVzLCB0aGlzLmNyb3BwZXJTZXR0aW5ncyk7XG4gICAgdGhpcy50ciA9IG5ldyBDb3JuZXJNYXJrZXIoeCArIHdpZHRoLCB5LCB0b3VjaFJhZGl1cywgdGhpcy5jcm9wcGVyU2V0dGluZ3MpO1xuICAgIHRoaXMuYmwgPSBuZXcgQ29ybmVyTWFya2VyKFxuICAgICAgeCxcbiAgICAgIHkgKyBoZWlnaHQsXG4gICAgICB0b3VjaFJhZGl1cyxcbiAgICAgIHRoaXMuY3JvcHBlclNldHRpbmdzXG4gICAgKTtcbiAgICB0aGlzLmJyID0gbmV3IENvcm5lck1hcmtlcihcbiAgICAgIHggKyB3aWR0aCxcbiAgICAgIHkgKyBoZWlnaHQsXG4gICAgICB0b3VjaFJhZGl1cyxcbiAgICAgIHRoaXMuY3JvcHBlclNldHRpbmdzXG4gICAgKTtcblxuICAgIHRoaXMudGwuYWRkSG9yaXpvbnRhbE5laWdoYm91cih0aGlzLnRyKTtcbiAgICB0aGlzLnRsLmFkZFZlcnRpY2FsTmVpZ2hib3VyKHRoaXMuYmwpO1xuICAgIHRoaXMudHIuYWRkSG9yaXpvbnRhbE5laWdoYm91cih0aGlzLnRsKTtcbiAgICB0aGlzLnRyLmFkZFZlcnRpY2FsTmVpZ2hib3VyKHRoaXMuYnIpO1xuICAgIHRoaXMuYmwuYWRkSG9yaXpvbnRhbE5laWdoYm91cih0aGlzLmJyKTtcbiAgICB0aGlzLmJsLmFkZFZlcnRpY2FsTmVpZ2hib3VyKHRoaXMudGwpO1xuICAgIHRoaXMuYnIuYWRkSG9yaXpvbnRhbE5laWdoYm91cih0aGlzLmJsKTtcbiAgICB0aGlzLmJyLmFkZFZlcnRpY2FsTmVpZ2hib3VyKHRoaXMudHIpO1xuICAgIHRoaXMubWFya2VycyA9IFt0aGlzLnRsLCB0aGlzLnRyLCB0aGlzLmJsLCB0aGlzLmJyXTtcblxuICAgIHRoaXMuY2VudGVyID0gbmV3IERyYWdNYXJrZXIoXG4gICAgICB4ICsgd2lkdGggLyAyLFxuICAgICAgeSArIGhlaWdodCAvIDIsXG4gICAgICBjZW50ZXJUb3VjaFJhZGl1cyxcbiAgICAgIHRoaXMuY3JvcHBlclNldHRpbmdzXG4gICAgKTtcbiAgICB0aGlzLmFzcGVjdFJhdGlvID0gaGVpZ2h0IC8gd2lkdGg7XG4gICAgdGhpcy5jcm9wcGVkSW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgICB0aGlzLmN1cnJlbnRseUludGVyYWN0aW5nID0gZmFsc2U7XG4gICAgdGhpcy5jcm9wV2lkdGggPSBjcm9wcGVkV2lkdGg7XG4gICAgdGhpcy5jcm9wSGVpZ2h0ID0gY3JvcHBlZEhlaWdodDtcbiAgfVxuXG4gIHByaXZhdGUgc2lnbih4OiBudW1iZXIpOiBudW1iZXIge1xuICAgIGlmICgreCA9PT0geCkge1xuICAgICAgcmV0dXJuIHggPT09IDAgPyB4IDogeCA+IDAgPyAxIDogLTE7XG4gICAgfVxuICAgIHJldHVybiBOYU47XG4gIH1cblxuICBwcml2YXRlIGdldE1vdXNlUG9zKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsIGV2dDogTW91c2VFdmVudCk6IFBvaW50IHtcbiAgICBjb25zdCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHJldHVybiBuZXcgUG9pbnRQb29sKCkuaW5zdGFuY2UuYm9ycm93KFxuICAgICAgZXZ0LmNsaWVudFggLSByZWN0LmxlZnQsXG4gICAgICBldnQuY2xpZW50WSAtIHJlY3QudG9wXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0VG91Y2hQb3MoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCwgdG91Y2g6IFRvdWNoKTogUG9pbnQge1xuICAgIGNvbnN0IHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgcmV0dXJuIG5ldyBQb2ludFBvb2woKS5pbnN0YW5jZS5ib3Jyb3coXG4gICAgICB0b3VjaC5jbGllbnRYIC0gcmVjdC5sZWZ0LFxuICAgICAgdG91Y2guY2xpZW50WSAtIHJlY3QudG9wXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgZGV0ZWN0VmVydGljYWxTcXVhc2goXG4gICAgaW1nOiBIVE1MSW1hZ2VFbGVtZW50IHwgSFRNTENhbnZhc0VsZW1lbnQgfCBIVE1MVmlkZW9FbGVtZW50XG4gICkge1xuICAgIGNvbnN0IGloID0gaW1nLmhlaWdodDtcbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICBjYW52YXMud2lkdGggPSAxO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBpaDtcbiAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gICAgY3R4LmRyYXdJbWFnZShpbWcsIDAsIDApO1xuICAgIGNvbnN0IGltYWdlRGF0YTogYW55ID0gY3R4LmdldEltYWdlRGF0YSgwLCAwLCAxLCBpaCk7XG4gICAgaWYgKGltYWdlRGF0YSkge1xuICAgICAgY29uc3QgZGF0YSA9IGltYWdlRGF0YS5kYXRhO1xuICAgICAgLy8gc2VhcmNoIGltYWdlIGVkZ2UgcGl4ZWwgcG9zaXRpb24gaW4gY2FzZSBpdCBpcyBzcXVhc2hlZCB2ZXJ0aWNhbGx5LlxuICAgICAgbGV0IHN5ID0gMDtcbiAgICAgIGxldCBleSA9IGloO1xuICAgICAgbGV0IHB5ID0gaWg7XG4gICAgICB3aGlsZSAocHkgPiBzeSkge1xuICAgICAgICBjb25zdCBhbHBoYSA9IGRhdGFbKHB5IC0gMSkgKiA0ICsgM107XG4gICAgICAgIGlmIChhbHBoYSA9PT0gMCkge1xuICAgICAgICAgIGV5ID0gcHk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3kgPSBweTtcbiAgICAgICAgfVxuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYml0d2lzZVxuICAgICAgICBweSA9IChleSArIHN5KSA+PiAxO1xuICAgICAgfVxuICAgICAgY29uc3QgcmF0aW8gPSBweSAvIGloO1xuICAgICAgcmV0dXJuIHJhdGlvID09PSAwID8gMSA6IHJhdGlvO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldERhdGFVcmlNaW1lVHlwZShkYXRhVXJpOiBzdHJpbmcpIHtcbiAgICAvLyBHZXQgYSBzdWJzdHJpbmcgYmVjYXVzZSB0aGUgcmVnZXggZG9lcyBub3QgcGVyZm9ybSB3ZWxsIG9uIHZlcnkgbGFyZ2Ugc3RyaW5ncy5cbiAgICAvLyBDYXRlciBmb3Igb3B0aW9uYWwgY2hhcnNldC4gTGVuZ3RoIDUwIHNob291bGQgYmUgZW5vdWdoLlxuICAgIGNvbnN0IGRhdGFVcmlTdWJzdHJpbmcgPSBkYXRhVXJpLnN1YnN0cmluZygwLCA1MCk7XG4gICAgbGV0IG1pbWVUeXBlID0gJ2ltYWdlL3BuZyc7XG4gICAgLy8gZGF0YS11cmkgc2NoZW1lXG4gICAgLy8gZGF0YTpbPG1lZGlhIHR5cGU+XVs7Y2hhcnNldD08Y2hhcmFjdGVyIHNldD5dWztiYXNlNjRdLDxkYXRhPlxuICAgIGNvbnN0IHJlZ0V4ID0gUmVnRXhwKFxuICAgICAgL14oZGF0YTopKFtcXHdcXC9cXCtdKyk7KGNoYXJzZXQ9W1xcdy1dK3xiYXNlNjQpLiosKC4qKS9naVxuICAgICk7XG4gICAgY29uc3QgbWF0Y2hlcyA9IHJlZ0V4LmV4ZWMoZGF0YVVyaVN1YnN0cmluZyk7XG4gICAgaWYgKG1hdGNoZXMgJiYgbWF0Y2hlc1syXSkge1xuICAgICAgbWltZVR5cGUgPSBtYXRjaGVzWzJdO1xuICAgICAgaWYgKG1pbWVUeXBlID09PSAnaW1hZ2UvanBnJykge1xuICAgICAgICBtaW1lVHlwZSA9ICdpbWFnZS9qcGVnJztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1pbWVUeXBlO1xuICB9XG5cbiAgcHVibGljIHByZXBhcmUoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCkge1xuICAgIHRoaXMuYnVmZmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdGhpcy5jcm9wQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG5cbiAgICAvLyB0b2RvIGdldCBtb3JlIHJlbGlhYmxlIHBhcmVudCB3aWR0aCB2YWx1ZS5cbiAgICBjb25zdCByZXNwb25zaXZlV2lkdGg6IG51bWJlciA9IGNhbnZhcy5wYXJlbnRFbGVtZW50XG4gICAgICA/IGNhbnZhcy5wYXJlbnRFbGVtZW50LmNsaWVudFdpZHRoXG4gICAgICA6IDA7XG4gICAgaWYgKHJlc3BvbnNpdmVXaWR0aCA+IDAgJiYgdGhpcy5jcm9wcGVyU2V0dGluZ3MuZHluYW1pY1NpemluZykge1xuICAgICAgdGhpcy5jcm9wQ2FudmFzLndpZHRoID0gcmVzcG9uc2l2ZVdpZHRoO1xuICAgICAgdGhpcy5idWZmZXIud2lkdGggPSByZXNwb25zaXZlV2lkdGg7XG4gICAgICBjYW52YXMud2lkdGggPSByZXNwb25zaXZlV2lkdGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY3JvcENhbnZhcy53aWR0aCA9IHRoaXMuY3JvcFdpZHRoO1xuICAgICAgdGhpcy5idWZmZXIud2lkdGggPSBjYW52YXMud2lkdGg7XG4gICAgfVxuXG4gICAgdGhpcy5jcm9wQ2FudmFzLmhlaWdodCA9IHRoaXMuY3JvcEhlaWdodDtcbiAgICB0aGlzLmJ1ZmZlci5oZWlnaHQgPSBjYW52YXMuaGVpZ2h0O1xuICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xuICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKSBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG5cbiAgICB0aGlzLmRyYXcodGhpcy5jdHgpO1xuICB9XG5cbiAgcHVibGljIHVwZGF0ZVNldHRpbmdzKGNyb3BwZXJTZXR0aW5nczogQ3JvcHBlclNldHRpbmdzKSB7XG4gICAgdGhpcy5jcm9wcGVyU2V0dGluZ3MgPSBjcm9wcGVyU2V0dGluZ3M7XG4gIH1cblxuICBwdWJsaWMgcmVzaXplQ2FudmFzKFxuICAgIHdpZHRoOiBudW1iZXIsXG4gICAgaGVpZ2h0OiBudW1iZXIsXG4gICAgc2V0SW1hZ2U6IGJvb2xlYW4gPSBmYWxzZVxuICApOiB2b2lkIHtcbiAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMuY3JvcENhbnZhcy53aWR0aCA9IHRoaXMud2lkdGggPSB0aGlzLmNhbnZhc1dpZHRoID0gdGhpcy5idWZmZXIud2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLmNyb3BDYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQgPSB0aGlzLmNhbnZhc0hlaWdodCA9IHRoaXMuYnVmZmVyLmhlaWdodCA9IGhlaWdodDtcbiAgICBpZiAoc2V0SW1hZ2UpIHtcbiAgICAgIHRoaXMuc2V0SW1hZ2UodGhpcy5zcmNJbWFnZSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHJlc2V0KCk6IHZvaWQge1xuICAgIHRoaXMuc2V0SW1hZ2UodW5kZWZpbmVkKTtcbiAgfVxuXG4gIHB1YmxpYyBkcmF3KGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTogdm9pZCB7XG4gICAgY29uc3QgYm91bmRzOiBCb3VuZHMgPSB0aGlzLmdldEJvdW5kcygpO1xuICAgIGlmICh0aGlzLnNyY0ltYWdlKSB7XG4gICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMuY2FudmFzV2lkdGgsIHRoaXMuY2FudmFzSGVpZ2h0KTtcbiAgICAgIGNvbnN0IHNvdXJjZUFzcGVjdDogbnVtYmVyID0gdGhpcy5zcmNJbWFnZS5oZWlnaHQgLyB0aGlzLnNyY0ltYWdlLndpZHRoO1xuICAgICAgY29uc3QgY2FudmFzQXNwZWN0OiBudW1iZXIgPSB0aGlzLmNhbnZhc0hlaWdodCAvIHRoaXMuY2FudmFzV2lkdGg7XG4gICAgICBsZXQgdzogbnVtYmVyID0gdGhpcy5jYW52YXNXaWR0aDtcbiAgICAgIGxldCBoOiBudW1iZXIgPSB0aGlzLmNhbnZhc0hlaWdodDtcbiAgICAgIGlmIChjYW52YXNBc3BlY3QgPiBzb3VyY2VBc3BlY3QpIHtcbiAgICAgICAgdyA9IHRoaXMuY2FudmFzV2lkdGg7XG4gICAgICAgIGggPSB0aGlzLmNhbnZhc1dpZHRoICogc291cmNlQXNwZWN0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaCA9IHRoaXMuY2FudmFzSGVpZ2h0O1xuICAgICAgICB3ID0gdGhpcy5jYW52YXNIZWlnaHQgLyBzb3VyY2VBc3BlY3Q7XG4gICAgICB9XG4gICAgICB0aGlzLnJhdGlvVyA9IHcgLyB0aGlzLnNyY0ltYWdlLndpZHRoO1xuICAgICAgdGhpcy5yYXRpb0ggPSBoIC8gdGhpcy5zcmNJbWFnZS5oZWlnaHQ7XG4gICAgICBpZiAoY2FudmFzQXNwZWN0IDwgc291cmNlQXNwZWN0KSB7XG4gICAgICAgIHRoaXMuZHJhd0ltYWdlSU9TRml4KFxuICAgICAgICAgIGN0eCxcbiAgICAgICAgICB0aGlzLnNyY0ltYWdlLFxuICAgICAgICAgIDAsXG4gICAgICAgICAgMCxcbiAgICAgICAgICB0aGlzLnNyY0ltYWdlLndpZHRoLFxuICAgICAgICAgIHRoaXMuc3JjSW1hZ2UuaGVpZ2h0LFxuICAgICAgICAgIHRoaXMuYnVmZmVyLndpZHRoIC8gMiAtIHcgLyAyLFxuICAgICAgICAgIDAsXG4gICAgICAgICAgdyxcbiAgICAgICAgICBoXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRyYXdJbWFnZUlPU0ZpeChcbiAgICAgICAgICBjdHgsXG4gICAgICAgICAgdGhpcy5zcmNJbWFnZSxcbiAgICAgICAgICAwLFxuICAgICAgICAgIDAsXG4gICAgICAgICAgdGhpcy5zcmNJbWFnZS53aWR0aCxcbiAgICAgICAgICB0aGlzLnNyY0ltYWdlLmhlaWdodCxcbiAgICAgICAgICAwLFxuICAgICAgICAgIHRoaXMuYnVmZmVyLmhlaWdodCAvIDIgLSBoIC8gMixcbiAgICAgICAgICB3LFxuICAgICAgICAgIGhcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgICh0aGlzLmJ1ZmZlci5nZXRDb250ZXh0KCcyZCcpIGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkuZHJhd0ltYWdlKFxuICAgICAgICB0aGlzLmNhbnZhcyxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgdGhpcy5jYW52YXNXaWR0aCxcbiAgICAgICAgdGhpcy5jYW52YXNIZWlnaHRcbiAgICAgICk7XG5cbiAgICAgIGN0eC5saW5lV2lkdGggPSB0aGlzLmNyb3BwZXJTZXR0aW5ncy5jcm9wcGVyRHJhd1NldHRpbmdzLnN0cm9rZVdpZHRoO1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5jcm9wcGVyU2V0dGluZ3MuY3JvcHBlckRyYXdTZXR0aW5ncy5zdHJva2VDb2xvcjtcblxuICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuY3JvcHBlclNldHRpbmdzLmNyb3BwZXJEcmF3U2V0dGluZ3MuYmFja2dyb3VuZEZpbGxDb2xvcjtcbiAgICAgIGlmICghdGhpcy5jcm9wcGVyU2V0dGluZ3Mucm91bmRlZCkge1xuICAgICAgICBjdHguZmlsbFJlY3QoMCwgMCwgdGhpcy5jYW52YXNXaWR0aCwgdGhpcy5jYW52YXNIZWlnaHQpO1xuICAgICAgICBjdHguZHJhd0ltYWdlKFxuICAgICAgICAgIHRoaXMuYnVmZmVyLFxuICAgICAgICAgIGJvdW5kcy5sZWZ0LFxuICAgICAgICAgIGJvdW5kcy50b3AsXG4gICAgICAgICAgTWF0aC5tYXgoYm91bmRzLndpZHRoLCAxKSxcbiAgICAgICAgICBNYXRoLm1heChib3VuZHMuaGVpZ2h0LCAxKSxcbiAgICAgICAgICBib3VuZHMubGVmdCxcbiAgICAgICAgICBib3VuZHMudG9wLFxuICAgICAgICAgIGJvdW5kcy53aWR0aCxcbiAgICAgICAgICBib3VuZHMuaGVpZ2h0XG4gICAgICAgICk7XG4gICAgICAgIGN0eC5zdHJva2VSZWN0KGJvdW5kcy5sZWZ0LCBib3VuZHMudG9wLCBib3VuZHMud2lkdGgsIGJvdW5kcy5oZWlnaHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuICAgICAgICBjdHguc2F2ZSgpO1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGN0eC5hcmMoXG4gICAgICAgICAgYm91bmRzLmxlZnQgKyBib3VuZHMud2lkdGggLyAyLFxuICAgICAgICAgIGJvdW5kcy50b3AgKyBib3VuZHMuaGVpZ2h0IC8gMixcbiAgICAgICAgICBib3VuZHMud2lkdGggLyAyLFxuICAgICAgICAgIDAsXG4gICAgICAgICAgMiAqIE1hdGguUElcbiAgICAgICAgKTtcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICBjdHguY2xpcCgpO1xuICAgICAgICBpZiAoY2FudmFzQXNwZWN0IDwgc291cmNlQXNwZWN0KSB7XG4gICAgICAgICAgdGhpcy5kcmF3SW1hZ2VJT1NGaXgoXG4gICAgICAgICAgICBjdHgsXG4gICAgICAgICAgICB0aGlzLnNyY0ltYWdlLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICB0aGlzLnNyY0ltYWdlLndpZHRoLFxuICAgICAgICAgICAgdGhpcy5zcmNJbWFnZS5oZWlnaHQsXG4gICAgICAgICAgICB0aGlzLmJ1ZmZlci53aWR0aCAvIDIgLSB3IC8gMixcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICB3LFxuICAgICAgICAgICAgaFxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5kcmF3SW1hZ2VJT1NGaXgoXG4gICAgICAgICAgICBjdHgsXG4gICAgICAgICAgICB0aGlzLnNyY0ltYWdlLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICB0aGlzLnNyY0ltYWdlLndpZHRoLFxuICAgICAgICAgICAgdGhpcy5zcmNJbWFnZS5oZWlnaHQsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgdGhpcy5idWZmZXIuaGVpZ2h0IC8gMiAtIGggLyAyLFxuICAgICAgICAgICAgdyxcbiAgICAgICAgICAgIGhcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgICB9XG5cbiAgICAgIGxldCBtYXJrZXI6IENvcm5lck1hcmtlcjtcblxuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnByZWZlci1mb3Itb2ZcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5tYXJrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG1hcmtlciA9IHRoaXMubWFya2Vyc1tpXTtcbiAgICAgICAgbWFya2VyLmRyYXcoY3R4KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY2VudGVyLmRyYXcoY3R4KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2JhKDE5MiwxOTIsMTkyLDEpJztcbiAgICAgIGN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZHJhZ0NlbnRlcih4OiBudW1iZXIsIHk6IG51bWJlciwgbWFya2VyOiBEcmFnTWFya2VyKSB7XG4gICAgY29uc3QgYm91bmRzID0gdGhpcy5nZXRCb3VuZHMoKTtcbiAgICBjb25zdCBsZWZ0ID0geCAtIGJvdW5kcy53aWR0aCAvIDI7XG4gICAgY29uc3QgcmlnaHQgPSB4ICsgYm91bmRzLndpZHRoIC8gMjtcbiAgICBjb25zdCB0b3AgPSB5IC0gYm91bmRzLmhlaWdodCAvIDI7XG4gICAgY29uc3QgYm90dG9tID0geSArIGJvdW5kcy5oZWlnaHQgLyAyO1xuICAgIGlmIChyaWdodCA+PSB0aGlzLm1heFhDbGFtcCkge1xuICAgICAgeCA9IHRoaXMubWF4WENsYW1wIC0gYm91bmRzLndpZHRoIC8gMjtcbiAgICB9XG4gICAgaWYgKGxlZnQgPD0gdGhpcy5taW5YQ2xhbXApIHtcbiAgICAgIHggPSBib3VuZHMud2lkdGggLyAyICsgdGhpcy5taW5YQ2xhbXA7XG4gICAgfVxuICAgIGlmICh0b3AgPCB0aGlzLm1pbllDbGFtcCkge1xuICAgICAgeSA9IGJvdW5kcy5oZWlnaHQgLyAyICsgdGhpcy5taW5ZQ2xhbXA7XG4gICAgfVxuICAgIGlmIChib3R0b20gPj0gdGhpcy5tYXhZQ2xhbXApIHtcbiAgICAgIHkgPSB0aGlzLm1heFlDbGFtcCAtIGJvdW5kcy5oZWlnaHQgLyAyO1xuICAgIH1cbiAgICB0aGlzLnRsLm1vdmVYKHggLSBib3VuZHMud2lkdGggLyAyKTtcbiAgICB0aGlzLnRsLm1vdmVZKHkgLSBib3VuZHMuaGVpZ2h0IC8gMik7XG4gICAgdGhpcy50ci5tb3ZlWCh4ICsgYm91bmRzLndpZHRoIC8gMik7XG4gICAgdGhpcy50ci5tb3ZlWSh5IC0gYm91bmRzLmhlaWdodCAvIDIpO1xuICAgIHRoaXMuYmwubW92ZVgoeCAtIGJvdW5kcy53aWR0aCAvIDIpO1xuICAgIHRoaXMuYmwubW92ZVkoeSArIGJvdW5kcy5oZWlnaHQgLyAyKTtcbiAgICB0aGlzLmJyLm1vdmVYKHggKyBib3VuZHMud2lkdGggLyAyKTtcbiAgICB0aGlzLmJyLm1vdmVZKHkgKyBib3VuZHMuaGVpZ2h0IC8gMik7XG4gICAgbWFya2VyLnNldFBvc2l0aW9uKHgsIHkpO1xuICB9XG5cbiAgcHVibGljIGVuZm9yY2VNaW5TaXplKHg6IG51bWJlciwgeTogbnVtYmVyLCBtYXJrZXI6IENvcm5lck1hcmtlcikge1xuICAgIGNvbnN0IHhMZW5ndGggPSB4IC0gbWFya2VyLmdldEhvcml6b250YWxOZWlnaGJvdXIoKS5wb3NpdGlvbi54O1xuICAgIGNvbnN0IHlMZW5ndGggPSB5IC0gbWFya2VyLmdldFZlcnRpY2FsTmVpZ2hib3VyKCkucG9zaXRpb24ueTtcbiAgICBjb25zdCB4T3ZlciA9IHRoaXMubWluV2lkdGggLSBNYXRoLmFicyh4TGVuZ3RoKTtcbiAgICBjb25zdCB5T3ZlciA9IHRoaXMubWluSGVpZ2h0IC0gTWF0aC5hYnMoeUxlbmd0aCk7XG5cbiAgICBpZiAoeExlbmd0aCA9PT0gMCB8fCB5TGVuZ3RoID09PSAwKSB7XG4gICAgICB4ID0gbWFya2VyLnBvc2l0aW9uLng7XG4gICAgICB5ID0gbWFya2VyLnBvc2l0aW9uLnk7XG5cbiAgICAgIHJldHVybiBuZXcgUG9pbnRQb29sKCkuaW5zdGFuY2UuYm9ycm93KHgsIHkpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmtlZXBBc3BlY3QpIHtcbiAgICAgIGlmICh4T3ZlciA+IDAgJiYgeU92ZXIgLyB0aGlzLmFzcGVjdFJhdGlvID4gMCkge1xuICAgICAgICBpZiAoeE92ZXIgPiB5T3ZlciAvIHRoaXMuYXNwZWN0UmF0aW8pIHtcbiAgICAgICAgICBpZiAoeExlbmd0aCA8IDApIHtcbiAgICAgICAgICAgIHggLT0geE92ZXI7XG5cbiAgICAgICAgICAgIGlmICh5TGVuZ3RoIDwgMCkge1xuICAgICAgICAgICAgICB5IC09IHhPdmVyICogdGhpcy5hc3BlY3RSYXRpbztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHkgKz0geE92ZXIgKiB0aGlzLmFzcGVjdFJhdGlvO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB4ICs9IHhPdmVyO1xuICAgICAgICAgICAgaWYgKHlMZW5ndGggPCAwKSB7XG4gICAgICAgICAgICAgIHkgLT0geE92ZXIgKiB0aGlzLmFzcGVjdFJhdGlvO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgeSArPSB4T3ZlciAqIHRoaXMuYXNwZWN0UmF0aW87XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh5TGVuZ3RoIDwgMCkge1xuICAgICAgICAgICAgeSAtPSB5T3ZlcjtcblxuICAgICAgICAgICAgaWYgKHhMZW5ndGggPCAwKSB7XG4gICAgICAgICAgICAgIHggLT0geU92ZXIgLyB0aGlzLmFzcGVjdFJhdGlvO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgeCArPSB5T3ZlciAvIHRoaXMuYXNwZWN0UmF0aW87XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHkgKz0geU92ZXI7XG4gICAgICAgICAgICBpZiAoeExlbmd0aCA8IDApIHtcbiAgICAgICAgICAgICAgeCAtPSB5T3ZlciAvIHRoaXMuYXNwZWN0UmF0aW87XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB4ICs9IHlPdmVyIC8gdGhpcy5hc3BlY3RSYXRpbztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh4T3ZlciA+IDApIHtcbiAgICAgICAgICBpZiAoeExlbmd0aCA8IDApIHtcbiAgICAgICAgICAgIHggLT0geE92ZXI7XG4gICAgICAgICAgICBpZiAoeUxlbmd0aCA8IDApIHtcbiAgICAgICAgICAgICAgeSAtPSB4T3ZlciAqIHRoaXMuYXNwZWN0UmF0aW87XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB5ICs9IHhPdmVyICogdGhpcy5hc3BlY3RSYXRpbztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgeCArPSB4T3ZlcjtcbiAgICAgICAgICAgIGlmICh5TGVuZ3RoIDwgMCkge1xuICAgICAgICAgICAgICB5IC09IHhPdmVyICogdGhpcy5hc3BlY3RSYXRpbztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHkgKz0geE92ZXIgKiB0aGlzLmFzcGVjdFJhdGlvO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoeU92ZXIgPiAwKSB7XG4gICAgICAgICAgICBpZiAoeUxlbmd0aCA8IDApIHtcbiAgICAgICAgICAgICAgeSAtPSB5T3ZlcjtcblxuICAgICAgICAgICAgICBpZiAoeExlbmd0aCA8IDApIHtcbiAgICAgICAgICAgICAgICB4IC09IHlPdmVyIC8gdGhpcy5hc3BlY3RSYXRpbztcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB4ICs9IHlPdmVyIC8gdGhpcy5hc3BlY3RSYXRpbztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgeSArPSB5T3ZlcjtcbiAgICAgICAgICAgICAgaWYgKHhMZW5ndGggPCAwKSB7XG4gICAgICAgICAgICAgICAgeCAtPSB5T3ZlciAvIHRoaXMuYXNwZWN0UmF0aW87XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgeCArPSB5T3ZlciAvIHRoaXMuYXNwZWN0UmF0aW87XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHhPdmVyID4gMCkge1xuICAgICAgICBpZiAoeExlbmd0aCA8IDApIHtcbiAgICAgICAgICB4IC09IHhPdmVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHggKz0geE92ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh5T3ZlciA+IDApIHtcbiAgICAgICAgaWYgKHlMZW5ndGggPCAwKSB7XG4gICAgICAgICAgeSAtPSB5T3ZlcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB5ICs9IHlPdmVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgeCA8IHRoaXMubWluWENsYW1wIHx8XG4gICAgICB4ID4gdGhpcy5tYXhYQ2xhbXAgfHxcbiAgICAgIHkgPCB0aGlzLm1pbllDbGFtcCB8fFxuICAgICAgeSA+IHRoaXMubWF4WUNsYW1wXG4gICAgKSB7XG4gICAgICB4ID0gbWFya2VyLnBvc2l0aW9uLng7XG4gICAgICB5ID0gbWFya2VyLnBvc2l0aW9uLnk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBQb2ludFBvb2woKS5pbnN0YW5jZS5ib3Jyb3coeCwgeSk7XG4gIH1cblxuICBwdWJsaWMgZHJhZ0Nvcm5lcih4OiBudW1iZXIsIHk6IG51bWJlciwgbWFya2VyOiBDb3JuZXJNYXJrZXIpIHtcbiAgICBsZXQgaVggPSAwO1xuICAgIGxldCBpWSA9IDA7XG4gICAgbGV0IGF4ID0gMDtcbiAgICBsZXQgYXkgPSAwO1xuICAgIGxldCBuZXdIZWlnaHQgPSAwO1xuICAgIGxldCBuZXdXaWR0aCA9IDA7XG4gICAgbGV0IG5ld1kgPSAwO1xuICAgIGxldCBuZXdYID0gMDtcbiAgICBsZXQgYW5jaG9yTWFya2VyOiBDb3JuZXJNYXJrZXI7XG4gICAgbGV0IGZvbGQgPSAwO1xuXG4gICAgaWYgKHRoaXMua2VlcEFzcGVjdCkge1xuICAgICAgYW5jaG9yTWFya2VyID0gbWFya2VyLmdldEhvcml6b250YWxOZWlnaGJvdXIoKS5nZXRWZXJ0aWNhbE5laWdoYm91cigpO1xuICAgICAgYXggPSBhbmNob3JNYXJrZXIucG9zaXRpb24ueDtcbiAgICAgIGF5ID0gYW5jaG9yTWFya2VyLnBvc2l0aW9uLnk7XG4gICAgICBpZiAoeCA8PSBhbmNob3JNYXJrZXIucG9zaXRpb24ueCkge1xuICAgICAgICBpZiAoeSA8PSBhbmNob3JNYXJrZXIucG9zaXRpb24ueSkge1xuICAgICAgICAgIGlYID0gYXggLSAxMDAgLyB0aGlzLmFzcGVjdFJhdGlvO1xuICAgICAgICAgIGlZID0gYXkgLSAoMTAwIC8gdGhpcy5hc3BlY3RSYXRpbykgKiB0aGlzLmFzcGVjdFJhdGlvO1xuICAgICAgICAgIGZvbGQgPSB0aGlzLmdldFNpZGUoXG4gICAgICAgICAgICBuZXcgUG9pbnRQb29sKCkuaW5zdGFuY2UuYm9ycm93KGlYLCBpWSksXG4gICAgICAgICAgICBhbmNob3JNYXJrZXIucG9zaXRpb24sXG4gICAgICAgICAgICBuZXcgUG9pbnRQb29sKCkuaW5zdGFuY2UuYm9ycm93KHgsIHkpXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAoZm9sZCA+IDApIHtcbiAgICAgICAgICAgIG5ld0hlaWdodCA9IE1hdGguYWJzKGFuY2hvck1hcmtlci5wb3NpdGlvbi55IC0geSk7XG4gICAgICAgICAgICBuZXdXaWR0aCA9IG5ld0hlaWdodCAvIHRoaXMuYXNwZWN0UmF0aW87XG4gICAgICAgICAgICBuZXdZID0gYW5jaG9yTWFya2VyLnBvc2l0aW9uLnkgLSBuZXdIZWlnaHQ7XG4gICAgICAgICAgICBuZXdYID0gYW5jaG9yTWFya2VyLnBvc2l0aW9uLnggLSBuZXdXaWR0aDtcbiAgICAgICAgICAgIGNvbnN0IG1pbiA9IHRoaXMuZW5mb3JjZU1pblNpemUobmV3WCwgbmV3WSwgbWFya2VyKTtcbiAgICAgICAgICAgIG1hcmtlci5tb3ZlKG1pbi54LCBtaW4ueSk7XG4gICAgICAgICAgICBuZXcgUG9pbnRQb29sKCkuaW5zdGFuY2UucmV0dXJuUG9pbnQobWluKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGZvbGQgPCAwKSB7XG4gICAgICAgICAgICAgIG5ld1dpZHRoID0gTWF0aC5hYnMoYW5jaG9yTWFya2VyLnBvc2l0aW9uLnggLSB4KTtcbiAgICAgICAgICAgICAgbmV3SGVpZ2h0ID0gbmV3V2lkdGggKiB0aGlzLmFzcGVjdFJhdGlvO1xuICAgICAgICAgICAgICBuZXdZID0gYW5jaG9yTWFya2VyLnBvc2l0aW9uLnkgLSBuZXdIZWlnaHQ7XG4gICAgICAgICAgICAgIG5ld1ggPSBhbmNob3JNYXJrZXIucG9zaXRpb24ueCAtIG5ld1dpZHRoO1xuICAgICAgICAgICAgICBjb25zdCBtaW4gPSB0aGlzLmVuZm9yY2VNaW5TaXplKG5ld1gsIG5ld1ksIG1hcmtlcik7XG4gICAgICAgICAgICAgIG1hcmtlci5tb3ZlKG1pbi54LCBtaW4ueSk7XG4gICAgICAgICAgICAgIG5ldyBQb2ludFBvb2woKS5pbnN0YW5jZS5yZXR1cm5Qb2ludChtaW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpWCA9IGF4IC0gMTAwIC8gdGhpcy5hc3BlY3RSYXRpbztcbiAgICAgICAgICBpWSA9IGF5ICsgKDEwMCAvIHRoaXMuYXNwZWN0UmF0aW8pICogdGhpcy5hc3BlY3RSYXRpbztcbiAgICAgICAgICBmb2xkID0gdGhpcy5nZXRTaWRlKFxuICAgICAgICAgICAgbmV3IFBvaW50UG9vbCgpLmluc3RhbmNlLmJvcnJvdyhpWCwgaVkpLFxuICAgICAgICAgICAgYW5jaG9yTWFya2VyLnBvc2l0aW9uLFxuICAgICAgICAgICAgbmV3IFBvaW50UG9vbCgpLmluc3RhbmNlLmJvcnJvdyh4LCB5KVxuICAgICAgICAgICk7XG4gICAgICAgICAgaWYgKGZvbGQgPiAwKSB7XG4gICAgICAgICAgICBuZXdXaWR0aCA9IE1hdGguYWJzKGFuY2hvck1hcmtlci5wb3NpdGlvbi54IC0geCk7XG4gICAgICAgICAgICBuZXdIZWlnaHQgPSBuZXdXaWR0aCAqIHRoaXMuYXNwZWN0UmF0aW87XG4gICAgICAgICAgICBuZXdZID0gYW5jaG9yTWFya2VyLnBvc2l0aW9uLnkgKyBuZXdIZWlnaHQ7XG4gICAgICAgICAgICBuZXdYID0gYW5jaG9yTWFya2VyLnBvc2l0aW9uLnggLSBuZXdXaWR0aDtcbiAgICAgICAgICAgIGNvbnN0IG1pbiA9IHRoaXMuZW5mb3JjZU1pblNpemUobmV3WCwgbmV3WSwgbWFya2VyKTtcbiAgICAgICAgICAgIG1hcmtlci5tb3ZlKG1pbi54LCBtaW4ueSk7XG4gICAgICAgICAgICBuZXcgUG9pbnRQb29sKCkuaW5zdGFuY2UucmV0dXJuUG9pbnQobWluKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGZvbGQgPCAwKSB7XG4gICAgICAgICAgICAgIG5ld0hlaWdodCA9IE1hdGguYWJzKGFuY2hvck1hcmtlci5wb3NpdGlvbi55IC0geSk7XG4gICAgICAgICAgICAgIG5ld1dpZHRoID0gbmV3SGVpZ2h0IC8gdGhpcy5hc3BlY3RSYXRpbztcbiAgICAgICAgICAgICAgbmV3WSA9IGFuY2hvck1hcmtlci5wb3NpdGlvbi55ICsgbmV3SGVpZ2h0O1xuICAgICAgICAgICAgICBuZXdYID0gYW5jaG9yTWFya2VyLnBvc2l0aW9uLnggLSBuZXdXaWR0aDtcbiAgICAgICAgICAgICAgY29uc3QgbWluID0gdGhpcy5lbmZvcmNlTWluU2l6ZShuZXdYLCBuZXdZLCBtYXJrZXIpO1xuICAgICAgICAgICAgICBtYXJrZXIubW92ZShtaW4ueCwgbWluLnkpO1xuICAgICAgICAgICAgICBuZXcgUG9pbnRQb29sKCkuaW5zdGFuY2UucmV0dXJuUG9pbnQobWluKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh5IDw9IGFuY2hvck1hcmtlci5wb3NpdGlvbi55KSB7XG4gICAgICAgICAgaVggPSBheCArIDEwMCAvIHRoaXMuYXNwZWN0UmF0aW87XG4gICAgICAgICAgaVkgPSBheSAtICgxMDAgLyB0aGlzLmFzcGVjdFJhdGlvKSAqIHRoaXMuYXNwZWN0UmF0aW87XG4gICAgICAgICAgZm9sZCA9IHRoaXMuZ2V0U2lkZShcbiAgICAgICAgICAgIG5ldyBQb2ludFBvb2woKS5pbnN0YW5jZS5ib3Jyb3coaVgsIGlZKSxcbiAgICAgICAgICAgIGFuY2hvck1hcmtlci5wb3NpdGlvbixcbiAgICAgICAgICAgIG5ldyBQb2ludFBvb2woKS5pbnN0YW5jZS5ib3Jyb3coeCwgeSlcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmIChmb2xkIDwgMCkge1xuICAgICAgICAgICAgbmV3SGVpZ2h0ID0gTWF0aC5hYnMoYW5jaG9yTWFya2VyLnBvc2l0aW9uLnkgLSB5KTtcbiAgICAgICAgICAgIG5ld1dpZHRoID0gbmV3SGVpZ2h0IC8gdGhpcy5hc3BlY3RSYXRpbztcbiAgICAgICAgICAgIG5ld1kgPSBhbmNob3JNYXJrZXIucG9zaXRpb24ueSAtIG5ld0hlaWdodDtcbiAgICAgICAgICAgIG5ld1ggPSBhbmNob3JNYXJrZXIucG9zaXRpb24ueCArIG5ld1dpZHRoO1xuICAgICAgICAgICAgY29uc3QgbWluID0gdGhpcy5lbmZvcmNlTWluU2l6ZShuZXdYLCBuZXdZLCBtYXJrZXIpO1xuICAgICAgICAgICAgbWFya2VyLm1vdmUobWluLngsIG1pbi55KTtcbiAgICAgICAgICAgIG5ldyBQb2ludFBvb2woKS5pbnN0YW5jZS5yZXR1cm5Qb2ludChtaW4pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZm9sZCA+IDApIHtcbiAgICAgICAgICAgICAgbmV3V2lkdGggPSBNYXRoLmFicyhhbmNob3JNYXJrZXIucG9zaXRpb24ueCAtIHgpO1xuICAgICAgICAgICAgICBuZXdIZWlnaHQgPSBuZXdXaWR0aCAqIHRoaXMuYXNwZWN0UmF0aW87XG4gICAgICAgICAgICAgIG5ld1kgPSBhbmNob3JNYXJrZXIucG9zaXRpb24ueSAtIG5ld0hlaWdodDtcbiAgICAgICAgICAgICAgbmV3WCA9IGFuY2hvck1hcmtlci5wb3NpdGlvbi54ICsgbmV3V2lkdGg7XG4gICAgICAgICAgICAgIGNvbnN0IG1pbiA9IHRoaXMuZW5mb3JjZU1pblNpemUobmV3WCwgbmV3WSwgbWFya2VyKTtcbiAgICAgICAgICAgICAgbWFya2VyLm1vdmUobWluLngsIG1pbi55KTtcbiAgICAgICAgICAgICAgbmV3IFBvaW50UG9vbCgpLmluc3RhbmNlLnJldHVyblBvaW50KG1pbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlYID0gYXggKyAxMDAgLyB0aGlzLmFzcGVjdFJhdGlvO1xuICAgICAgICAgIGlZID0gYXkgKyAoMTAwIC8gdGhpcy5hc3BlY3RSYXRpbykgKiB0aGlzLmFzcGVjdFJhdGlvO1xuICAgICAgICAgIGZvbGQgPSB0aGlzLmdldFNpZGUoXG4gICAgICAgICAgICBuZXcgUG9pbnRQb29sKCkuaW5zdGFuY2UuYm9ycm93KGlYLCBpWSksXG4gICAgICAgICAgICBhbmNob3JNYXJrZXIucG9zaXRpb24sXG4gICAgICAgICAgICBuZXcgUG9pbnRQb29sKCkuaW5zdGFuY2UuYm9ycm93KHgsIHkpXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAoZm9sZCA8IDApIHtcbiAgICAgICAgICAgIG5ld1dpZHRoID0gTWF0aC5hYnMoYW5jaG9yTWFya2VyLnBvc2l0aW9uLnggLSB4KTtcbiAgICAgICAgICAgIG5ld0hlaWdodCA9IG5ld1dpZHRoICogdGhpcy5hc3BlY3RSYXRpbztcbiAgICAgICAgICAgIG5ld1kgPSBhbmNob3JNYXJrZXIucG9zaXRpb24ueSArIG5ld0hlaWdodDtcbiAgICAgICAgICAgIG5ld1ggPSBhbmNob3JNYXJrZXIucG9zaXRpb24ueCArIG5ld1dpZHRoO1xuICAgICAgICAgICAgY29uc3QgbWluID0gdGhpcy5lbmZvcmNlTWluU2l6ZShuZXdYLCBuZXdZLCBtYXJrZXIpO1xuICAgICAgICAgICAgbWFya2VyLm1vdmUobWluLngsIG1pbi55KTtcbiAgICAgICAgICAgIG5ldyBQb2ludFBvb2woKS5pbnN0YW5jZS5yZXR1cm5Qb2ludChtaW4pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZm9sZCA+IDApIHtcbiAgICAgICAgICAgICAgbmV3SGVpZ2h0ID0gTWF0aC5hYnMoYW5jaG9yTWFya2VyLnBvc2l0aW9uLnkgLSB5KTtcbiAgICAgICAgICAgICAgbmV3V2lkdGggPSBuZXdIZWlnaHQgLyB0aGlzLmFzcGVjdFJhdGlvO1xuICAgICAgICAgICAgICBuZXdZID0gYW5jaG9yTWFya2VyLnBvc2l0aW9uLnkgKyBuZXdIZWlnaHQ7XG4gICAgICAgICAgICAgIG5ld1ggPSBhbmNob3JNYXJrZXIucG9zaXRpb24ueCArIG5ld1dpZHRoO1xuICAgICAgICAgICAgICBjb25zdCBtaW4gPSB0aGlzLmVuZm9yY2VNaW5TaXplKG5ld1gsIG5ld1ksIG1hcmtlcik7XG4gICAgICAgICAgICAgIG1hcmtlci5tb3ZlKG1pbi54LCBtaW4ueSk7XG4gICAgICAgICAgICAgIG5ldyBQb2ludFBvb2woKS5pbnN0YW5jZS5yZXR1cm5Qb2ludChtaW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBtaW4gPSB0aGlzLmVuZm9yY2VNaW5TaXplKHgsIHksIG1hcmtlcik7XG4gICAgICBtYXJrZXIubW92ZShtaW4ueCwgbWluLnkpO1xuICAgICAgbmV3IFBvaW50UG9vbCgpLmluc3RhbmNlLnJldHVyblBvaW50KG1pbik7XG4gICAgfVxuICAgIHRoaXMuY2VudGVyLnJlY2FsY3VsYXRlUG9zaXRpb24odGhpcy5nZXRCb3VuZHMoKSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0U2lkZShhOiBQb2ludCwgYjogUG9pbnQsIGM6IFBvaW50KTogbnVtYmVyIHtcbiAgICBjb25zdCBuOiBudW1iZXIgPSB0aGlzLnNpZ24oXG4gICAgICAoYi54IC0gYS54KSAqIChjLnkgLSBhLnkpIC0gKGIueSAtIGEueSkgKiAoYy54IC0gYS54KVxuICAgICk7XG5cbiAgICAvLyBUT0RPIG1vdmUgdGhlIHJldHVybiBvZiB0aGUgcG9vbHMgdG8gb3V0c2lkZSBvZiB0aGlzIGZ1bmN0aW9uXG4gICAgbmV3IFBvaW50UG9vbCgpLmluc3RhbmNlLnJldHVyblBvaW50KGEpO1xuICAgIG5ldyBQb2ludFBvb2woKS5pbnN0YW5jZS5yZXR1cm5Qb2ludChjKTtcbiAgICByZXR1cm4gbjtcbiAgfVxuXG4gIHB1YmxpYyBoYW5kbGVSZWxlYXNlKG5ld0Nyb3BUb3VjaDogQ3JvcFRvdWNoKSB7XG4gICAgaWYgKG5ld0Nyb3BUb3VjaCA9PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBpbmRleCA9IDA7XG4gICAgZm9yIChsZXQgayA9IDA7IGsgPCB0aGlzLmN1cnJlbnREcmFnVG91Y2hlcy5sZW5ndGg7IGsrKykge1xuICAgICAgaWYgKG5ld0Nyb3BUb3VjaC5pZCA9PT0gdGhpcy5jdXJyZW50RHJhZ1RvdWNoZXNba10uaWQpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50RHJhZ1RvdWNoZXNba10uZHJhZ0hhbmRsZS5zZXREcmFnKGZhbHNlKTtcbiAgICAgICAgaW5kZXggPSBrO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmN1cnJlbnREcmFnVG91Y2hlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHRoaXMuZHJhdyh0aGlzLmN0eCk7XG4gIH1cblxuICBwdWJsaWMgaGFuZGxlTW92ZShuZXdDcm9wVG91Y2g6IENyb3BUb3VjaCkge1xuICAgIGxldCBtYXRjaGVkID0gZmFsc2U7XG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnByZWZlci1mb3Itb2ZcbiAgICBmb3IgKGxldCBrID0gMDsgayA8IHRoaXMuY3VycmVudERyYWdUb3VjaGVzLmxlbmd0aDsgaysrKSB7XG4gICAgICBpZiAoXG4gICAgICAgIG5ld0Nyb3BUb3VjaC5pZCA9PT0gdGhpcy5jdXJyZW50RHJhZ1RvdWNoZXNba10uaWQgJiZcbiAgICAgICAgdGhpcy5jdXJyZW50RHJhZ1RvdWNoZXNba10uZHJhZ0hhbmRsZSAhPSBudWxsXG4gICAgICApIHtcbiAgICAgICAgY29uc3QgZHJhZ1RvdWNoOiBDcm9wVG91Y2ggPSB0aGlzLmN1cnJlbnREcmFnVG91Y2hlc1trXTtcbiAgICAgICAgY29uc3QgY2xhbXBlZFBvc2l0aW9ucyA9IHRoaXMuY2xhbXBQb3NpdGlvbihcbiAgICAgICAgICBuZXdDcm9wVG91Y2gueCAtIGRyYWdUb3VjaC5kcmFnSGFuZGxlLm9mZnNldC54LFxuICAgICAgICAgIG5ld0Nyb3BUb3VjaC55IC0gZHJhZ1RvdWNoLmRyYWdIYW5kbGUub2Zmc2V0LnlcbiAgICAgICAgKTtcbiAgICAgICAgbmV3Q3JvcFRvdWNoLnggPSBjbGFtcGVkUG9zaXRpb25zLng7XG4gICAgICAgIG5ld0Nyb3BUb3VjaC55ID0gY2xhbXBlZFBvc2l0aW9ucy55O1xuICAgICAgICBuZXcgUG9pbnRQb29sKCkuaW5zdGFuY2UucmV0dXJuUG9pbnQoY2xhbXBlZFBvc2l0aW9ucyk7XG4gICAgICAgIGlmIChkcmFnVG91Y2guZHJhZ0hhbmRsZSBpbnN0YW5jZW9mIENvcm5lck1hcmtlcikge1xuICAgICAgICAgIHRoaXMuZHJhZ0Nvcm5lcihcbiAgICAgICAgICAgIG5ld0Nyb3BUb3VjaC54LFxuICAgICAgICAgICAgbmV3Q3JvcFRvdWNoLnksXG4gICAgICAgICAgICBkcmFnVG91Y2guZHJhZ0hhbmRsZSBhcyBDb3JuZXJNYXJrZXJcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZHJhZ0NlbnRlcihcbiAgICAgICAgICAgIG5ld0Nyb3BUb3VjaC54LFxuICAgICAgICAgICAgbmV3Q3JvcFRvdWNoLnksXG4gICAgICAgICAgICBkcmFnVG91Y2guZHJhZ0hhbmRsZSBhcyBEcmFnTWFya2VyXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN1cnJlbnRseUludGVyYWN0aW5nID0gdHJ1ZTtcbiAgICAgICAgbWF0Y2hlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuaW1hZ2VDcm9wcGVyRGF0YVNoYXJlLnNldFByZXNzZWQodGhpcy5jYW52YXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFtYXRjaGVkKSB7XG4gICAgICBmb3IgKGNvbnN0IG1hcmtlciBvZiB0aGlzLm1hcmtlcnMpIHtcbiAgICAgICAgaWYgKG1hcmtlci50b3VjaEluQm91bmRzKG5ld0Nyb3BUb3VjaC54LCBuZXdDcm9wVG91Y2gueSkpIHtcbiAgICAgICAgICBuZXdDcm9wVG91Y2guZHJhZ0hhbmRsZSA9IG1hcmtlcjtcbiAgICAgICAgICB0aGlzLmN1cnJlbnREcmFnVG91Y2hlcy5wdXNoKG5ld0Nyb3BUb3VjaCk7XG4gICAgICAgICAgbWFya2VyLnNldERyYWcodHJ1ZSk7XG4gICAgICAgICAgbmV3Q3JvcFRvdWNoLmRyYWdIYW5kbGUub2Zmc2V0LnggPVxuICAgICAgICAgICAgbmV3Q3JvcFRvdWNoLnggLSBuZXdDcm9wVG91Y2guZHJhZ0hhbmRsZS5wb3NpdGlvbi54O1xuICAgICAgICAgIG5ld0Nyb3BUb3VjaC5kcmFnSGFuZGxlLm9mZnNldC55ID1cbiAgICAgICAgICAgIG5ld0Nyb3BUb3VjaC55IC0gbmV3Q3JvcFRvdWNoLmRyYWdIYW5kbGUucG9zaXRpb24ueTtcbiAgICAgICAgICB0aGlzLmRyYWdDb3JuZXIoXG4gICAgICAgICAgICBuZXdDcm9wVG91Y2gueCAtIG5ld0Nyb3BUb3VjaC5kcmFnSGFuZGxlLm9mZnNldC54LFxuICAgICAgICAgICAgbmV3Q3JvcFRvdWNoLnkgLSBuZXdDcm9wVG91Y2guZHJhZ0hhbmRsZS5vZmZzZXQueSxcbiAgICAgICAgICAgIG5ld0Nyb3BUb3VjaC5kcmFnSGFuZGxlIGFzIENvcm5lck1hcmtlclxuICAgICAgICAgICk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChcbiAgICAgICAgbmV3Q3JvcFRvdWNoLmRyYWdIYW5kbGUgPT09IG51bGwgfHxcbiAgICAgICAgdHlwZW9mIG5ld0Nyb3BUb3VjaC5kcmFnSGFuZGxlID09PSAndW5kZWZpbmVkJ1xuICAgICAgKSB7XG4gICAgICAgIGlmICh0aGlzLmNlbnRlci50b3VjaEluQm91bmRzKG5ld0Nyb3BUb3VjaC54LCBuZXdDcm9wVG91Y2gueSkpIHtcbiAgICAgICAgICBuZXdDcm9wVG91Y2guZHJhZ0hhbmRsZSA9IHRoaXMuY2VudGVyO1xuICAgICAgICAgIHRoaXMuY3VycmVudERyYWdUb3VjaGVzLnB1c2gobmV3Q3JvcFRvdWNoKTtcbiAgICAgICAgICBuZXdDcm9wVG91Y2guZHJhZ0hhbmRsZS5zZXREcmFnKHRydWUpO1xuICAgICAgICAgIG5ld0Nyb3BUb3VjaC5kcmFnSGFuZGxlLm9mZnNldC54ID1cbiAgICAgICAgICAgIG5ld0Nyb3BUb3VjaC54IC0gbmV3Q3JvcFRvdWNoLmRyYWdIYW5kbGUucG9zaXRpb24ueDtcbiAgICAgICAgICBuZXdDcm9wVG91Y2guZHJhZ0hhbmRsZS5vZmZzZXQueSA9XG4gICAgICAgICAgICBuZXdDcm9wVG91Y2gueSAtIG5ld0Nyb3BUb3VjaC5kcmFnSGFuZGxlLnBvc2l0aW9uLnk7XG4gICAgICAgICAgdGhpcy5kcmFnQ2VudGVyKFxuICAgICAgICAgICAgbmV3Q3JvcFRvdWNoLnggLSBuZXdDcm9wVG91Y2guZHJhZ0hhbmRsZS5vZmZzZXQueCxcbiAgICAgICAgICAgIG5ld0Nyb3BUb3VjaC55IC0gbmV3Q3JvcFRvdWNoLmRyYWdIYW5kbGUub2Zmc2V0LnksXG4gICAgICAgICAgICBuZXdDcm9wVG91Y2guZHJhZ0hhbmRsZSBhcyBEcmFnTWFya2VyXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGVDbGFtcEJvdW5kcygpIHtcbiAgICBjb25zdCBzb3VyY2VBc3BlY3QgPSB0aGlzLnNyY0ltYWdlLmhlaWdodCAvIHRoaXMuc3JjSW1hZ2Uud2lkdGg7XG4gICAgY29uc3QgY2FudmFzQXNwZWN0ID0gdGhpcy5jYW52YXMuaGVpZ2h0IC8gdGhpcy5jYW52YXMud2lkdGg7XG4gICAgbGV0IHcgPSB0aGlzLmNhbnZhcy53aWR0aDtcbiAgICBsZXQgaCA9IHRoaXMuY2FudmFzLmhlaWdodDtcbiAgICBpZiAoY2FudmFzQXNwZWN0ID4gc291cmNlQXNwZWN0KSB7XG4gICAgICB3ID0gdGhpcy5jYW52YXMud2lkdGg7XG4gICAgICBoID0gdGhpcy5jYW52YXMud2lkdGggKiBzb3VyY2VBc3BlY3Q7XG4gICAgfSBlbHNlIHtcbiAgICAgIGggPSB0aGlzLmNhbnZhcy5oZWlnaHQ7XG4gICAgICB3ID0gdGhpcy5jYW52YXMuaGVpZ2h0IC8gc291cmNlQXNwZWN0O1xuICAgIH1cbiAgICB0aGlzLm1pblhDbGFtcCA9IHRoaXMuY2FudmFzLndpZHRoIC8gMiAtIHcgLyAyO1xuICAgIHRoaXMubWluWUNsYW1wID0gdGhpcy5jYW52YXMuaGVpZ2h0IC8gMiAtIGggLyAyO1xuICAgIHRoaXMubWF4WENsYW1wID0gdGhpcy5jYW52YXMud2lkdGggLyAyICsgdyAvIDI7XG4gICAgdGhpcy5tYXhZQ2xhbXAgPSB0aGlzLmNhbnZhcy5oZWlnaHQgLyAyICsgaCAvIDI7XG4gIH1cblxuICBwdWJsaWMgZ2V0Q3JvcEJvdW5kcygpIHtcbiAgICBjb25zdCBib3VuZHMgPSB0aGlzLmdldEJvdW5kcygpO1xuICAgIGJvdW5kcy50b3AgPSBNYXRoLnJvdW5kKChib3VuZHMudG9wIC0gdGhpcy5taW5ZQ2xhbXApIC8gdGhpcy5yYXRpb0gpO1xuICAgIGJvdW5kcy5ib3R0b20gPSBNYXRoLnJvdW5kKChib3VuZHMuYm90dG9tIC0gdGhpcy5taW5ZQ2xhbXApIC8gdGhpcy5yYXRpb0gpO1xuICAgIGJvdW5kcy5sZWZ0ID0gTWF0aC5yb3VuZCgoYm91bmRzLmxlZnQgLSB0aGlzLm1pblhDbGFtcCkgLyB0aGlzLnJhdGlvVyk7XG4gICAgYm91bmRzLnJpZ2h0ID0gTWF0aC5yb3VuZCgoYm91bmRzLnJpZ2h0IC0gdGhpcy5taW5YQ2xhbXApIC8gdGhpcy5yYXRpb1cpO1xuICAgIHJldHVybiBib3VuZHM7XG4gIH1cblxuICBwdWJsaWMgY2xhbXBQb3NpdGlvbih4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgIGlmICh4IDwgdGhpcy5taW5YQ2xhbXApIHtcbiAgICAgIHggPSB0aGlzLm1pblhDbGFtcDtcbiAgICB9XG4gICAgaWYgKHggPiB0aGlzLm1heFhDbGFtcCkge1xuICAgICAgeCA9IHRoaXMubWF4WENsYW1wO1xuICAgIH1cbiAgICBpZiAoeSA8IHRoaXMubWluWUNsYW1wKSB7XG4gICAgICB5ID0gdGhpcy5taW5ZQ2xhbXA7XG4gICAgfVxuICAgIGlmICh5ID4gdGhpcy5tYXhZQ2xhbXApIHtcbiAgICAgIHkgPSB0aGlzLm1heFlDbGFtcDtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQb2ludFBvb2woKS5pbnN0YW5jZS5ib3Jyb3coeCwgeSk7XG4gIH1cblxuICBwdWJsaWMgaXNJbWFnZVNldCgpIHtcbiAgICByZXR1cm4gdGhpcy5pbWFnZVNldDtcbiAgfVxuXG4gIHB1YmxpYyBzZXRJbWFnZShpbWc6IGFueSkge1xuICAgIHRoaXMuc3JjSW1hZ2UgPSBpbWc7XG4gICAgaWYgKCFpbWcpIHtcbiAgICAgIHRoaXMuaW1hZ2VTZXQgPSBmYWxzZTtcbiAgICAgIHRoaXMuZHJhdyh0aGlzLmN0eCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaW1hZ2VTZXQgPSB0cnVlO1xuICAgICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuICAgICAgY29uc3QgYnVmZmVyQ29udGV4dCA9IHRoaXMuYnVmZmVyLmdldENvbnRleHQoXG4gICAgICAgICcyZCdcbiAgICAgICkgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICAgICAgYnVmZmVyQ29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy5idWZmZXIud2lkdGgsIHRoaXMuYnVmZmVyLmhlaWdodCk7XG5cbiAgICAgIGlmICghdGhpcy5jcm9wcGVyU2V0dGluZ3MuZmlsZVR5cGUpIHtcbiAgICAgICAgdGhpcy5maWxlVHlwZSA9IHRoaXMuZ2V0RGF0YVVyaU1pbWVUeXBlKGltZy5zcmMpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5jcm9wcGVyU2V0dGluZ3MubWluV2l0aFJlbGF0aXZlVG9SZXNvbHV0aW9uKSB7XG4gICAgICAgIHRoaXMubWluV2lkdGggPVxuICAgICAgICAgICh0aGlzLmNhbnZhcy53aWR0aCAqIHRoaXMuY3JvcHBlclNldHRpbmdzLm1pbldpZHRoKSAvXG4gICAgICAgICAgdGhpcy5zcmNJbWFnZS53aWR0aDtcbiAgICAgICAgdGhpcy5taW5IZWlnaHQgPVxuICAgICAgICAgICh0aGlzLmNhbnZhcy5oZWlnaHQgKiB0aGlzLmNyb3BwZXJTZXR0aW5ncy5taW5IZWlnaHQpIC9cbiAgICAgICAgICB0aGlzLnNyY0ltYWdlLmhlaWdodDtcbiAgICAgIH1cblxuICAgICAgdGhpcy51cGRhdGVDbGFtcEJvdW5kcygpO1xuICAgICAgdGhpcy5jYW52YXNXaWR0aCA9IHRoaXMuY2FudmFzLndpZHRoO1xuICAgICAgdGhpcy5jYW52YXNIZWlnaHQgPSB0aGlzLmNhbnZhcy5oZWlnaHQ7XG5cbiAgICAgIGNvbnN0IGNyb3BQb3NpdGlvbjogUG9pbnRbXSA9IHRoaXMuZ2V0Q3JvcFBvc2l0aW9uRnJvbU1hcmtlcnMoKTtcbiAgICAgIHRoaXMuc2V0Q3JvcFBvc2l0aW9uKGNyb3BQb3NpdGlvbik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHVwZGF0ZUNyb3BQb3NpdGlvbihjcm9wQm91bmRzOiBCb3VuZHMpOiB2b2lkIHtcbiAgICBjb25zdCBjcm9wUG9zaXRpb246IFBvaW50W10gPSB0aGlzLmdldENyb3BQb3NpdGlvbkZyb21Cb3VuZHMoY3JvcEJvdW5kcyk7XG4gICAgdGhpcy5zZXRDcm9wUG9zaXRpb24oY3JvcFBvc2l0aW9uKTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0Q3JvcFBvc2l0aW9uKGNyb3BQb3NpdGlvbjogUG9pbnRbXSk6IHZvaWQge1xuICAgIHRoaXMudGwuc2V0UG9zaXRpb24oY3JvcFBvc2l0aW9uWzBdLngsIGNyb3BQb3NpdGlvblswXS55KTtcbiAgICB0aGlzLnRyLnNldFBvc2l0aW9uKGNyb3BQb3NpdGlvblsxXS54LCBjcm9wUG9zaXRpb25bMV0ueSk7XG4gICAgdGhpcy5ibC5zZXRQb3NpdGlvbihjcm9wUG9zaXRpb25bMl0ueCwgY3JvcFBvc2l0aW9uWzJdLnkpO1xuICAgIHRoaXMuYnIuc2V0UG9zaXRpb24oY3JvcFBvc2l0aW9uWzNdLngsIGNyb3BQb3NpdGlvblszXS55KTtcbiAgICB0aGlzLmNlbnRlci5zZXRQb3NpdGlvbihjcm9wUG9zaXRpb25bNF0ueCwgY3JvcFBvc2l0aW9uWzRdLnkpO1xuXG4gICAgZm9yIChjb25zdCBwb3NpdGlvbiBvZiBjcm9wUG9zaXRpb24pIHtcbiAgICAgIG5ldyBQb2ludFBvb2woKS5pbnN0YW5jZS5yZXR1cm5Qb2ludChwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgdGhpcy52ZXJ0U3F1YXNoUmF0aW8gPSB0aGlzLmRldGVjdFZlcnRpY2FsU3F1YXNoKHRoaXMuc3JjSW1hZ2UpO1xuICAgIHRoaXMuZHJhdyh0aGlzLmN0eCk7XG4gICAgdGhpcy5jcm9wcGVkSW1hZ2UgPSB0aGlzLmdldENyb3BwZWRJbWFnZUhlbHBlcihcbiAgICAgIGZhbHNlLFxuICAgICAgdGhpcy5jcm9wV2lkdGgsXG4gICAgICB0aGlzLmNyb3BIZWlnaHRcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRDcm9wUG9zaXRpb25Gcm9tTWFya2VycygpOiBQb2ludFtdIHtcbiAgICBjb25zdCB3OiBudW1iZXIgPSB0aGlzLmNhbnZhcy53aWR0aDtcbiAgICBjb25zdCBoOiBudW1iZXIgPSB0aGlzLmNhbnZhcy5oZWlnaHQ7XG4gICAgbGV0IHRsUG9zOiBQb2ludDtcbiAgICBsZXQgdHJQb3M6IFBvaW50O1xuICAgIGxldCBibFBvczogUG9pbnQ7XG4gICAgbGV0IGJyUG9zOiBQb2ludDtcbiAgICBsZXQgY2VudGVyOiBQb2ludDtcbiAgICBjb25zdCBzb3VyY2VBc3BlY3Q6IG51bWJlciA9IHRoaXMuc3JjSW1hZ2UuaGVpZ2h0IC8gdGhpcy5zcmNJbWFnZS53aWR0aDtcbiAgICBjb25zdCBjcm9wQm91bmRzOiBCb3VuZHMgPSB0aGlzLmdldEJvdW5kcygpO1xuICAgIGNvbnN0IGNyb3BBc3BlY3Q6IG51bWJlciA9IGNyb3BCb3VuZHMuaGVpZ2h0IC8gY3JvcEJvdW5kcy53aWR0aDtcbiAgICBjb25zdCBjWDogbnVtYmVyID0gdGhpcy5jYW52YXMud2lkdGggLyAyO1xuICAgIGNvbnN0IGNZOiBudW1iZXIgPSB0aGlzLmNhbnZhcy5oZWlnaHQgLyAyO1xuXG4gICAgaWYgKGNyb3BBc3BlY3QgPiBzb3VyY2VBc3BlY3QpIHtcbiAgICAgIGNvbnN0IGltYWdlSCA9IE1hdGgubWluKHcgKiBzb3VyY2VBc3BlY3QsIGgpO1xuICAgICAgY29uc3QgY3JvcFcgPSBpbWFnZUggLyBjcm9wQXNwZWN0O1xuICAgICAgdGxQb3MgPSBuZXcgUG9pbnRQb29sKCkuaW5zdGFuY2UuYm9ycm93KGNYIC0gY3JvcFcgLyAyLCBjWSArIGltYWdlSCAvIDIpO1xuICAgICAgdHJQb3MgPSBuZXcgUG9pbnRQb29sKCkuaW5zdGFuY2UuYm9ycm93KGNYICsgY3JvcFcgLyAyLCBjWSArIGltYWdlSCAvIDIpO1xuICAgICAgYmxQb3MgPSBuZXcgUG9pbnRQb29sKCkuaW5zdGFuY2UuYm9ycm93KGNYIC0gY3JvcFcgLyAyLCBjWSAtIGltYWdlSCAvIDIpO1xuICAgICAgYnJQb3MgPSBuZXcgUG9pbnRQb29sKCkuaW5zdGFuY2UuYm9ycm93KGNYICsgY3JvcFcgLyAyLCBjWSAtIGltYWdlSCAvIDIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBpbWFnZVcgPSBNYXRoLm1pbihoIC8gc291cmNlQXNwZWN0LCB3KTtcbiAgICAgIGNvbnN0IGNyb3BIID0gaW1hZ2VXICogY3JvcEFzcGVjdDtcbiAgICAgIHRsUG9zID0gbmV3IFBvaW50UG9vbCgpLmluc3RhbmNlLmJvcnJvdyhjWCAtIGltYWdlVyAvIDIsIGNZICsgY3JvcEggLyAyKTtcbiAgICAgIHRyUG9zID0gbmV3IFBvaW50UG9vbCgpLmluc3RhbmNlLmJvcnJvdyhjWCArIGltYWdlVyAvIDIsIGNZICsgY3JvcEggLyAyKTtcbiAgICAgIGJsUG9zID0gbmV3IFBvaW50UG9vbCgpLmluc3RhbmNlLmJvcnJvdyhjWCAtIGltYWdlVyAvIDIsIGNZIC0gY3JvcEggLyAyKTtcbiAgICAgIGJyUG9zID0gbmV3IFBvaW50UG9vbCgpLmluc3RhbmNlLmJvcnJvdyhjWCArIGltYWdlVyAvIDIsIGNZIC0gY3JvcEggLyAyKTtcbiAgICB9XG5cbiAgICBjZW50ZXIgPSBuZXcgUG9pbnRQb29sKCkuaW5zdGFuY2UuYm9ycm93KGNYLCBjWSk7XG4gICAgY29uc3QgcG9zaXRpb25zOiBQb2ludFtdID0gW3RsUG9zLCB0clBvcywgYmxQb3MsIGJyUG9zLCBjZW50ZXJdO1xuICAgIHJldHVybiBwb3NpdGlvbnM7XG4gIH1cblxuICBwcml2YXRlIGdldENyb3BQb3NpdGlvbkZyb21Cb3VuZHMoY3JvcFBvc2l0aW9uOiBCb3VuZHMpOiBQb2ludFtdIHtcbiAgICBsZXQgbWFyZ2luVG9wID0gMDtcbiAgICBsZXQgbWFyZ2luTGVmdCA9IDA7XG4gICAgY29uc3QgY2FudmFzQXNwZWN0OiBudW1iZXIgPSB0aGlzLmNhbnZhc0hlaWdodCAvIHRoaXMuY2FudmFzV2lkdGg7XG4gICAgY29uc3Qgc291cmNlQXNwZWN0OiBudW1iZXIgPSB0aGlzLnNyY0ltYWdlLmhlaWdodCAvIHRoaXMuc3JjSW1hZ2Uud2lkdGg7XG5cbiAgICBpZiAoY2FudmFzQXNwZWN0ID4gc291cmNlQXNwZWN0KSB7XG4gICAgICBtYXJnaW5Ub3AgPVxuICAgICAgICB0aGlzLmJ1ZmZlci5oZWlnaHQgLyAyIC0gKHRoaXMuY2FudmFzV2lkdGggKiBzb3VyY2VBc3BlY3QpIC8gMjtcbiAgICB9IGVsc2Uge1xuICAgICAgbWFyZ2luTGVmdCA9IHRoaXMuYnVmZmVyLndpZHRoIC8gMiAtIHRoaXMuY2FudmFzSGVpZ2h0IC8gc291cmNlQXNwZWN0IC8gMjtcbiAgICB9XG5cbiAgICBjb25zdCByYXRpb1c6IG51bWJlciA9XG4gICAgICAodGhpcy5jYW52YXNXaWR0aCAtIG1hcmdpbkxlZnQgKiAyKSAvIHRoaXMuc3JjSW1hZ2Uud2lkdGg7XG4gICAgY29uc3QgcmF0aW9IOiBudW1iZXIgPVxuICAgICAgKHRoaXMuY2FudmFzSGVpZ2h0IC0gbWFyZ2luVG9wICogMikgLyB0aGlzLnNyY0ltYWdlLmhlaWdodDtcblxuICAgIGxldCBhY3R1YWxIOiBudW1iZXIgPSBjcm9wUG9zaXRpb24uaGVpZ2h0ICogcmF0aW9IO1xuICAgIGxldCBhY3R1YWxXOiBudW1iZXIgPSBjcm9wUG9zaXRpb24ud2lkdGggKiByYXRpb1c7XG4gICAgY29uc3QgYWN0dWFsWDogbnVtYmVyID0gY3JvcFBvc2l0aW9uLmxlZnQgKiByYXRpb1cgKyBtYXJnaW5MZWZ0O1xuICAgIGNvbnN0IGFjdHVhbFk6IG51bWJlciA9IGNyb3BQb3NpdGlvbi50b3AgKiByYXRpb0ggKyBtYXJnaW5Ub3A7XG5cbiAgICBpZiAodGhpcy5rZWVwQXNwZWN0KSB7XG4gICAgICBjb25zdCBzY2FsZWRXOiBudW1iZXIgPSBhY3R1YWxIIC8gdGhpcy5hc3BlY3RSYXRpbztcbiAgICAgIGNvbnN0IHNjYWxlZEg6IG51bWJlciA9IGFjdHVhbFcgKiB0aGlzLmFzcGVjdFJhdGlvO1xuXG4gICAgICBpZiAodGhpcy5nZXRDcm9wQm91bmRzKCkuaGVpZ2h0ID09PSBjcm9wUG9zaXRpb24uaGVpZ2h0KSB7XG4gICAgICAgIC8vIG9ubHkgd2lkdGggY2hhbmdlZFxuICAgICAgICBhY3R1YWxIID0gc2NhbGVkSDtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5nZXRDcm9wQm91bmRzKCkud2lkdGggPT09IGNyb3BQb3NpdGlvbi53aWR0aCkge1xuICAgICAgICAvLyBvbmx5IGhlaWdodCBjaGFuZ2VkXG4gICAgICAgIGFjdHVhbFcgPSBzY2FsZWRXO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gaGVpZ2h0IGFuZCB3aWR0aCBjaGFuZ2VkXG4gICAgICAgIGlmIChNYXRoLmFicyhzY2FsZWRIIC0gYWN0dWFsSCkgPCBNYXRoLmFicyhzY2FsZWRXIC0gYWN0dWFsVykpIHtcbiAgICAgICAgICBhY3R1YWxXID0gc2NhbGVkVztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhY3R1YWxIID0gc2NhbGVkSDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHRsUG9zOiBQb2ludCA9IG5ldyBQb2ludFBvb2woKS5pbnN0YW5jZS5ib3Jyb3coXG4gICAgICBhY3R1YWxYLFxuICAgICAgYWN0dWFsWSArIGFjdHVhbEhcbiAgICApO1xuICAgIGNvbnN0IHRyUG9zOiBQb2ludCA9IG5ldyBQb2ludFBvb2woKS5pbnN0YW5jZS5ib3Jyb3coXG4gICAgICBhY3R1YWxYICsgYWN0dWFsVyxcbiAgICAgIGFjdHVhbFkgKyBhY3R1YWxIXG4gICAgKTtcbiAgICBjb25zdCBibFBvczogUG9pbnQgPSBuZXcgUG9pbnRQb29sKCkuaW5zdGFuY2UuYm9ycm93KGFjdHVhbFgsIGFjdHVhbFkpO1xuICAgIGNvbnN0IGJyUG9zOiBQb2ludCA9IG5ldyBQb2ludFBvb2woKS5pbnN0YW5jZS5ib3Jyb3coXG4gICAgICBhY3R1YWxYICsgYWN0dWFsVyxcbiAgICAgIGFjdHVhbFlcbiAgICApO1xuICAgIGNvbnN0IGNlbnRlcjogUG9pbnQgPSBuZXcgUG9pbnRQb29sKCkuaW5zdGFuY2UuYm9ycm93KFxuICAgICAgYWN0dWFsWCArIGFjdHVhbFcgLyAyLFxuICAgICAgYWN0dWFsWSArIGFjdHVhbEggLyAyXG4gICAgKTtcblxuICAgIGNvbnN0IHBvc2l0aW9uczogUG9pbnRbXSA9IFt0bFBvcywgdHJQb3MsIGJsUG9zLCBiclBvcywgY2VudGVyXTtcbiAgICByZXR1cm4gcG9zaXRpb25zO1xuICB9XG5cbiAgcHVibGljIGdldENyb3BwZWRJbWFnZUhlbHBlcihcbiAgICBwcmVzZXJ2ZVNpemU/OiBib29sZWFuLFxuICAgIGZpbGxXaWR0aD86IG51bWJlcixcbiAgICBmaWxsSGVpZ2h0PzogbnVtYmVyXG4gICk6IEhUTUxJbWFnZUVsZW1lbnQge1xuICAgIGlmICh0aGlzLmNyb3BwZXJTZXR0aW5ncy5jcm9wT25SZXNpemUpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldENyb3BwZWRJbWFnZShwcmVzZXJ2ZVNpemUsIGZpbGxXaWR0aCwgZmlsbEhlaWdodCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNyb3BwZWRJbWFnZVxuICAgICAgPyB0aGlzLmNyb3BwZWRJbWFnZVxuICAgICAgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgfVxuXG4gIC8vIHRvZG86IFVudXNlZCBwYXJhbWV0ZXJzP1xuICBwdWJsaWMgZ2V0Q3JvcHBlZEltYWdlKFxuICAgIHByZXNlcnZlU2l6ZT86IGJvb2xlYW4sXG4gICAgZmlsbFdpZHRoPzogbnVtYmVyLFxuICAgIGZpbGxIZWlnaHQ/OiBudW1iZXJcbiAgKTogSFRNTEltYWdlRWxlbWVudCB7XG4gICAgY29uc3QgYm91bmRzOiBCb3VuZHMgPSB0aGlzLmdldEJvdW5kcygpO1xuICAgIGlmICghdGhpcy5zcmNJbWFnZSkge1xuICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBzb3VyY2VBc3BlY3Q6IG51bWJlciA9IHRoaXMuc3JjSW1hZ2UuaGVpZ2h0IC8gdGhpcy5zcmNJbWFnZS53aWR0aDtcbiAgICAgIGNvbnN0IGNhbnZhc0FzcGVjdDogbnVtYmVyID0gdGhpcy5jYW52YXMuaGVpZ2h0IC8gdGhpcy5jYW52YXMud2lkdGg7XG4gICAgICBsZXQgdzogbnVtYmVyID0gdGhpcy5jYW52YXMud2lkdGg7XG4gICAgICBsZXQgaDogbnVtYmVyID0gdGhpcy5jYW52YXMuaGVpZ2h0O1xuICAgICAgaWYgKGNhbnZhc0FzcGVjdCA+IHNvdXJjZUFzcGVjdCkge1xuICAgICAgICB3ID0gdGhpcy5jYW52YXMud2lkdGg7XG4gICAgICAgIGggPSB0aGlzLmNhbnZhcy53aWR0aCAqIHNvdXJjZUFzcGVjdDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChjYW52YXNBc3BlY3QgPCBzb3VyY2VBc3BlY3QpIHtcbiAgICAgICAgICBoID0gdGhpcy5jYW52YXMuaGVpZ2h0O1xuICAgICAgICAgIHcgPSB0aGlzLmNhbnZhcy5oZWlnaHQgLyBzb3VyY2VBc3BlY3Q7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaCA9IHRoaXMuY2FudmFzLmhlaWdodDtcbiAgICAgICAgICB3ID0gdGhpcy5jYW52YXMud2lkdGg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMucmF0aW9XID0gdyAvIHRoaXMuc3JjSW1hZ2Uud2lkdGg7XG4gICAgICB0aGlzLnJhdGlvSCA9IGggLyB0aGlzLnNyY0ltYWdlLmhlaWdodDtcbiAgICAgIGNvbnN0IG9mZnNldEg6IG51bWJlciA9ICh0aGlzLmJ1ZmZlci5oZWlnaHQgLSBoKSAvIDIgLyB0aGlzLnJhdGlvSDtcbiAgICAgIGNvbnN0IG9mZnNldFc6IG51bWJlciA9ICh0aGlzLmJ1ZmZlci53aWR0aCAtIHcpIC8gMiAvIHRoaXMucmF0aW9XO1xuXG4gICAgICBjb25zdCBjdHggPSB0aGlzLmNyb3BDYW52YXMuZ2V0Q29udGV4dCgnMmQnKSBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG5cbiAgICAgIGlmICh0aGlzLmNyb3BwZXJTZXR0aW5ncy5wcmVzZXJ2ZVNpemUgfHwgcHJlc2VydmVTaXplKSB7XG4gICAgICAgIGNvbnN0IHdpZHRoID0gTWF0aC5yb3VuZChcbiAgICAgICAgICBib3VuZHMucmlnaHQgLyB0aGlzLnJhdGlvVyAtIGJvdW5kcy5sZWZ0IC8gdGhpcy5yYXRpb1dcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gTWF0aC5yb3VuZChcbiAgICAgICAgICBib3VuZHMuYm90dG9tIC8gdGhpcy5yYXRpb0ggLSBib3VuZHMudG9wIC8gdGhpcy5yYXRpb0hcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLmNyb3BDYW52YXMud2lkdGggPSB3aWR0aDtcbiAgICAgICAgdGhpcy5jcm9wQ2FudmFzLmhlaWdodCA9IGhlaWdodDtcblxuICAgICAgICB0aGlzLmNyb3BwZXJTZXR0aW5ncy5jcm9wcGVkV2lkdGggPSB0aGlzLmNyb3BDYW52YXMud2lkdGg7XG4gICAgICAgIHRoaXMuY3JvcHBlclNldHRpbmdzLmNyb3BwZWRIZWlnaHQgPSB0aGlzLmNyb3BDYW52YXMuaGVpZ2h0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jcm9wQ2FudmFzLndpZHRoID0gdGhpcy5jcm9wV2lkdGg7XG4gICAgICAgIHRoaXMuY3JvcENhbnZhcy5oZWlnaHQgPSB0aGlzLmNyb3BIZWlnaHQ7XG4gICAgICB9XG5cbiAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jcm9wQ2FudmFzLndpZHRoLCB0aGlzLmNyb3BDYW52YXMuaGVpZ2h0KTtcbiAgICAgIHRoaXMuZHJhd0ltYWdlSU9TRml4KFxuICAgICAgICBjdHgsXG4gICAgICAgIHRoaXMuc3JjSW1hZ2UsXG4gICAgICAgIE1hdGgubWF4KE1hdGgucm91bmQoYm91bmRzLmxlZnQgLyB0aGlzLnJhdGlvVyAtIG9mZnNldFcpLCAwKSxcbiAgICAgICAgTWF0aC5tYXgoTWF0aC5yb3VuZChib3VuZHMudG9wIC8gdGhpcy5yYXRpb0ggLSBvZmZzZXRIKSwgMCksXG4gICAgICAgIE1hdGgubWF4KE1hdGgucm91bmQoYm91bmRzLndpZHRoIC8gdGhpcy5yYXRpb1cpLCAxKSxcbiAgICAgICAgTWF0aC5tYXgoTWF0aC5yb3VuZChib3VuZHMuaGVpZ2h0IC8gdGhpcy5yYXRpb0gpLCAxKSxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgdGhpcy5jcm9wQ2FudmFzLndpZHRoLFxuICAgICAgICB0aGlzLmNyb3BDYW52YXMuaGVpZ2h0XG4gICAgICApO1xuXG4gICAgICBpZiAodGhpcy5jcm9wcGVyU2V0dGluZ3MucmVzYW1wbGVGbikge1xuICAgICAgICB0aGlzLmNyb3BwZXJTZXR0aW5ncy5yZXNhbXBsZUZuKHRoaXMuY3JvcENhbnZhcyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY3JvcHBlZEltYWdlLndpZHRoID0gdGhpcy5jcm9wQ2FudmFzLndpZHRoO1xuICAgICAgdGhpcy5jcm9wcGVkSW1hZ2UuaGVpZ2h0ID0gdGhpcy5jcm9wQ2FudmFzLmhlaWdodDtcbiAgICAgIHRoaXMuY3JvcHBlZEltYWdlLnNyYyA9IHRoaXMuY3JvcENhbnZhcy50b0RhdGFVUkwoXG4gICAgICAgIHRoaXMuZmlsZVR5cGUsXG4gICAgICAgIHRoaXMuY3JvcHBlclNldHRpbmdzLmNvbXByZXNzUmF0aW9cbiAgICAgICk7XG4gICAgICByZXR1cm4gdGhpcy5jcm9wcGVkSW1hZ2U7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdldEJvdW5kcygpOiBCb3VuZHMge1xuICAgIGxldCBtaW5YID0gTnVtYmVyLk1BWF9WQUxVRTtcbiAgICBsZXQgbWluWSA9IE51bWJlci5NQVhfVkFMVUU7XG4gICAgbGV0IG1heFggPSAtTnVtYmVyLk1BWF9WQUxVRTtcbiAgICBsZXQgbWF4WSA9IC1OdW1iZXIuTUFYX1ZBTFVFO1xuICAgIGZvciAoY29uc3QgbWFya2VyIG9mIHRoaXMubWFya2Vycykge1xuICAgICAgaWYgKG1hcmtlci5wb3NpdGlvbi54IDwgbWluWCkge1xuICAgICAgICBtaW5YID0gbWFya2VyLnBvc2l0aW9uLng7XG4gICAgICB9XG4gICAgICBpZiAobWFya2VyLnBvc2l0aW9uLnggPiBtYXhYKSB7XG4gICAgICAgIG1heFggPSBtYXJrZXIucG9zaXRpb24ueDtcbiAgICAgIH1cbiAgICAgIGlmIChtYXJrZXIucG9zaXRpb24ueSA8IG1pblkpIHtcbiAgICAgICAgbWluWSA9IG1hcmtlci5wb3NpdGlvbi55O1xuICAgICAgfVxuICAgICAgaWYgKG1hcmtlci5wb3NpdGlvbi55ID4gbWF4WSkge1xuICAgICAgICBtYXhZID0gbWFya2VyLnBvc2l0aW9uLnk7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGJvdW5kczogQm91bmRzID0gbmV3IEJvdW5kcygpO1xuICAgIGJvdW5kcy5sZWZ0ID0gbWluWDtcbiAgICBib3VuZHMucmlnaHQgPSBtYXhYO1xuICAgIGJvdW5kcy50b3AgPSBtaW5ZO1xuICAgIGJvdW5kcy5ib3R0b20gPSBtYXhZO1xuICAgIHJldHVybiBib3VuZHM7XG4gIH1cblxuICBwdWJsaWMgc2V0Qm91bmRzKGJvdW5kczogYW55KSB7XG4gICAgLy8gY29uc3QgdG9wTGVmdDogQ29ybmVyTWFya2VyO1xuICAgIC8vIGNvbnN0IHRvcFJpZ2h0OiBDb3JuZXJNYXJrZXI7XG4gICAgLy8gY29uc3QgYm90dG9tTGVmdDogQ29ybmVyTWFya2VyO1xuICAgIC8vIGNvbnN0IGJvdHRvbVJpZ2h0OiBDb3JuZXJNYXJrZXI7XG5cbiAgICBjb25zdCBjdXJyZW50Qm91bmRzID0gdGhpcy5nZXRCb3VuZHMoKTtcbiAgICBmb3IgKGNvbnN0IG1hcmtlciBvZiB0aGlzLm1hcmtlcnMpIHtcbiAgICAgIGlmIChtYXJrZXIucG9zaXRpb24ueCA9PT0gY3VycmVudEJvdW5kcy5sZWZ0KSB7XG4gICAgICAgIGlmIChtYXJrZXIucG9zaXRpb24ueSA9PT0gY3VycmVudEJvdW5kcy50b3ApIHtcbiAgICAgICAgICBtYXJrZXIuc2V0UG9zaXRpb24oYm91bmRzLmxlZnQsIGJvdW5kcy50b3ApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1hcmtlci5zZXRQb3NpdGlvbihib3VuZHMubGVmdCwgYm91bmRzLmJvdHRvbSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChtYXJrZXIucG9zaXRpb24ueSA9PT0gY3VycmVudEJvdW5kcy50b3ApIHtcbiAgICAgICAgICBtYXJrZXIuc2V0UG9zaXRpb24oYm91bmRzLnJpZ2h0LCBib3VuZHMudG9wKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtYXJrZXIuc2V0UG9zaXRpb24oYm91bmRzLnJpZ2h0LCBib3VuZHMuYm90dG9tKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuY2VudGVyLnJlY2FsY3VsYXRlUG9zaXRpb24oYm91bmRzKTtcbiAgICB0aGlzLmNlbnRlci5kcmF3KHRoaXMuY3R4KTtcbiAgICB0aGlzLmRyYXcodGhpcy5jdHgpOyAvLyB3ZSBuZWVkIHRvIHJlZHJhdyBhbGwgY2FudmFzIGlmIHdlIGhhdmUgY2hhbmdlZCBib3VuZHNcbiAgfVxuXG4gIHB1YmxpYyBvblRvdWNoTW92ZShldmVudDogVG91Y2hFdmVudCkge1xuICAgIGlmICh0aGlzLmNyb3AuaXNJbWFnZVNldCgpKSB7XG4gICAgICBpZiAoZXZlbnQudG91Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNNb3VzZURvd24pIHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpwcmVmZXItZm9yLW9mXG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBldmVudC50b3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB0b3VjaCA9IGV2ZW50LnRvdWNoZXNbaV07XG4gICAgICAgICAgICBjb25zdCB0b3VjaFBvc2l0aW9uID0gdGhpcy5nZXRUb3VjaFBvcyh0aGlzLmNhbnZhcywgdG91Y2gpO1xuICAgICAgICAgICAgY29uc3QgY3JvcFRvdWNoID0gbmV3IENyb3BUb3VjaChcbiAgICAgICAgICAgICAgdG91Y2hQb3NpdGlvbi54LFxuICAgICAgICAgICAgICB0b3VjaFBvc2l0aW9uLnksXG4gICAgICAgICAgICAgIHRvdWNoLmlkZW50aWZpZXJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBuZXcgUG9pbnRQb29sKCkuaW5zdGFuY2UucmV0dXJuUG9pbnQodG91Y2hQb3NpdGlvbik7XG4gICAgICAgICAgICB0aGlzLm1vdmUoY3JvcFRvdWNoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChldmVudC50b3VjaGVzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9XG4gICAgICAgICAgICAoZXZlbnQudG91Y2hlc1swXS5jbGllbnRYIC0gZXZlbnQudG91Y2hlc1sxXS5jbGllbnRYKSAqXG4gICAgICAgICAgICAgIChldmVudC50b3VjaGVzWzBdLmNsaWVudFggLSBldmVudC50b3VjaGVzWzFdLmNsaWVudFgpICtcbiAgICAgICAgICAgIChldmVudC50b3VjaGVzWzBdLmNsaWVudFkgLSBldmVudC50b3VjaGVzWzFdLmNsaWVudFkpICpcbiAgICAgICAgICAgICAgKGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WSAtIGV2ZW50LnRvdWNoZXNbMV0uY2xpZW50WSk7XG4gICAgICAgICAgaWYgKHRoaXMucHJldmlvdXNEaXN0YW5jZSAmJiB0aGlzLnByZXZpb3VzRGlzdGFuY2UgIT09IGRpc3RhbmNlKSB7XG4gICAgICAgICAgICBjb25zdCBib3VuZHMgPSB0aGlzLmdldEJvdW5kcygpO1xuXG4gICAgICAgICAgICBpZiAoZGlzdGFuY2UgPCB0aGlzLnByZXZpb3VzRGlzdGFuY2UpIHtcbiAgICAgICAgICAgICAgYm91bmRzLnRvcCArPSAxO1xuICAgICAgICAgICAgICBib3VuZHMubGVmdCArPSAxO1xuICAgICAgICAgICAgICBib3VuZHMucmlnaHQgLT0gMTtcbiAgICAgICAgICAgICAgYm91bmRzLmJvdHRvbSAtPSAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZGlzdGFuY2UgPiB0aGlzLnByZXZpb3VzRGlzdGFuY2UpIHtcbiAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGJvdW5kcy50b3AgIT09IHRoaXMubWluWUNsYW1wICYmXG4gICAgICAgICAgICAgICAgYm91bmRzLmJvdHRvbSAhPT0gdGhpcy5tYXhZQ2xhbXAgJiZcbiAgICAgICAgICAgICAgICBib3VuZHMubGVmdCAhPT0gdGhpcy5taW5YQ2xhbXAgJiZcbiAgICAgICAgICAgICAgICBib3VuZHMucmlnaHQgIT09IHRoaXMubWF4WENsYW1wXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIC8vIG5vbmVcbiAgICAgICAgICAgICAgICBib3VuZHMudG9wIC09IDE7XG4gICAgICAgICAgICAgICAgYm91bmRzLmxlZnQgLT0gMTtcbiAgICAgICAgICAgICAgICBib3VuZHMucmlnaHQgKz0gMTtcbiAgICAgICAgICAgICAgICBib3VuZHMuYm90dG9tICs9IDE7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgYm91bmRzLnRvcCAhPT0gdGhpcy5taW5ZQ2xhbXAgJiZcbiAgICAgICAgICAgICAgICBib3VuZHMuYm90dG9tICE9PSB0aGlzLm1heFlDbGFtcCAmJlxuICAgICAgICAgICAgICAgIGJvdW5kcy5sZWZ0ID09PSB0aGlzLm1pblhDbGFtcCAmJlxuICAgICAgICAgICAgICAgIGJvdW5kcy5yaWdodCAhPT0gdGhpcy5tYXhYQ2xhbXBcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgLy8gbGVmdFxuICAgICAgICAgICAgICAgIGJvdW5kcy50b3AgLT0gMTtcbiAgICAgICAgICAgICAgICBib3VuZHMucmlnaHQgKz0gMjtcbiAgICAgICAgICAgICAgICBib3VuZHMuYm90dG9tICs9IDE7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgYm91bmRzLnRvcCAhPT0gdGhpcy5taW5ZQ2xhbXAgJiZcbiAgICAgICAgICAgICAgICBib3VuZHMuYm90dG9tICE9PSB0aGlzLm1heFlDbGFtcCAmJlxuICAgICAgICAgICAgICAgIGJvdW5kcy5sZWZ0ICE9PSB0aGlzLm1pblhDbGFtcCAmJlxuICAgICAgICAgICAgICAgIGJvdW5kcy5yaWdodCA9PT0gdGhpcy5tYXhYQ2xhbXBcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgLy8gcmlnaHRcbiAgICAgICAgICAgICAgICBib3VuZHMudG9wIC09IDE7XG4gICAgICAgICAgICAgICAgYm91bmRzLmxlZnQgLT0gMjtcbiAgICAgICAgICAgICAgICBib3VuZHMuYm90dG9tICs9IDE7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgYm91bmRzLnRvcCA9PT0gdGhpcy5taW5ZQ2xhbXAgJiZcbiAgICAgICAgICAgICAgICBib3VuZHMuYm90dG9tICE9PSB0aGlzLm1heFlDbGFtcCAmJlxuICAgICAgICAgICAgICAgIGJvdW5kcy5sZWZ0ICE9PSB0aGlzLm1pblhDbGFtcCAmJlxuICAgICAgICAgICAgICAgIGJvdW5kcy5yaWdodCAhPT0gdGhpcy5tYXhYQ2xhbXBcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgLy8gdG9wXG4gICAgICAgICAgICAgICAgYm91bmRzLmxlZnQgLT0gMTtcbiAgICAgICAgICAgICAgICBib3VuZHMucmlnaHQgKz0gMTtcbiAgICAgICAgICAgICAgICBib3VuZHMuYm90dG9tICs9IDI7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgYm91bmRzLnRvcCAhPT0gdGhpcy5taW5ZQ2xhbXAgJiZcbiAgICAgICAgICAgICAgICBib3VuZHMuYm90dG9tID09PSB0aGlzLm1heFlDbGFtcCAmJlxuICAgICAgICAgICAgICAgIGJvdW5kcy5sZWZ0ICE9PSB0aGlzLm1pblhDbGFtcCAmJlxuICAgICAgICAgICAgICAgIGJvdW5kcy5yaWdodCAhPT0gdGhpcy5tYXhYQ2xhbXBcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgLy8gYm90dG9tXG4gICAgICAgICAgICAgICAgYm91bmRzLnRvcCAtPSAyO1xuICAgICAgICAgICAgICAgIGJvdW5kcy5sZWZ0IC09IDE7XG4gICAgICAgICAgICAgICAgYm91bmRzLnJpZ2h0ICs9IDE7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgYm91bmRzLnRvcCA9PT0gdGhpcy5taW5ZQ2xhbXAgJiZcbiAgICAgICAgICAgICAgICBib3VuZHMuYm90dG9tICE9PSB0aGlzLm1heFlDbGFtcCAmJlxuICAgICAgICAgICAgICAgIGJvdW5kcy5sZWZ0ID09PSB0aGlzLm1pblhDbGFtcCAmJlxuICAgICAgICAgICAgICAgIGJvdW5kcy5yaWdodCAhPT0gdGhpcy5tYXhYQ2xhbXBcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgLy8gdG9wIGxlZnRcbiAgICAgICAgICAgICAgICBib3VuZHMucmlnaHQgKz0gMjtcbiAgICAgICAgICAgICAgICBib3VuZHMuYm90dG9tICs9IDI7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgYm91bmRzLnRvcCA9PT0gdGhpcy5taW5ZQ2xhbXAgJiZcbiAgICAgICAgICAgICAgICBib3VuZHMuYm90dG9tICE9PSB0aGlzLm1heFlDbGFtcCAmJlxuICAgICAgICAgICAgICAgIGJvdW5kcy5sZWZ0ICE9PSB0aGlzLm1pblhDbGFtcCAmJlxuICAgICAgICAgICAgICAgIGJvdW5kcy5yaWdodCA9PT0gdGhpcy5tYXhYQ2xhbXBcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgLy8gdG9wIHJpZ2h0XG4gICAgICAgICAgICAgICAgYm91bmRzLmxlZnQgLT0gMjtcbiAgICAgICAgICAgICAgICBib3VuZHMuYm90dG9tICs9IDI7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgYm91bmRzLnRvcCAhPT0gdGhpcy5taW5ZQ2xhbXAgJiZcbiAgICAgICAgICAgICAgICBib3VuZHMuYm90dG9tID09PSB0aGlzLm1heFlDbGFtcCAmJlxuICAgICAgICAgICAgICAgIGJvdW5kcy5sZWZ0ID09PSB0aGlzLm1pblhDbGFtcCAmJlxuICAgICAgICAgICAgICAgIGJvdW5kcy5yaWdodCAhPT0gdGhpcy5tYXhYQ2xhbXBcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgLy8gYm90dG9tIGxlZnRcbiAgICAgICAgICAgICAgICBib3VuZHMudG9wIC09IDI7XG4gICAgICAgICAgICAgICAgYm91bmRzLnJpZ2h0ICs9IDI7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgYm91bmRzLnRvcCAhPT0gdGhpcy5taW5ZQ2xhbXAgJiZcbiAgICAgICAgICAgICAgICBib3VuZHMuYm90dG9tID09PSB0aGlzLm1heFlDbGFtcCAmJlxuICAgICAgICAgICAgICAgIGJvdW5kcy5sZWZ0ICE9PSB0aGlzLm1pblhDbGFtcCAmJlxuICAgICAgICAgICAgICAgIGJvdW5kcy5yaWdodCA9PT0gdGhpcy5tYXhYQ2xhbXBcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgLy8gYm90dG9tIHJpZ2h0XG4gICAgICAgICAgICAgICAgYm91bmRzLnRvcCAtPSAyO1xuICAgICAgICAgICAgICAgIGJvdW5kcy5sZWZ0IC09IDI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGJvdW5kcy50b3AgPCB0aGlzLm1pbllDbGFtcCkge1xuICAgICAgICAgICAgICBib3VuZHMudG9wID0gdGhpcy5taW5ZQ2xhbXA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYm91bmRzLmJvdHRvbSA+IHRoaXMubWF4WUNsYW1wKSB7XG4gICAgICAgICAgICAgIGJvdW5kcy5ib3R0b20gPSB0aGlzLm1heFlDbGFtcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChib3VuZHMubGVmdCA8IHRoaXMubWluWENsYW1wKSB7XG4gICAgICAgICAgICAgIGJvdW5kcy5sZWZ0ID0gdGhpcy5taW5YQ2xhbXA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYm91bmRzLnJpZ2h0ID4gdGhpcy5tYXhYQ2xhbXApIHtcbiAgICAgICAgICAgICAgYm91bmRzLnJpZ2h0ID0gdGhpcy5tYXhYQ2xhbXA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuc2V0Qm91bmRzKGJvdW5kcyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMucHJldmlvdXNEaXN0YW5jZSA9IGRpc3RhbmNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmRyYXcodGhpcy5jdHgpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvbk1vdXNlTW92ZShlOiBNb3VzZUV2ZW50KSB7XG4gICAgaWYgKHRoaXMuY3JvcC5pc0ltYWdlU2V0KCkgJiYgdGhpcy5pc01vdXNlRG93bikge1xuICAgICAgY29uc3QgbW91c2VQb3NpdGlvbiA9IHRoaXMuZ2V0TW91c2VQb3ModGhpcy5jYW52YXMsIGUpO1xuICAgICAgdGhpcy5tb3ZlKG5ldyBDcm9wVG91Y2gobW91c2VQb3NpdGlvbi54LCBtb3VzZVBvc2l0aW9uLnksIDApKTtcbiAgICAgIGxldCBkcmFnVG91Y2ggPSB0aGlzLmdldERyYWdUb3VjaEZvcklEKDApO1xuICAgICAgaWYgKGRyYWdUb3VjaCkge1xuICAgICAgICBkcmFnVG91Y2gueCA9IG1vdXNlUG9zaXRpb24ueDtcbiAgICAgICAgZHJhZ1RvdWNoLnkgPSBtb3VzZVBvc2l0aW9uLnk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkcmFnVG91Y2ggPSBuZXcgQ3JvcFRvdWNoKG1vdXNlUG9zaXRpb24ueCwgbW91c2VQb3NpdGlvbi55LCAwKTtcbiAgICAgIH1cbiAgICAgIG5ldyBQb2ludFBvb2woKS5pbnN0YW5jZS5yZXR1cm5Qb2ludChtb3VzZVBvc2l0aW9uKTtcbiAgICAgIHRoaXMuZHJhd0N1cnNvcnMoZHJhZ1RvdWNoKTtcbiAgICAgIHRoaXMuZHJhdyh0aGlzLmN0eCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG1vdmUoY3JvcFRvdWNoOiBDcm9wVG91Y2gpIHtcbiAgICBpZiAodGhpcy5pc01vdXNlRG93bikge1xuICAgICAgdGhpcy5oYW5kbGVNb3ZlKGNyb3BUb3VjaCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdldERyYWdUb3VjaEZvcklEKGlkOiBhbnkpOiBDcm9wVG91Y2ggfCB1bmRlZmluZWQge1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpwcmVmZXItZm9yLW9mXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmN1cnJlbnREcmFnVG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGlkID09PSB0aGlzLmN1cnJlbnREcmFnVG91Y2hlc1tpXS5pZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50RHJhZ1RvdWNoZXNbaV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgZHJhd0N1cnNvcnMoY3JvcFRvdWNoOiBDcm9wVG91Y2gpIHtcbiAgICBsZXQgY3Vyc29yRHJhd24gPSBmYWxzZTtcbiAgICBpZiAoY3JvcFRvdWNoICE9IG51bGwpIHtcbiAgICAgIGlmIChjcm9wVG91Y2guZHJhZ0hhbmRsZSA9PT0gdGhpcy5jZW50ZXIpIHtcbiAgICAgICAgdGhpcy5pbWFnZUNyb3BwZXJEYXRhU2hhcmUuc2V0U3R5bGUodGhpcy5jYW52YXMsICdtb3ZlJyk7XG4gICAgICAgIGN1cnNvckRyYXduID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChcbiAgICAgICAgY3JvcFRvdWNoLmRyYWdIYW5kbGUgIT09IG51bGwgJiZcbiAgICAgICAgY3JvcFRvdWNoLmRyYWdIYW5kbGUgaW5zdGFuY2VvZiBDb3JuZXJNYXJrZXJcbiAgICAgICkge1xuICAgICAgICB0aGlzLmRyYXdDb3JuZXJDdXJzb3IoXG4gICAgICAgICAgY3JvcFRvdWNoLmRyYWdIYW5kbGUsXG4gICAgICAgICAgY3JvcFRvdWNoLmRyYWdIYW5kbGUucG9zaXRpb24ueCxcbiAgICAgICAgICBjcm9wVG91Y2guZHJhZ0hhbmRsZS5wb3NpdGlvbi55XG4gICAgICAgICk7XG4gICAgICAgIGN1cnNvckRyYXduID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGV0IGRpZERyYXcgPSBmYWxzZTtcbiAgICBpZiAoIWN1cnNvckRyYXduKSB7XG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cHJlZmVyLWZvci1vZlxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm1hcmtlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZGlkRHJhdyA9XG4gICAgICAgICAgZGlkRHJhdyB8fFxuICAgICAgICAgIHRoaXMuZHJhd0Nvcm5lckN1cnNvcih0aGlzLm1hcmtlcnNbaV0sIGNyb3BUb3VjaC54LCBjcm9wVG91Y2gueSk7XG4gICAgICB9XG4gICAgICBpZiAoIWRpZERyYXcpIHtcbiAgICAgICAgdGhpcy5pbWFnZUNyb3BwZXJEYXRhU2hhcmUuc2V0U3R5bGUodGhpcy5jYW52YXMsICdpbml0aWFsJyk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChcbiAgICAgICFkaWREcmF3ICYmXG4gICAgICAhY3Vyc29yRHJhd24gJiZcbiAgICAgIHRoaXMuY2VudGVyLnRvdWNoSW5Cb3VuZHMoY3JvcFRvdWNoLngsIGNyb3BUb3VjaC55KVxuICAgICkge1xuICAgICAgdGhpcy5jZW50ZXIuc2V0T3Zlcih0cnVlKTtcbiAgICAgIHRoaXMuaW1hZ2VDcm9wcGVyRGF0YVNoYXJlLnNldE92ZXIodGhpcy5jYW52YXMpO1xuICAgICAgdGhpcy5pbWFnZUNyb3BwZXJEYXRhU2hhcmUuc2V0U3R5bGUodGhpcy5jYW52YXMsICdtb3ZlJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2VudGVyLnNldE92ZXIoZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBkcmF3Q29ybmVyQ3Vyc29yKG1hcmtlcjogYW55LCB4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgIGlmIChtYXJrZXIudG91Y2hJbkJvdW5kcyh4LCB5KSkge1xuICAgICAgbWFya2VyLnNldE92ZXIodHJ1ZSk7XG4gICAgICBpZiAobWFya2VyLmdldEhvcml6b250YWxOZWlnaGJvdXIoKS5wb3NpdGlvbi54ID4gbWFya2VyLnBvc2l0aW9uLngpIHtcbiAgICAgICAgaWYgKG1hcmtlci5nZXRWZXJ0aWNhbE5laWdoYm91cigpLnBvc2l0aW9uLnkgPiBtYXJrZXIucG9zaXRpb24ueSkge1xuICAgICAgICAgIHRoaXMuaW1hZ2VDcm9wcGVyRGF0YVNoYXJlLnNldE92ZXIodGhpcy5jYW52YXMpO1xuICAgICAgICAgIHRoaXMuaW1hZ2VDcm9wcGVyRGF0YVNoYXJlLnNldFN0eWxlKHRoaXMuY2FudmFzLCAnbndzZS1yZXNpemUnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmltYWdlQ3JvcHBlckRhdGFTaGFyZS5zZXRPdmVyKHRoaXMuY2FudmFzKTtcbiAgICAgICAgICB0aGlzLmltYWdlQ3JvcHBlckRhdGFTaGFyZS5zZXRTdHlsZSh0aGlzLmNhbnZhcywgJ25lc3ctcmVzaXplJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChtYXJrZXIuZ2V0VmVydGljYWxOZWlnaGJvdXIoKS5wb3NpdGlvbi55ID4gbWFya2VyLnBvc2l0aW9uLnkpIHtcbiAgICAgICAgICB0aGlzLmltYWdlQ3JvcHBlckRhdGFTaGFyZS5zZXRPdmVyKHRoaXMuY2FudmFzKTtcbiAgICAgICAgICB0aGlzLmltYWdlQ3JvcHBlckRhdGFTaGFyZS5zZXRTdHlsZSh0aGlzLmNhbnZhcywgJ25lc3ctcmVzaXplJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5pbWFnZUNyb3BwZXJEYXRhU2hhcmUuc2V0T3Zlcih0aGlzLmNhbnZhcyk7XG4gICAgICAgICAgdGhpcy5pbWFnZUNyb3BwZXJEYXRhU2hhcmUuc2V0U3R5bGUodGhpcy5jYW52YXMsICdud3NlLXJlc2l6ZScpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgbWFya2VyLnNldE92ZXIoZmFsc2UpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHB1YmxpYyBvblRvdWNoU3RhcnQoZXZlbnQ6IFRvdWNoRXZlbnQpIHtcbiAgICBpZiAodGhpcy5jcm9wLmlzSW1hZ2VTZXQoKSkge1xuICAgICAgY29uc3QgdG91Y2ggPSBldmVudC50b3VjaGVzWzBdO1xuICAgICAgY29uc3QgdG91Y2hQb3NpdGlvbiA9IHRoaXMuZ2V0VG91Y2hQb3ModGhpcy5jYW52YXMsIHRvdWNoKTtcbiAgICAgIGNvbnN0IGNyb3BUb3VjaCA9IG5ldyBDcm9wVG91Y2goXG4gICAgICAgIHRvdWNoUG9zaXRpb24ueCxcbiAgICAgICAgdG91Y2hQb3NpdGlvbi55LFxuICAgICAgICB0b3VjaC5pZGVudGlmaWVyXG4gICAgICApO1xuICAgICAgbmV3IFBvaW50UG9vbCgpLmluc3RhbmNlLnJldHVyblBvaW50KHRvdWNoUG9zaXRpb24pO1xuXG4gICAgICB0aGlzLmlzTW91c2VEb3duID0gZmFsc2U7XG4gICAgICBmb3IgKGNvbnN0IG1hcmtlciBvZiB0aGlzLm1hcmtlcnMpIHtcbiAgICAgICAgaWYgKG1hcmtlci50b3VjaEluQm91bmRzKGNyb3BUb3VjaC54LCBjcm9wVG91Y2gueSkpIHtcbiAgICAgICAgICB0aGlzLmlzTW91c2VEb3duID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuY2VudGVyLnRvdWNoSW5Cb3VuZHMoY3JvcFRvdWNoLngsIGNyb3BUb3VjaC55KSkge1xuICAgICAgICB0aGlzLmlzTW91c2VEb3duID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgb25Ub3VjaEVuZChldmVudDogVG91Y2hFdmVudCkge1xuICAgIGlmICh0aGlzLmNyb3AuaXNJbWFnZVNldCgpKSB7XG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cHJlZmVyLWZvci1vZlxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBldmVudC5jaGFuZ2VkVG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCB0b3VjaCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzW2ldO1xuICAgICAgICBjb25zdCBkcmFnVG91Y2ggPSB0aGlzLmdldERyYWdUb3VjaEZvcklEKHRvdWNoLmlkZW50aWZpZXIpO1xuICAgICAgICBpZiAoZHJhZ1RvdWNoICYmIGRyYWdUb3VjaCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgZHJhZ1RvdWNoLmRyYWdIYW5kbGUgaW5zdGFuY2VvZiBDb3JuZXJNYXJrZXIgfHxcbiAgICAgICAgICAgIGRyYWdUb3VjaC5kcmFnSGFuZGxlIGluc3RhbmNlb2YgRHJhZ01hcmtlclxuICAgICAgICAgICkge1xuICAgICAgICAgICAgZHJhZ1RvdWNoLmRyYWdIYW5kbGUuc2V0T3ZlcihmYWxzZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuaGFuZGxlUmVsZWFzZShkcmFnVG91Y2gpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmN1cnJlbnREcmFnVG91Y2hlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhpcy5pc01vdXNlRG93biA9IGZhbHNlO1xuICAgICAgICB0aGlzLmN1cnJlbnRseUludGVyYWN0aW5nID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMTkyOTA5OS9odG1sNS1jYW52YXMtZHJhd2ltYWdlLXJhdGlvLWJ1Zy1pb3NcbiAgcHVibGljIGRyYXdJbWFnZUlPU0ZpeChcbiAgICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxcbiAgICBpbWc6IEhUTUxJbWFnZUVsZW1lbnQgfCBIVE1MQ2FudmFzRWxlbWVudCB8IEhUTUxWaWRlb0VsZW1lbnQsXG4gICAgc3g6IG51bWJlcixcbiAgICBzeTogbnVtYmVyLFxuICAgIHN3OiBudW1iZXIsXG4gICAgc2g6IG51bWJlcixcbiAgICBkeDogbnVtYmVyLFxuICAgIGR5OiBudW1iZXIsXG4gICAgZHc6IG51bWJlcixcbiAgICBkaDogbnVtYmVyXG4gICkge1xuICAgIC8vIFdvcmtzIG9ubHkgaWYgd2hvbGUgaW1hZ2UgaXMgZGlzcGxheWVkOlxuICAgIC8vIGN0eC5kcmF3SW1hZ2UoaW1nLCBzeCwgc3ksIHN3LCBzaCwgZHgsIGR5LCBkdywgZGggLyB2ZXJ0U3F1YXNoUmF0aW8pO1xuICAgIC8vIFRoZSBmb2xsb3dpbmcgd29ya3MgY29ycmVjdCBhbHNvIHdoZW4gb25seSBhIHBhcnQgb2YgdGhlIGltYWdlIGlzIGRpc3BsYXllZDpcbiAgICAvLyBjdHguZHJhd0ltYWdlKGltZywgc3ggKiB0aGlzLnZlcnRTcXVhc2hSYXRpbywgc3kgKiB0aGlzLnZlcnRTcXVhc2hSYXRpbywgc3cgKiB0aGlzLnZlcnRTcXVhc2hSYXRpbywgc2ggKlxuICAgIC8vIHRoaXMudmVydFNxdWFzaFJhdGlvLCBkeCwgZHksIGR3LCBkaCk7XG4gICAgY3R4LmRyYXdJbWFnZShpbWcsIHN4LCBzeSwgc3csIHNoLCBkeCwgZHksIGR3LCBkaCk7XG4gIH1cblxuICBwdWJsaWMgb25Nb3VzZURvd24oZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICBpZiAodGhpcy5jcm9wLmlzSW1hZ2VTZXQoKSkge1xuICAgICAgdGhpcy5pc01vdXNlRG93biA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uTW91c2VVcChldmVudDogTW91c2VFdmVudCkge1xuICAgIGlmICh0aGlzLmNyb3AuaXNJbWFnZVNldCgpKSB7XG4gICAgICB0aGlzLmltYWdlQ3JvcHBlckRhdGFTaGFyZS5zZXRSZWxlYXNlZCh0aGlzLmNhbnZhcyk7XG4gICAgICB0aGlzLmlzTW91c2VEb3duID0gZmFsc2U7XG4gICAgICB0aGlzLmhhbmRsZVJlbGVhc2UobmV3IENyb3BUb3VjaCgwLCAwLCAwKSk7XG4gICAgfVxuICB9XG59XG4iXX0=