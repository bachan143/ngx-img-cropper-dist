import { CropperDrawSettings } from './cropper-draw-settings';
export class CropperSettings {
    constructor(settings) {
        this.canvasWidth = 300;
        this.canvasHeight = 300;
        this.dynamicSizing = false;
        this.width = 200;
        this.height = 200;
        this.minWidth = 50;
        this.minHeight = 50;
        this.minWithRelativeToResolution = true;
        this.croppedWidth = 100;
        this.croppedHeight = 100;
        this.cropperDrawSettings = new CropperDrawSettings();
        this.touchRadius = 20;
        this.noFileInput = false;
        this.markerSizeMultiplier = 1;
        this.centerTouchRadius = 20;
        this.showCenterMarker = true;
        this.allowedFilesRegex = /\.(jpe?g|png|gif|bmp)$/i;
        this.cropOnResize = true;
        this.preserveSize = false;
        this.compressRatio = 1.0;
        this.showFullCropInitial = false;
        // tslint:disable-next-line:variable-name
        this._rounded = false;
        // tslint:disable-next-line:variable-name
        this._keepAspect = true;
        if (typeof settings === 'object') {
            Object.assign(this, settings);
        }
    }
    set rounded(val) {
        this._rounded = val;
        if (val) {
            this._keepAspect = true;
        }
    }
    get rounded() {
        return this._rounded;
    }
    set keepAspect(val) {
        this._keepAspect = val;
        if (this._rounded === true && this._keepAspect === false) {
            console.error('Cannot set keep aspect to false on rounded cropper. Ellipsis not supported');
            this._keepAspect = true;
        }
    }
    get keepAspect() {
        return this._keepAspect;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JvcHBlci1zZXR0aW5ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1pbWctY3JvcHBlci9zcmMvbGliL2ltYWdlLWNyb3BwZXIvY3JvcHBlci1zZXR0aW5ncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQStCOUQsTUFBTSxPQUFPLGVBQWU7SUF5QzFCLFlBQVksUUFBMkI7UUF4Q2hDLGdCQUFXLEdBQUcsR0FBRyxDQUFDO1FBQ2xCLGlCQUFZLEdBQUcsR0FBRyxDQUFDO1FBRW5CLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBSXRCLFVBQUssR0FBRyxHQUFHLENBQUM7UUFDWixXQUFNLEdBQUcsR0FBRyxDQUFDO1FBRWIsYUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNkLGNBQVMsR0FBRyxFQUFFLENBQUM7UUFDZixnQ0FBMkIsR0FBRyxJQUFJLENBQUM7UUFFbkMsaUJBQVksR0FBRyxHQUFHLENBQUM7UUFDbkIsa0JBQWEsR0FBRyxHQUFHLENBQUM7UUFFcEIsd0JBQW1CLEdBQXdCLElBQUksbUJBQW1CLEVBQUUsQ0FBQztRQUNyRSxnQkFBVyxHQUFHLEVBQUUsQ0FBQztRQUNqQixnQkFBVyxHQUFHLEtBQUssQ0FBQztRQU1wQix5QkFBb0IsR0FBRyxDQUFDLENBQUM7UUFDekIsc0JBQWlCLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLHFCQUFnQixHQUFHLElBQUksQ0FBQztRQUV4QixzQkFBaUIsR0FBVyx5QkFBeUIsQ0FBQztRQUN0RCxpQkFBWSxHQUFHLElBQUksQ0FBQztRQUNwQixpQkFBWSxHQUFHLEtBQUssQ0FBQztRQUVyQixrQkFBYSxHQUFHLEdBQUcsQ0FBQztRQUUzQix5Q0FBeUM7UUFDakMsYUFBUSxHQUFHLEtBQUssQ0FBQztRQUN6Qix5Q0FBeUM7UUFDakMsZ0JBQVcsR0FBRyxJQUFJLENBQUM7UUFHekIsSUFBSSxPQUFPLFFBQVEsS0FBSyxRQUFRLEVBQUU7WUFDaEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDL0I7SUFDSCxDQUFDO0lBRUQsSUFBSSxPQUFPLENBQUMsR0FBWTtRQUN0QixJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztRQUNwQixJQUFJLEdBQUcsRUFBRTtZQUNQLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQztJQUVELElBQUksT0FBTztRQUNULE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDO0lBRUQsSUFBSSxVQUFVLENBQUMsR0FBWTtRQUN6QixJQUFJLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQztRQUN2QixJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssS0FBSyxFQUFFO1lBQ3hELE9BQU8sQ0FBQyxLQUFLLENBQ1gsNEVBQTRFLENBQzdFLENBQUM7WUFDRixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztTQUN6QjtJQUNILENBQUM7SUFFRCxJQUFJLFVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ3JvcHBlckRyYXdTZXR0aW5ncyB9IGZyb20gJy4vY3JvcHBlci1kcmF3LXNldHRpbmdzJztcblxuZXhwb3J0IGludGVyZmFjZSBJQ3JvcHBlclNldHRpbmdzIHtcbiAgY2FudmFzV2lkdGg/OiBudW1iZXI7XG4gIGNhbnZhc0hlaWdodD86IG51bWJlcjtcbiAgZHluYW1pY1NpemluZz86IGJvb2xlYW47XG4gIGNyb3BwZXJDbGFzcz86IHN0cmluZztcbiAgY3JvcHBpbmdDbGFzcz86IHN0cmluZztcbiAgd2lkdGg/OiBudW1iZXI7XG4gIGhlaWdodD86IG51bWJlcjtcbiAgbWluV2lkdGg/OiBudW1iZXI7XG4gIG1pbkhlaWdodD86IG51bWJlcjtcbiAgbWluV2l0aFJlbGF0aXZlVG9SZXNvbHV0aW9uPzogYm9vbGVhbjtcbiAgY3JvcHBlZFdpZHRoPzogbnVtYmVyO1xuICBjcm9wcGVkSGVpZ2h0PzogbnVtYmVyO1xuICBjcm9wcGVyRHJhd1NldHRpbmdzPzogYW55O1xuICB0b3VjaFJhZGl1cz86IG51bWJlcjtcbiAgbm9GaWxlSW5wdXQ/OiBib29sZWFuO1xuICBmaWxlVHlwZT86IHN0cmluZztcbiAgcmVzYW1wbGVGbj86IChjOiBIVE1MQ2FudmFzRWxlbWVudCkgPT4gdm9pZDtcbiAgbWFya2VyU2l6ZU11bHRpcGxpZXI/OiBudW1iZXI7XG4gIGNlbnRlclRvdWNoUmFkaXVzPzogbnVtYmVyO1xuICBzaG93Q2VudGVyTWFya2VyPzogYm9vbGVhbjtcbiAgYWxsb3dlZEZpbGVzUmVnZXg/OiBSZWdFeHA7XG4gIGNyb3BPblJlc2l6ZT86IGJvb2xlYW47XG4gIHByZXNlcnZlU2l6ZT86IGJvb2xlYW47XG4gIGNvbXByZXNzUmF0aW8/OiBudW1iZXI7XG4gIHJvdW5kZWQ/OiBib29sZWFuO1xuICBrZWVwQXNwZWN0PzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNsYXNzIENyb3BwZXJTZXR0aW5ncyBpbXBsZW1lbnRzIElDcm9wcGVyU2V0dGluZ3Mge1xuICBwdWJsaWMgY2FudmFzV2lkdGggPSAzMDA7XG4gIHB1YmxpYyBjYW52YXNIZWlnaHQgPSAzMDA7XG5cbiAgcHVibGljIGR5bmFtaWNTaXppbmcgPSBmYWxzZTtcbiAgcHVibGljIGNyb3BwZXJDbGFzczogc3RyaW5nO1xuICBwdWJsaWMgY3JvcHBpbmdDbGFzczogc3RyaW5nO1xuXG4gIHB1YmxpYyB3aWR0aCA9IDIwMDtcbiAgcHVibGljIGhlaWdodCA9IDIwMDtcblxuICBwdWJsaWMgbWluV2lkdGggPSA1MDtcbiAgcHVibGljIG1pbkhlaWdodCA9IDUwO1xuICBwdWJsaWMgbWluV2l0aFJlbGF0aXZlVG9SZXNvbHV0aW9uID0gdHJ1ZTtcblxuICBwdWJsaWMgY3JvcHBlZFdpZHRoID0gMTAwO1xuICBwdWJsaWMgY3JvcHBlZEhlaWdodCA9IDEwMDtcblxuICBwdWJsaWMgY3JvcHBlckRyYXdTZXR0aW5nczogQ3JvcHBlckRyYXdTZXR0aW5ncyA9IG5ldyBDcm9wcGVyRHJhd1NldHRpbmdzKCk7XG4gIHB1YmxpYyB0b3VjaFJhZGl1cyA9IDIwO1xuICBwdWJsaWMgbm9GaWxlSW5wdXQgPSBmYWxzZTtcblxuICBwdWJsaWMgZmlsZVR5cGU6IHN0cmluZztcblxuICBwdWJsaWMgcmVzYW1wbGVGbjogKGM6IEhUTUxDYW52YXNFbGVtZW50KSA9PiB2b2lkO1xuXG4gIHB1YmxpYyBtYXJrZXJTaXplTXVsdGlwbGllciA9IDE7XG4gIHB1YmxpYyBjZW50ZXJUb3VjaFJhZGl1cyA9IDIwO1xuICBwdWJsaWMgc2hvd0NlbnRlck1hcmtlciA9IHRydWU7XG5cbiAgcHVibGljIGFsbG93ZWRGaWxlc1JlZ2V4OiBSZWdFeHAgPSAvXFwuKGpwZT9nfHBuZ3xnaWZ8Ym1wKSQvaTtcbiAgcHVibGljIGNyb3BPblJlc2l6ZSA9IHRydWU7XG4gIHB1YmxpYyBwcmVzZXJ2ZVNpemUgPSBmYWxzZTtcblxuICBwdWJsaWMgY29tcHJlc3NSYXRpbyA9IDEuMDtcblxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxuICBwcml2YXRlIF9yb3VuZGVkID0gZmFsc2U7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lXG4gIHByaXZhdGUgX2tlZXBBc3BlY3QgPSB0cnVlO1xuXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzPzogSUNyb3BwZXJTZXR0aW5ncykge1xuICAgIGlmICh0eXBlb2Ygc2V0dGluZ3MgPT09ICdvYmplY3QnKSB7XG4gICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHNldHRpbmdzKTtcbiAgICB9XG4gIH1cblxuICBzZXQgcm91bmRlZCh2YWw6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9yb3VuZGVkID0gdmFsO1xuICAgIGlmICh2YWwpIHtcbiAgICAgIHRoaXMuX2tlZXBBc3BlY3QgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGdldCByb3VuZGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9yb3VuZGVkO1xuICB9XG5cbiAgc2V0IGtlZXBBc3BlY3QodmFsOiBib29sZWFuKSB7XG4gICAgdGhpcy5fa2VlcEFzcGVjdCA9IHZhbDtcbiAgICBpZiAodGhpcy5fcm91bmRlZCA9PT0gdHJ1ZSAmJiB0aGlzLl9rZWVwQXNwZWN0ID09PSBmYWxzZSkge1xuICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgJ0Nhbm5vdCBzZXQga2VlcCBhc3BlY3QgdG8gZmFsc2Ugb24gcm91bmRlZCBjcm9wcGVyLiBFbGxpcHNpcyBub3Qgc3VwcG9ydGVkJ1xuICAgICAgKTtcbiAgICAgIHRoaXMuX2tlZXBBc3BlY3QgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGdldCBrZWVwQXNwZWN0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9rZWVwQXNwZWN0O1xuICB9XG59XG4iXX0=