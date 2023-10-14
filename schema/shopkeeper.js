const mongoose = require("mongoose");


const shopkeeperSchema = mongoose.Schema({
  shopname: {
    type: String,
  },
  ownername: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  mobile: {
    type: String,
  },
  address: {
    type: String,
  },
  image: {
    data: String,
    contentType: String,
  },
  labels: [{
    label: {
      type: String
    },
  }],
  products: {
    laptop: [{
      laptopname: {
        type: String,
      },
      modelno: {
        type: String,
      },
      systemInformation: {
        type: String,
      },
      label:[{
        type: String
      }]
    }], // Define laptop as an array of laptopSchema objects
    computer: [{
      monitor: {
        type: String,
      },
      keyboard: {
        type: String,
      },
      cpu: {
        type: String,
      },
      mouse: {
        type: String,
      },
      label:[{
        type: String,
      }]
    }], // Define computer as an array of computerSchema objects
  },
});

module.exports = mongoose.model("Shopkeeper", shopkeeperSchema);

