var Tools = require('tools');

var application = {
    device:    Ti.Platform.name,
    MapModule: require('ti.map'),
    mapview:   null,
    coords:    null,
    photoPath: null
}

application.toggleClass = function(element, addClass, removeClass) {
    $.addClass(element, addClass);
    $.removeClass(element, removeClass);
}

application.getLocation = function() {
    if (Ti.Geolocation.locationServicesEnabled) {
        Ti.Geolocation.getCurrentPosition(function(e) {
            if (e.success) {
                Ti.API.info('Latitude : '  + e.coords.latitude);
                Ti.API.info('Longitude : ' + e.coords.longitude);
                application.coords = e.coords;
            } else {
                alert(e.error);
            }
        })
    } else {
        alert('Service de Geolocation désactivé');
    }
}

application.handleLocation = function() {
    // Remove location if already set
    if (application.coords) {
        Ti.API.info('Reset Geolocation');
        // Reset location
        application.coords = null;
        // Remove annotation
        application.mapview.removeAllAnnotations();
        // Update UI
        application.toggleClass($.locationButton, "locationButton", "locationButtonSelected");
    } else {
        Ti.API.info('Geolocation');
        // Get location
        application.getLocation();
        // Set view to location
        if (application.coords) {
            application.mapview.setLocation({
                latitude:       application.coords.latitude,
                longitude:      application.coords.longitude,
                animate:        true,
                latitudeDelta:  0.01,
                longitudeDelta: 0.01
            });
            // Update UI
            application.toggleClass($.locationButton, "locationButtonSelected", "locationButton");
            // Add location annotation
            Tools.setAnnotation(application.MapModule, application.mapview, application.coords);
        }
    }
}

application.handleCamera = function() {
    if (application.device == "android") {
        Titanium.Media.showCamera({
            success: function(e) {
                // Set photo
                // application.photoPath = e.media.nativePath;
                $.photoButton.backgroundImage = application.photoPath = e.media.nativePath;
                // Get Location
                application.getLocation();

                if (application.coords != null) {      
                    // Update UI
                    application.toggleClass($.locationButton, "locationButtonSelected", "locationButton");
                    // Update mapView
                    application.mapview.setLocation({
                        latitude:       application.coords.latitude,
                        longitude:      application.coords.longitude,
                        animate:        true,
                        latitudeDelta:  0.01,
                        longitudeDelta: 0.01
                    });
                    // Add location annotation
                    Tools.setAnnotation(application.MapModule, application.mapview, application.coords);
                }
            },
            cancel: function(e) {

            },
            error: function(e) {
                var a = Titanium.UI.createAlertDialog({title:'Camera'});
                a.setMessage('Une erreur est survenue');
                a.show();
            },
            mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO]
        })
    }
}

application.sendData = function() {
    var name = $.nameField.value;
    if (name == '') {
        var a = Titanium.UI.createAlertDialog({title:'Nom manquant'});
        a.setMessage('Veuillez entrer un nom.');
        a.show();
    } else if (application.coords == null) {
        var a = Titanium.UI.createAlertDialog({title:'Localisation manquante'});
        a.setMessage('Veuillez vous localiser avant de valider.');
        a.show();
    } else {
        // Save location and photo into DB
        var locationPoint = Alloy.createModel('locationPoint', {
            name:      name, 
            latitude:  application.coords.latitude, 
            longitude: application.coords.longitude,
            photoPath: application.photoPath ? application.photoPath : "",
            date:      new Date()
        });

        if (locationPoint.isValid()) {
            locationPoint.save();

            $.nameField.value = '';
            application.coords = null;
            application.toggleClass($.locationButton, "locationButton", "locationButtonSelected");
            application.photoPath = null;
            $.photoButton.backgroundImage = '/images/photo.png';

            var a = Titanium.UI.createAlertDialog({title:'Success'});
            a.setMessage('Votre point a été enregistré');
            a.show();
        } else {
            locationPoint.destroy();
        }

    }
}

application.getLocation();

// - - - - - - - - - - - - - - - - - - - - //
// - - - - -        Android      - - - - - //
// - - - - - - - - - - - - - - - - - - - - //
if (application.device == "android") {
    Tools.initAndroidMap(application, false);
}


// * * * * * * * * * * * * * * * * * * * * //
// * * * * *        Events       * * * * * //
// * * * * * * * * * * * * * * * * * * * * //

// Get Geolocation
$.locationButton.addEventListener('click', application.handleLocation);

// Handle Camera
$.photoButton.addEventListener('click', application.handleCamera);

// Swipe Event
$.index.addEventListener('swipe', function(e) {
    if (e.direction == 'left') {
        Alloy.createController('locationList').getView().open();
    }
})

// List Button
$.menuButton.addEventListener('click', function(e) {
    Alloy.createController('locationList').getView().open();
})

// Send Data
$.sendButton.addEventListener('click', application.sendData);


$.map.add(application.mapview);


$.index.open();