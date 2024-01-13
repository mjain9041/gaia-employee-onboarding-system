const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    firstName: {
        type: String,
        required: [false, "First name is required"],
        trim: true,
        minlength: 2,
        maxlength: 15,
        default: ""
    },
    lastName: {
        type: String,
        required: [false, "Last name is required"],
        default: ""
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already exists!"],
        // unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
        minlength: 3,
        maxlength: 100,
        default: ""
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Delete'],
        default: "Active"
    },
}, {
    timestamps: true
});
module.exports = mongoose.model("Employee", employeeSchema, "Employees");