import { Point } from './point';
export class PointPool {
    constructor(initialSize = 1) {
        let prev = (this.firstAvailable = new Point());
        for (let i = 1; i < initialSize; i++) {
            const p = new Point();
            prev.next = p;
            prev = p;
        }
    }
    get instance() {
        return this;
    }
    borrow(x, y) {
        if (this.firstAvailable == null) {
            throw new Error('Pool exhausted');
        }
        this.borrowed++;
        const p = this.firstAvailable;
        this.firstAvailable = p.next;
        p.x = x;
        p.y = y;
        return p;
    }
    returnPoint(p) {
        this.borrowed--;
        p.x = 0;
        p.y = 0;
        p.next = this.firstAvailable;
        this.firstAvailable = p;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9pbnRQb29sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWltZy1jcm9wcGVyL3NyYy9saWIvaW1hZ2UtY3JvcHBlci9tb2RlbC9wb2ludFBvb2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUVoQyxNQUFNLE9BQU8sU0FBUztJQUlwQixZQUFZLGNBQXNCLENBQUM7UUFDakMsSUFBSSxJQUFJLEdBQVUsQ0FBQyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUMsQ0FBQztRQUV0RCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3BDLE1BQU0sQ0FBQyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7WUFDdEIsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7WUFDZCxJQUFJLEdBQUcsQ0FBQyxDQUFDO1NBQ1Y7SUFDSCxDQUFDO0lBRUQsSUFBSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sTUFBTSxDQUFDLENBQVMsRUFBRSxDQUFTO1FBQ2hDLElBQUksSUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFJLEVBQUU7WUFDL0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1NBQ25DO1FBQ0QsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2hCLE1BQU0sQ0FBQyxHQUFVLElBQUksQ0FBQyxjQUFjLENBQUM7UUFDckMsSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQzdCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1IsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDUixPQUFPLENBQUMsQ0FBQztJQUNYLENBQUM7SUFFTSxXQUFXLENBQUMsQ0FBUTtRQUN6QixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDaEIsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDUixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNSLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztRQUM3QixJQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQztJQUMxQixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQb2ludCB9IGZyb20gJy4vcG9pbnQnO1xuXG5leHBvcnQgY2xhc3MgUG9pbnRQb29sIHtcbiAgcHJpdmF0ZSBib3Jyb3dlZDogbnVtYmVyO1xuICBwcml2YXRlIGZpcnN0QXZhaWxhYmxlOiBQb2ludDtcblxuICBjb25zdHJ1Y3Rvcihpbml0aWFsU2l6ZTogbnVtYmVyID0gMSkge1xuICAgIGxldCBwcmV2OiBQb2ludCA9ICh0aGlzLmZpcnN0QXZhaWxhYmxlID0gbmV3IFBvaW50KCkpO1xuXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBpbml0aWFsU2l6ZTsgaSsrKSB7XG4gICAgICBjb25zdCBwID0gbmV3IFBvaW50KCk7XG4gICAgICBwcmV2Lm5leHQgPSBwO1xuICAgICAgcHJldiA9IHA7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGluc3RhbmNlKCk6IFBvaW50UG9vbCB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwdWJsaWMgYm9ycm93KHg6IG51bWJlciwgeTogbnVtYmVyKTogUG9pbnQge1xuICAgIGlmICh0aGlzLmZpcnN0QXZhaWxhYmxlID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUG9vbCBleGhhdXN0ZWQnKTtcbiAgICB9XG4gICAgdGhpcy5ib3Jyb3dlZCsrO1xuICAgIGNvbnN0IHA6IFBvaW50ID0gdGhpcy5maXJzdEF2YWlsYWJsZTtcbiAgICB0aGlzLmZpcnN0QXZhaWxhYmxlID0gcC5uZXh0O1xuICAgIHAueCA9IHg7XG4gICAgcC55ID0geTtcbiAgICByZXR1cm4gcDtcbiAgfVxuXG4gIHB1YmxpYyByZXR1cm5Qb2ludChwOiBQb2ludCkge1xuICAgIHRoaXMuYm9ycm93ZWQtLTtcbiAgICBwLnggPSAwO1xuICAgIHAueSA9IDA7XG4gICAgcC5uZXh0ID0gdGhpcy5maXJzdEF2YWlsYWJsZTtcbiAgICB0aGlzLmZpcnN0QXZhaWxhYmxlID0gcDtcbiAgfVxufVxuIl19