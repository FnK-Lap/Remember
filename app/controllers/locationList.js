// Get all locationsPoints
var locationPoints = Alloy.Collections.instance('locationPoint');
locationPoints.fetch();

function transformData(model) {
    var transform = model.toJSON();
    if (transform.photoPath == '') {
        transform.photoPath = '/images/location_plan.png';
    }

    var date = new Date(transform.date);

    transform.formatedDate = date.getDate() +'/'+ (date.getMonth()+1) +'/'+ date.getFullYear();
    transform.formatedTime = date.getHours() +':'+ date.getMinutes() +':'+ date.getSeconds();

    return transform;
}

// * * * * * * * * * * * * * * * * * * * * //
// * * * * *        Events       * * * * * //
// * * * * * * * * * * * * * * * * * * * * //

// Swipe Event
$.locationList.addEventListener('swipe', function(e) {
    if (e.direction == 'right') {
        Alloy.createController('index').getView().open();
    }
})

// Click Table View Row
$.tableView.addEventListener('click', function(e) {
    var locationPointId = e.source.dataId;
    locationPoint = locationPoints.get(locationPointId);
    Alloy.createController('locationDetail', locationPoint).getView().open();
})




