const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const Doctor = new Schema({
    id: {
        type: Number,
        unique: true,
        sparse:true
    },
     username: {
        type: String
    },
    phone: {
        type: String
    },
    fee: {
        type: String
    },
    cnic: {
        type: String
    },
     email: {
        type: String,
        unique: true,
        sparse:true
    },
     password: {
        type: String
    },
    imageUrl: {
        type: String
    },
    shortID: {
        type: String
    },
    designation: {
        type: String
    },
    specialities: {
        type: String
    },
    location: {
        type: String
    },
    city: {
        type: String
    },
    timing: {
        type: Object
    },  
    is_deleted: {
        type: Number,
        default: 0
    }
});
Doctor.plugin(mongoosePaginate);
Doctor.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    return obj;
   }
// User.index({'$**': 'text'});

module.exports = mongoose.model("doctors", Doctor);