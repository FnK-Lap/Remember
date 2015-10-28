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

var data = [];
locationPoints.map(function(locationPoint, index) {
    // Row
    // var row = Ti.UI.createTableViewRow({
    //     id: locationPoint.id,
    //     rowIndex: index,
    //     height: 110
    // });

    // // Image
    // if (locationPoint.get('photoPath') != '') {
    //     var image = Ti.UI.createImageView({
    //         image: locationPoint.get('photoPath'),
    //         left: 10, top: 5,
    //         width: 100, height: 100,
    //         touchEnabled: false
    //     });
    // } else {
    //     var image = Ti.UI.createImageView({
    //         image: '/images/location_point.png',
    //         left: 25, top: 20,
    //         width: 70, height: 70,
    //         touchEnabled: false
    //     });
    // }
    // row.add(image);

    // // Name
    // var nameLabel = Ti.UI.createLabel({
    //     color: '#576996',
    //     text: locationPoint.get("name"),
    //     left: 130, top: 44,
    //     width: 360,
    //     touchEnabled: false

    // })
    // row.add(nameLabel);

    // var date = new Date(locationPoint.get('date'));
    // // Date
    // var dateLabel = Ti.UI.createLabel({
    //     color: '#576996',
    //     text: date.getDate() +'/'+ (date.getMonth()+1) +'/'+ date.getFullYear(),
    //     right: 10, top: 20,
    //     width: Ti.UI.SIZE,
    //     touchEnabled: false
    // })
    // row.add(dateLabel);
    // // Time
    // var timeLabel = Ti.UI.createLabel({
    //     color: '#576996',
    //     text: date.getHours() +':'+ date.getMinutes() +':'+ date.getSeconds(),
    //     right: 10, bottom: 20,
    //     width: Ti.UI.SIZE,
    //     touchEnabled: false
    // })
    // row.add(timeLabel);

    // data.push(row);



});

// $.tableView.setData(data);


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
    console.log('e.source.id');
    console.log(e.source);
    locationPoint = locationPoints.get(locationPointId);
    Alloy.createController('locationDetail', locationPoint).getView().open();
})




