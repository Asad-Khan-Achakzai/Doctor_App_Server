const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const Patient = new Schema({
    id: {
        type: Number,
        unique: true,
        sparse:true
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
        sparse:true
    },
     password: {
        type: String
    },
    imageUrl: {
        type: String
    },
    role: {
        type: String
    },
    department: {
        type: String
    },
    designation: {
        type: String
    },
    avatar: {
        type: String
    },
    avatar_ext: {
        type: String
    },
  
    is_deleted: {
        type: Number,
        default: 0
    }
});

Patient.plugin(mongoosePaginate);

Patient.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    return obj;
   }
// User.index({'$**': 'text'});

module.exports = mongoose.model("patients", Patient);