var Tools = {
    setAnnotation: function(MapModule, MapView, coords) {
        var annotation = MapModule.createAnnotation({
            latitude: coords.latitude,
            longitude: coords.longitude,
            id: 1,
            pincolor: MapModule.ANNOTATION_CYAN
        });

        MapView.addAnnotation(annotation);
    },
    initAndroidMap: function(application, withAnnotation) {
        Ti.API.info("Device Android");
        Ti.Geolocation.Android.manualMode = false;
        Ti.Geolocation.accuracy           = Ti.Geolocation.ACCURACY_HIGH;
        application.googlePlayService     = application.MapModule.isGooglePlayServicesAvailable();

        switch (application.googlePlayService) {
            case application.MapModule.SUCCESS:
                Ti.API.info('Google Play services is installed');

                if (application.coords != null) {
                    application.mapview = application.MapModule.createView({
                        mapType: application.MapModule.NORMAL_TYPE,
                        top: 0,
                        region: {
                            latitude:  application.coords.latitude,
                            longitude: application.coords.longitude,
                            animate:        true,
                            latitudeDelta:  0.01,
                            longitudeDelta: 0.01
                        }
                    });

                    if (withAnnotation) {
                        Tools.setAnnotation(application.MapModule, application.mapview, application.coords);
                    }

                    application.coords = null
                } else {
                    application.mapview = application.MapModule.createView({
                        mapType: application.MapModule.NORMAL_TYPE,
                        top: 0
                    });
                }

                break;
            case application.MapModule.SERVICE_MISSING:
                alert('Google Play services is missing. Please install Google Play services from the Google Play store.');
                break;
            case application.MapModule.SERVICE_VERSION_UPDATE_REQUIRED:
                alert('Google Play services is out of date. Please update Google Play services.');
                break;
            case application.MapModule.SERVICE_DISABLED:
                alert('Google Play services is disabled. Please enable Google Play services.');
                break;
            case application.MapModule.SERVICE_INVALID:
                alert('Google Play services cannot be authenticated. Reinstall Google Play services.');
                break;
            default:
                alert('Unknown error.');
        }
    }
}

module.exports = Tools;