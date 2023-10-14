const mongoose = require('mongoose');

/*const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    
  },
  city: {
    type: String,
    
  },
  state: {
    type: String,
    
  },
  postalCode: {
    type: String,
    
  }
});*/

const user_schema = new mongoose.Schema({
  name: {
    type: String
    
  },
  
  email: {
    type: String
    
  },
  password: {
    type: String
    
  },
  mobile: {
    type: String
    
  },
  comment:[{
    type: String,
  }],
  labels:[{
    label:{
    type: String,
    unique: true,
    },
}],
  /*address:[
    {
    street:{
      type:String
    },
    place:{
      type:String
    }, 
    
  }]*/
});

module.exports = mongoose.model('User', user_schema);


