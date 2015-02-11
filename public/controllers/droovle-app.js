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

            _this.updateMapMarkersFromPlaces();

        });
        // [END region_getplaces]

        if (this.places.length > 0) {
            this.updateMapMarkersFromPlaces();
        }

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

        });
    }

    module.controller('CreateDroovleCtrl', ['DroovleServ', CreateDroovleCtrl]);

})();