'use strict';
function MapLabel(opt_options) {
    this.set('fontFamily', 'sans-serif');
    this.set('fontSize', '100%');
    this.set('fontColor', 'black');
    this.set('strokeWeight', 4);
    this.set('strokeColor', '#ffffff');
    this.set('align', 'center');
    this.set('zIndex', 1000000);
    this.setValues(opt_options);
}

MapLabel.prototype = new google
    .maps
    .OverlayView();

MapLabel.prototype.changed = function (prop) {
    switch (prop) {
        case 'fontFamily':
        case 'fontSize':
        case 'fontColor':
        case 'strokeWeight':
        case 'strokeColor':
        case 'align':
        case 'text':
            return this.drawCanvas();
        case 'maxZoom':
        case 'minZoom':
        case 'position':
            return this.draw();
    }
};

MapLabel.prototype.drawCanvas = function () {
    var canvas = this.canvas_;
    if (!canvas) {
        return
    };

    var style = canvas.style;
    style.zIndex =/** @type number */
    (this.get('zIndex'));

    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = this.get('strokeColor');
    ctx.fillStyle = this.get('fontColor');
    ctx.font = this.get('fontSize') + 'px ' + this.get('fontFamily');

    var strokeWeight = Number(this.get('strokeWeight'));

    var text = this.get('text');
    if (text) {
        if (strokeWeight) {
            ctx.lineWidth = strokeWeight;
            ctx.strokeText(text, strokeWeight, strokeWeight);
        }

        ctx.fillText(text, strokeWeight, strokeWeight);

        var textMeasure = ctx.measureText(text);
        var textWidth = textMeasure.width + strokeWeight;
        style.marginLeft = this.getMarginLeft_(textWidth) + 'px';
        // Bring actual text top in line with desired latitude. Cheaper than calculating
        // height of text.
        style.marginTop = '-0.5em';
    }
};

MapLabel.prototype.onAdd = function () {
    var canvas = this.canvas_ = document.createElement('canvas');
    var style = canvas.style;
    style.position = 'absolute';

    var ctx = canvas.getContext('2d');
    ctx.lineJoin = 'round';
    ctx.textBaseline = 'top';

    this.drawCanvas();

    var panes = this.getPanes();
    if (panes) {
        panes
            .floatPane //note: this is done to put the label above the route 
            .appendChild(canvas);
    }
};

MapLabel.prototype.getMarginLeft_ = function (textWidth) {
    switch (this.get('align')) {
        case 'left':
            return 0;
        case 'right':
            return -textWidth;
    }
    return textWidth / -2;
};

MapLabel.prototype.draw = function () {
    var projection = this.getProjection();

    if (!projection) {
        // The map projection is not ready yet so do nothing
        return;
    }

    if (!this.canvas_) {
        // onAdd has not been called yet.
        return;
    }

    var latLng =/** @type {google.maps.LatLng} */
    (this.get('position'));
    if (!latLng) {
        return;
    }
    var pos = projection.fromLatLngToDivPixel(latLng);

    var style = this.canvas_.style;

    style['top'] = (pos.y) + 'px';
    style['left'] = (pos.x + 1) + 'px';

    style['visibility'] = this.getVisible_();
};

MapLabel.prototype.getVisible_ = function () {
    var minZoom =/** @type number */
    (this.get('minZoom'));
    var maxZoom =/** @type number */
    (this.get('maxZoom'));

    if (minZoom === undefined && maxZoom === undefined) {
        return '';
    }

    var map = this.getMap();
    if (!map) {
        return '';
    }

    var mapZoom = map.getZoom();
    if (mapZoom < minZoom || mapZoom > maxZoom) {
        return 'hidden';
    }
    return '';
};

MapLabel.prototype.remove = function () {
    var canvas = this.canvas_;
    if (canvas && canvas.parentNode) {
        canvas
            .parentNode
            .removeChild(canvas);
    }
};

exports.MapLabel = MapLabel;