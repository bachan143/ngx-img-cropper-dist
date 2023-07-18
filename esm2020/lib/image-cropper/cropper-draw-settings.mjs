export class CropperDrawSettings {
    constructor(settings) {
        this.lineDash = false;
        this.strokeWidth = 1;
        this.strokeColor = 'rgba(255,255,255,1)';
        this.fillColor = 'rgba(255,255,255,1)';
        this.dragIconStrokeWidth = 1;
        this.dragIconStrokeColor = 'rgba(0,0,0,1)';
        this.dragIconFillColor = 'rgba(255,255,255,1)';
        this.backgroundFillColor = 'rgba(0,0,0,0.6)';
        if (typeof settings === 'object') {
            this.lineDash = settings.lineDash || this.lineDash;
            this.strokeWidth = settings.strokeWidth || this.strokeWidth;
            this.fillColor = settings.fillColor || this.fillColor;
            this.strokeColor = settings.strokeColor || this.strokeColor;
            this.dragIconStrokeWidth =
                settings.dragIconStrokeWidth || this.dragIconStrokeWidth;
            this.dragIconStrokeColor =
                settings.dragIconStrokeColor || this.dragIconStrokeColor;
            this.dragIconFillColor =
                settings.dragIconFillColor || this.dragIconFillColor;
            this.backgroundFillColor =
                settings.backgroundFillColor || this.backgroundFillColor;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JvcHBlci1kcmF3LXNldHRpbmdzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWltZy1jcm9wcGVyL3NyYy9saWIvaW1hZ2UtY3JvcHBlci9jcm9wcGVyLWRyYXctc2V0dGluZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxPQUFPLG1CQUFtQjtJQVU5QixZQUFZLFFBQWM7UUFUbkIsYUFBUSxHQUFHLEtBQUssQ0FBQztRQUNqQixnQkFBVyxHQUFHLENBQUMsQ0FBQztRQUNoQixnQkFBVyxHQUFHLHFCQUFxQixDQUFDO1FBQ3BDLGNBQVMsR0FBRyxxQkFBcUIsQ0FBQztRQUNsQyx3QkFBbUIsR0FBRyxDQUFDLENBQUM7UUFDeEIsd0JBQW1CLEdBQUcsZUFBZSxDQUFDO1FBQ3RDLHNCQUFpQixHQUFHLHFCQUFxQixDQUFDO1FBQzFDLHdCQUFtQixHQUFHLGlCQUFpQixDQUFDO1FBRzdDLElBQUksT0FBTyxRQUFRLEtBQUssUUFBUSxFQUFFO1lBQ2hDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQ25ELElBQUksQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDO1lBQzVELElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ3RELElBQUksQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDO1lBQzVELElBQUksQ0FBQyxtQkFBbUI7Z0JBQ3RCLFFBQVEsQ0FBQyxtQkFBbUIsSUFBSSxJQUFJLENBQUMsbUJBQW1CLENBQUM7WUFDM0QsSUFBSSxDQUFDLG1CQUFtQjtnQkFDdEIsUUFBUSxDQUFDLG1CQUFtQixJQUFJLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztZQUMzRCxJQUFJLENBQUMsaUJBQWlCO2dCQUNwQixRQUFRLENBQUMsaUJBQWlCLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDO1lBQ3ZELElBQUksQ0FBQyxtQkFBbUI7Z0JBQ3RCLFFBQVEsQ0FBQyxtQkFBbUIsSUFBSSxJQUFJLENBQUMsbUJBQW1CLENBQUM7U0FDNUQ7SUFDSCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgQ3JvcHBlckRyYXdTZXR0aW5ncyB7XG4gIHB1YmxpYyBsaW5lRGFzaCA9IGZhbHNlO1xuICBwdWJsaWMgc3Ryb2tlV2lkdGggPSAxO1xuICBwdWJsaWMgc3Ryb2tlQ29sb3IgPSAncmdiYSgyNTUsMjU1LDI1NSwxKSc7XG4gIHB1YmxpYyBmaWxsQ29sb3IgPSAncmdiYSgyNTUsMjU1LDI1NSwxKSc7XG4gIHB1YmxpYyBkcmFnSWNvblN0cm9rZVdpZHRoID0gMTtcbiAgcHVibGljIGRyYWdJY29uU3Ryb2tlQ29sb3IgPSAncmdiYSgwLDAsMCwxKSc7XG4gIHB1YmxpYyBkcmFnSWNvbkZpbGxDb2xvciA9ICdyZ2JhKDI1NSwyNTUsMjU1LDEpJztcbiAgcHVibGljIGJhY2tncm91bmRGaWxsQ29sb3IgPSAncmdiYSgwLDAsMCwwLjYpJztcblxuICBjb25zdHJ1Y3RvcihzZXR0aW5ncz86IGFueSkge1xuICAgIGlmICh0eXBlb2Ygc2V0dGluZ3MgPT09ICdvYmplY3QnKSB7XG4gICAgICB0aGlzLmxpbmVEYXNoID0gc2V0dGluZ3MubGluZURhc2ggfHwgdGhpcy5saW5lRGFzaDtcbiAgICAgIHRoaXMuc3Ryb2tlV2lkdGggPSBzZXR0aW5ncy5zdHJva2VXaWR0aCB8fCB0aGlzLnN0cm9rZVdpZHRoO1xuICAgICAgdGhpcy5maWxsQ29sb3IgPSBzZXR0aW5ncy5maWxsQ29sb3IgfHwgdGhpcy5maWxsQ29sb3I7XG4gICAgICB0aGlzLnN0cm9rZUNvbG9yID0gc2V0dGluZ3Muc3Ryb2tlQ29sb3IgfHwgdGhpcy5zdHJva2VDb2xvcjtcbiAgICAgIHRoaXMuZHJhZ0ljb25TdHJva2VXaWR0aCA9XG4gICAgICAgIHNldHRpbmdzLmRyYWdJY29uU3Ryb2tlV2lkdGggfHwgdGhpcy5kcmFnSWNvblN0cm9rZVdpZHRoO1xuICAgICAgdGhpcy5kcmFnSWNvblN0cm9rZUNvbG9yID1cbiAgICAgICAgc2V0dGluZ3MuZHJhZ0ljb25TdHJva2VDb2xvciB8fCB0aGlzLmRyYWdJY29uU3Ryb2tlQ29sb3I7XG4gICAgICB0aGlzLmRyYWdJY29uRmlsbENvbG9yID1cbiAgICAgICAgc2V0dGluZ3MuZHJhZ0ljb25GaWxsQ29sb3IgfHwgdGhpcy5kcmFnSWNvbkZpbGxDb2xvcjtcbiAgICAgIHRoaXMuYmFja2dyb3VuZEZpbGxDb2xvciA9XG4gICAgICAgIHNldHRpbmdzLmJhY2tncm91bmRGaWxsQ29sb3IgfHwgdGhpcy5iYWNrZ3JvdW5kRmlsbENvbG9yO1xuICAgIH1cbiAgfVxufVxuIl19