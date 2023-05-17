const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  image: {
    type: Buffer,
    required: true
  },
  title: {
    type: String,
    required: true
  }
});

const ImageModel = mongoose.model('Image', imageSchema);

module.exports = ImageModel;
