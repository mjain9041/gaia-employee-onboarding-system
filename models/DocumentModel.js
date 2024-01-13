const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema
const documentSchema = new Schema({
  fileName: {
    type: String,
    required: true
  },
  storageName: {
    type: String,
    required: true
  },
  employeeId: {
    type: Schema.Types.ObjectId, // Assuming employeeId is a string, you can change the type accordingly
    required: true
  }
},  {
timestamps: true
});

// Create the model
module.exports = mongoose.model('Document', documentSchema, "Documents");