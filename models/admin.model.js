const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const Admin = new Schema({
     id: {
        type: String
    },
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    phone: {
        type: String
    }
});

Admin.plugin(mongoosePaginate);

module.exports = mongoose.model("Admins", Admin);