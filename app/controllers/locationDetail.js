var Tools         = require('tools');
var locationPoint = arguments[0] || {};

var application = {
    device:    Ti.Platform.name,
    MapModule: require('ti.map'),
    mapview:   null,
    coords:    {
        latitude:  locationPoint.get('latitude'),
        longitude: locationPoint.get('longitude')
    },
    photoPath: null
}

// Set UI
$.nameLabel.text = locationPoint.get('name');

var date = new Date(locationPoint.get('date'));
$.dateLabel.text = 'Le ' + date.getDate()  +'/'+ (date.getMonth()+1) +'/'+ date.getFullYear();
$.timeLabel.text = 'À '  + date.getHours() +':'+  date.getMinutes()  +':'+ date.getSeconds();

if (locationPoint.get('photoPath')) {
    $.photoThumb.image = locationPoint.get('photoPath');
};

// Set the Map
if (application.device == "android") {
    Tools.initAndroidMap(application, true);
}

$.map.add(application.mapview);

$.trashButton.addEventListener('click', function(e) {
    $.alertDelete.addEventListener('click', function(event) {
        if (event.index == 0) {
            var locationPoints = Alloy.Collections.instance('locationPoint');
            locationPoint.destroy();

            Alloy.createController('locationList').getView().open();
        }
    })
    $.alertDelete.show();
})