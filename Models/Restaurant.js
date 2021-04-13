const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const restaurantSchema = new Schema(
    {
        _id : {
            type: String,
            required: true
        },
        name : {
            type: String,
            required: true
        },
        city_name : {
            type: String,
            required: true
        },
        city : {
            type: String,
            required: true
        },
        area : {
            type: String,
            required: true
        },
        locality : {
            type: String,
            required: true
        },
        thumb : {
            type: String,
            required: true
        },
        cost : {
            type: Number,
            required: true
        },
        address : {
            type: String,
            required: true
        },
        contact_number : {
            type: String,
            required: false
        },
        type : [
            {
                mealtype : {
                    type:String,
                    required:true 
                },
                name : {
                    type:String,
                    required:true 
                }
            }
        ],
        Cuisine : [
            {
                cuisine : {
                    type:String,
                    required:true 
                },
                name : {
                    type:String,
                    required:true 
                }
            }
        ]
    }
);

module.exports = mongoose.model('Restaurant', restaurantSchema, 'Restaurant');