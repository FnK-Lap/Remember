exports.definition = {
    config: {
        "columns": {
            "id":        "INTEGER PRIMARY KEY AUTOINCREMENT",
            "name":      "TEXT",
            "latitude":  "REAL",
            "longitude": "REAL",
            "photoPath": "TEXT",
            "date":      "TEXT"
        },
        "defaults": {
            "name":      "-",
            "latitude":  "-",
            "longitude": "-",
            "photoPath": "-",
            "date":      "-"
        },
        "adapter": {
            "type":            "sql",
            "collection_name": "locationPoint",
            "idAttribute":     "id"
        }
    },
    extendModel: function(Model) {      
        _.extend(Model.prototype, {
            // Implement the validate method                        
            validate: function (attrs) {
                for (var key in attrs) {
                    var value = attrs[key];
                    if (key === "name") {
                        if (value.length <= 0) {
                            return "Error: No Name";
                        }
                    }
                    if (key === "latitude") {
                        if (value < -90 || value > 90) {
                            return "Error: Bad latitude";
                        }   
                    } 
                    if (key === "longitude") {
                        if (value < -180 || value > 180) {
                            return "Error: Bad longitude";
                        }
                    }
                }
            },
            customProperty: 'locationPoint',
        });
        
        return Model;
    },
    extendCollection: function(Collection) {        
        _.extend(Collection.prototype, {
            
            // Implement the comparator method.
            comparator : function(Model) {
                var date = new Date(Model.get('date'));
                return -date;
            }
        }); // end extend
        
        return Collection;
    }
}