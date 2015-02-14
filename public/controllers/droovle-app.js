(function() {
    var module = angular.module('droovle', ['droovleServ']);


    var CreateDroovleCtrl = function(droovleServ, placeModel) {
        this.droovle = {
            address : '',
            email : ''
        }
        this.markers = [];
        this.step = 1;
        this.places = [];
        this.placesDirty = false;
        this.initOnlySearchBox();
    };

    CreateDroovleCtrl.prototype.isStep = function(id) {
        return this.step === id;
    }

    CreateDroovleCtrl.prototype.nextStep = function() {
        this.step += 1;
        if (this.step === 2) this.initialize();
    }


    CreateDroovleCtrl.prototype.updateMapMarkersFromPlaces = function() {
        if (!this.placesDirty) return;

        var places = this.places;
        if (places.length == 0) {
            return;
        }
        for (var i = 0, marker; marker = this.markers[i]; i++) {
            marker.setMap(null);
        }

        var map = new google.maps.Map(document.getElementById('map-canvas'), {
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        // For each place, get the icon, place name, and location.
        this.markers = [];
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, place; place = places[i]; i++) {
            var image = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            var marker = new google.maps.Marker({
                map: map,
                icon: image,
                title: place.name,
                position: place.geometry.location
            });

            this.markers.push(marker);

            bounds.extend(place.geometry.location);

        }

        // ensure minimum bounds size
        var ne = bounds.getNorthEast();
        var sw = bounds.getSouthWest();
        var ewExtendSpan = (0.01 - ne.lng() + sw.lng()) / 2;
        if (ewExtendSpan > 0) {
            bounds.extend(new google.maps.LatLng(ne.lat(), ne.lng() + ewExtendSpan));
            bounds.extend(new google.maps.LatLng(sw.lat(), sw.lng() - ewExtendSpan));
        }

        var nsExtendSpan = (0.005 - ne.lat() + sw.lat()) / 2;
        if (nsExtendSpan > 0) {
            bounds.extend(new google.maps.LatLng(ne.lat() + nsExtendSpan, ne.lng()));
            bounds.extend(new google.maps.LatLng(sw.lat() - nsExtendSpan, sw.lng()));
        }

        map.fitBounds(bounds);
    }


    CreateDroovleCtrl.prototype.initialize = function() {

        // Create the search box and link it to the UI element.
        var input = /** @type {HTMLInputElement} */(
            document.getElementById('txtLocation2'));
        //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        var searchBox = new google.maps.places.SearchBox(
            /** @type {HTMLInputElement} */(input));

        var _this = this;
        // [START region_getplaces]
        // Listen for the event fired when the user selects an item from the
        // pick list. Retrieve the matching places for that item.
        google.maps.event.addListener(searchBox, 'places_changed', function() {
            _this.places = searchBox.getPlaces();
            _this.placesDirty = true;
            _this.updateMapMarkersFromPlaces();

        });
        // [END region_getplaces]

        this.updateMapMarkersFromPlaces();

    }

    CreateDroovleCtrl.prototype.initOnlySearchBox = function() {
        // Create the search box and link it to the UI element.
        var input = /** @type {HTMLInputElement} */(
            document.getElementById('txtLocation1'));
        var searchBox = new google.maps.places.SearchBox(
            /** @type {HTMLInputElement} */(input));

        var _this = this;
        google.maps.event.addListener(searchBox, 'places_changed', function() {
            _this.places = searchBox.getPlaces();
            _this.placesDirty = true;
            // if user presses enter on dropdown list in step1, this event is usually called when
            // we are already in step2, hence during the previous call to initialize, the
            // map was not yet updated
            if (_this.step === 2) _this.updateMapMarkersFromPlaces();

        });
    }

    module.controller('CreateDroovleCtrl', ['DroovleServ', CreateDroovleCtrl]);

})();