'use strict';

L.Control.Coordinates = L.Control.extend({
  options: {
    position: 'bottomleft',
    latitudeText: 'lat.',
    longitudeText: 'lon.',
    promptText: 'Press Ctrl+C to copy coordinates',
    precision: 4
  },

  initialize: function(options) {
    L.Control.prototype.initialize.call(this, options);
  },

  onAdd: function(map) {
    var className = 'leaflet-control-coordinates',
      that = this,
      container = (this._container = L.DomUtil.create('div', className));
    this.visible = false;

    L.DomUtil.addClass(container, 'hidden');

    L.DomEvent.disableClickPropagation(container);

    this._addText(container, map);

    L.DomEvent.addListener(
      container,
      'mousedown',
      function() {
        var lat = L.DomUtil.get(that._lat),
          lng = L.DomUtil.get(that._lng),
          latTextLen = this.options.latitudeText.length + 1,
          lngTextLen = this.options.longitudeText.length + 1,
          latTextIndex =
            lat.textContent.indexOf(this.options.latitudeText) + latTextLen,
          lngTextIndex =
            lng.textContent.indexOf(this.options.longitudeText) + lngTextLen,
          latCoordinate = lat.textContent.substr(latTextIndex),
          lngCoordinate = lng.textContent.substr(lngTextIndex);

          console.log(lat)
        window.prompt(
          this.options.promptText,
          latCoordinate + ' ' + lngCoordinate
        );
      },
      this
    );
    return container;
  },

  _addText: function(container, context) {
    (this._lat = L.DomUtil.create(
      'span',
      'leaflet-control-coordinates-lat',
      container
    )),
      (this._lng = L.DomUtil.create(
        'span',
        'leaflet-control-coordinates-lng',
        container
      ));
    return container;
  },

  setCoordinates: function(obj) {
    return obj
  }
});
