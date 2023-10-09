const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const User = require('./schema/user')


//const multer = require('multer');
//const path = require('path');

const upload = require('./function/multerconfig')
//const storage = multer.memoryStorage();
//const upload = multer( {storage} )
const Shopkeeper = require('./schema/shopkeeper'); // Import your User model
const authenticateToken = require('./function/auth');
const shopkeeper = require('./schema/shopkeeper');

const secretKey = 'my_secret_key';

const app = express();
const PORT = 3000;


// Middleware


app.use(express.json());
app.use(bodyParser.json())

app.use(express.urlencoded({ extended: true }))


// Start the server


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// Connect to the MongoDB database


mongoose.connect('mongodb+srv://prasathdongame:prasathdongame@cluster0.mvzxacl.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });


//middleware function for jwt


app.get('/', (req, res) => {
  res.json('hello dragon'),
    console.log('hello');

});



//create a shopkeeper for register


app.post('/shopkeeper/register', async (req, res) => {
  try {
    console.log(req.body);
    const shopkeeperCreate = await Shopkeeper({

      shopname: req.body.shopname,
      ownername: req.body.ownername,
      email: req.body.email,
      password: req.body.password,
      mobile: req.body.mobile,
      address: req.body.address

    }).save()
    res.status(200).json(shopkeeperCreate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// shopkeeper for login


app.post('/shopkeeper/login', async (req, res) => {
  try {
    const shopkeeperCreate = await Shopkeeper.findOne({
      email: req.body.email,
      password: req.body.password,
    });

    const token = jwt.sign({ _id: shopkeeperCreate._id, email: shopkeeperCreate.email }, secretKey);
    res.status(200).json({ token: token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


//shopkeeper for update record


app.post('/shopkeeper/update', authenticateToken, async (req, res) => {
  try {
    const shopkeeperCreate = await Shopkeeper.updateOne({
      _id: req._id
    }, {
      $set: {
        shopname: req.body.shopname,
        address: req.body.address
      }
    })
    res.status(200).json(shopkeeperCreate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


//add shopkeeper product for laptop


app.post('/shopkeeper/product/laptop/add', authenticateToken, async (req, res) => {
  try {
    //const shopkeeperId = req._id;
    const shopkeeperCreate = await Shopkeeper.updateOne({
      _id: req._id,
      //email: req.email
    }, {
      $push: {
        'products.laptop': {
          laptopname: req.body.laptopname,
          modelno: req.body.modelno,
          systemInformation: req.body.systemInformation,
        },
      },
    },
      { new: true });

    res.status(200).json(shopkeeperCreate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// set operator to use laptop update


app.post('/shopkeeper/product/laptop/set', authenticateToken, async (req, res) => {
  try {
    const shopkeeperCreate = await Shopkeeper.findOneAndUpdate(
      {
        _id: req._id,
        'products.laptop._id': req.body._id // Replace 'products.[0]_id' with 'products.computer._id'
      },
      {
        $set: {
          'products.laptop.$.laptopname': req.body.laptopname,
          //'products.laptop.$.modelno': req.body.modelno,
          //'products.laptop.$.systemInformation': req.body.systemInformation,

        },
      },


      {
        new: true,
      }
    );

    res.status(200).json(shopkeeperCreate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


//add shopkeeper product for computer


app.post('/shopkeeper/product/computer/add/', authenticateToken, async (req, res) => {
  try {
    const shopkeeperCreate = await Shopkeeper.updateOne({
      _id: req._id,
      //'products.computer._id':req.body._id,
    }, {
      $push: {
        'products.computer': {
          monitor: req.body.monitor,
          keyboard: req.body.keyboard,
          cpu: req.body.cpu,
          mouse: req.body.mouse,
        },
      },
    },
      { new: true }
    );
    res.status(200).json(shopkeeperCreate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


//set operator to use computrer object update


app.post('/shopkeeper/product/computer/set', authenticateToken, async (req, res) => {
  try {
    const shopkeeperCreate = await Shopkeeper.findOneAndUpdate(
      {
        _id: req._id,
        'products.computer._id': req.body._id // Replace 'products.[0]_id' with 'products.computer._id'
      },
      {
        $set: {
          'products.computer.$.monitor': req.body.monitor,
          //'products.computer.$.keyboard': req.body.keyboard,
          //'products.computer.$.mouse': req.body.mouse,
          //'products.computer.$.cpu': req.body.cpu,
        },
      },

      {
        new: true,
      }
    );

    res.status(200).json(shopkeeperCreate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


//remove shopkeeper product for laptop


app.post('/shopkeeper/product/laptop/del', authenticateToken, async (req, res) => {
  try {
    const shopkeeperCreate = await Shopkeeper.findOneAndUpdate({
      _id: req._id
    }, {
      $pull: {
        'products.laptop': {
          laptopname: req.body.laptopname,
          modelno: req.body.modelno,
          systemInformation: req.body.systemInformation,
        },

      },
    });

    res.status(200).json(shopkeeperCreate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


//remove shopkeeper product for computer


app.post('/shopkeeper/product/computer/del', authenticateToken, async (req, res) => {
  try {
    const shopkeeperCreate = await Shopkeeper.findOneAndUpdate({
      _id: req._id
    }, {
      $pull: {
        'products.computer': {
          monitor: req.body.monitor,
          keyboard: req.body.keyboard,
          cpu: req.body.cpu,
          mouse: req.body.mouse,
        }
      }
    });

    res.status(200).json(shopkeeperCreate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


//list for shopkeeper


app.post('/shopkeeper/list', authenticateToken, async (req, res) => {
  try {
    const shopkeeperList = await Shopkeeper.find({
      _id: req._id
    });

    res.status(200).json(shopkeeperList);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


//list only laptop object from shopkeeper


app.post('/shopkeeper/list/laptop', authenticateToken, async (req, res) => {
  try {
    const shopkeeperList = await Shopkeeper.findOne({
      _id: req._id
    }, {
      "products.laptop": 1
    });
    console.log(shopkeeperList);

    res.status(200).json({ message: "listlaptop successfully", data: shopkeeperList.products.laptop });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


//list only computer object from shopkeeper


app.post('/shopkeeper/list/computer', authenticateToken, async (req, res) => {
  try {
    const shopkeeperList = await Shopkeeper.findOne({
      _id: req._id,
    },
      {
        'products.computer': 1
      });
    console.log(shopkeeperList)
    res.status(200).json(shopkeeperList.products.computer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


//delete for shopkeeper


app.post('/shopkeeper/del', authenticateToken, async (req, res) => {
  try {
    const shopkeeperdel = await Shopkeeper.deleteOne(
      {
        _id: req._id
      }
    );
    res.status(200).json(shopkeeperdel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//shopkeeper for label


app.post('/shopkeeper/labels', authenticateToken, async (req, res) => {
  try {
    const shopkeeperLabel = await Shopkeeper.findOneAndUpdate({
      _id: req._id
    }, {
      $push: { labels: { label: req.body.label } }
    }, {
      new: true,
    });
    res.status(200).json(shopkeeperLabel)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
});


//upload the images 

/*
const storage = multer.diskStorage({
  destination: './uplaod/images',
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
  }
})


const upload = multer({
  storage: storage
})
*/
//app.use('/profile', express.static('uplaod/images'));


app.post('/upload', authenticateToken, upload/*.single('profile')*/, async (req, res) => {
  //console.log(req.file);
  try {
    const shopkeeperCreate = await Shopkeeper.updateOne({
      _id: req._id
    }, {
      $set: {
        image: {
          data: req.file.filename,
          //data: req.file.buffer,    buffer for memorystorage       
          contentType: req.file.mimetype
        },
      },
    });

    console.log(req.file.buffer)
    res.status(200).json({
      message: "upload successfully", shopkeeperCreate,/* binarydata:req.file.buffer*/
      // profile_url: `http://localhost:3000/profile/${req.file.filename}`
    });
  }
  catch (error) {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
  }
});
      

//User routes

app.post('/users', async (req, res) => {
  try {
    const userCreate = await User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      mobile: req.body.mobile
    }).save()
    res.status(200).json(userCreate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


//Route for User Login


app.post("/users/login", async (req, res) => {
  try {
    const userCreate = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    const token = jwt.sign({ _id: userCreate.id, email: userCreate.email }, secretKey);
    res.status(200).json({ token: token });
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
});


//user details are list


app.post('/users/list', authenticateToken, async (req, res) => {
  try {
    const userList = await User.find({
      _id: req._id,
    });

    res.status(200).json(userList);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// delete user 


app.post('/users/delete', authenticateToken, async (req, res) => {
  try {
    const user = await User.deleteOne(
      {
        _id: req._id
      }
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//show all the user


app.get('/users/listall', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//User to upload label


app.post('/users/labels', authenticateToken, async (req, res) => {
  try {
    const usersLabel = await User.findOneAndUpdate({
      _id: req._id
    }, {
      $push: { labels: { label: req.body.label } }
    });
    res.status(200).json(usersLabel)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
});


//both user and shopkeeper label to apply


app.post('/shopkeeper/users/label/anothermethod', async (req, res) => {
  try {
    const { userId, shopkeeperId } = req.body;
    const { userLabels, shopkeeperLabels} = req.body.label


    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.labels = userLabels;

    await user.save();


    const shopkeeper = await Shopkeeper.findById(shopkeeperId)
    if (!shopkeeper) {
      return res.status(404).json({ error: 'User not found' });
    }
    shopkeeper.labels = shopkeeperLabels;
    await shopkeeper.save();

    res.status(200).json({ message: 'label added successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});

// another method


app.post('/shopkeeper/users/label', async (req, res) => {
  try {
    //const{userId,shopkeeperId,userLabels,shopkeeperLabels} = req.body;

    const user = await User.findOneAndUpdate(
      { _id: req.body._id },
      { $push: { labels: { label: req.body.label } } }
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
     


    await user.save();



    const shopkeeper = await Shopkeeper.findOneAndUpdate(
      { _id: req.body._id },
      { $push: { labels: { label: req.body.label } } }
    );
    if (!shopkeeper) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    await shopkeeper.save();

    res.status(200).json({ message: 'label added successfully' , user, shopkeeper})
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});