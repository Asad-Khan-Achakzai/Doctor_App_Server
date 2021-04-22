const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const serviceProvider = new Schema({
    id: {
        type: Number,
        unique: true,
        sparse: true
    },
    shortID: {
        type: String
    },
    username: {
        type: String
    },
    phone: {
        type: String
    },
    cnic: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        sparse: true
    },
    password: {
        type: String
    },
    companyName: {
        type: String
    },
    officeLocation: {
        type: String
    },
    servicesArray: {
        type:Array,
        id: {
            type: String
        },
        timing: {
            type: String
        },
        totalSeats: {
            type: Number
        },
        availableSeats: {
            type: Number
        },
        priceperSeat: {
            type: Number
        },
        departure: {
            type: String
        },
        destination: {
            type: String
        },
        bookedSeats: {
            type: Array,
            default:[]
        },
        paused:{
            type:Boolean
        }
    },
    citiesArray: {
        type: Array
    },
    imageUrl: {
        type: String
    },
    rank: {
        type: Number 
    },
    voters: {
        type: Number 
    },
    //routes: Array
});
serviceProvider.plugin(mongoosePaginate);

serviceProvider.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.password;
    return obj;
}
// User.index({'$**': 'text'});
module.exports = mongoose.model("serviceProviders", serviceProvider);
// const serviceProvider = new Schema({
//     id: {
//         type: Number,
//         unique: true,
//         sparse:true
//     },
//      username: {
//         type: String
//     },
//     phone: {
//         type: String
//     },
//     cnic: {
//         type: String
//     },
//      email: {
//         type: String,
//         unique: true,
//         sparse:true
//     },
//      password: {
//         type: String
//     },
//     companyName: {
//         type: String
//     },
//     officeLocation: {
//         type: String
//     },
//     citiesArray: {
//         type: Array
//     },
//     servicesArray: {
//         type: Array
//     },

//     //routes: Array
// });
// serviceProvider.plugin(mongoosePaginate);

// serviceProvider.methods.toJSON = function() {
//     var obj = this.toObject();
//     delete obj.password;
//     return obj;
//    }
// // User.index({'$**': 'text'});
// module.exports = mongoose.model("serviceProviders", serviceProvider);