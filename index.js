const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const User = require('./schema/user')
const date = require('date-and-time');
const moment = require('moment');

//------------router------------
const userRoute = require ("./routers/userRoute")
const shopkeeperRoute = require("./routers/shopkeeperRoute")
const usershopkeeperRoute = require("./routers/usershopkeeperRoute")

//const multer = require('multer');
//const path = require('path');

const upload = require('./function/multerconfig')
//const storage = multer.memoryStorage();
//const upload = multer( {storage} )
const Shopkeeper = require('./schema/shopkeeper'); // Import your User model
const calculationResult = require('./schema/calculationResult');
const authenticateToken = require('./function/auth');
const calculateIntervals = require('./function/date&time');
const shopkeeper = require('./schema/shopkeeper');

const secretKey = 'my_secret_key';

const app = express();
const PORT = 3000;


// Middleware


app.use(express.json());
app.use(bodyParser.json())

app.use(express.urlencoded({ extended: true }))

app.use("/users", userRoute);
app.use("/shopkeeper", shopkeeperRoute, usershopkeeperRoute)

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


//--------------------another route only shopkeeper to product count update-----------------

app.post("/shopkeeper/update-laptop-count", async (req, res) => {
  try {
    const { shopkeeperId, laptopName, increment, decrement } = req.body;

    // Update the shopkeeper's laptop count accordingly
    const shopkeeper = await Shopkeeper.findOneAndUpdate(
      { _id: shopkeeperId, "products.laptop.laptopName": laptopName },
      {
        $inc: {
          "products.laptop.$[elem].count": increment ? 1 : decrement ? -1 : 0,
        },
      },
      {
        new: true,
        arrayFilters: [{ 'elem.laptopName': laptopName }],
      }
    );

    res.status(200).json({ message: "Product count updated successfully", shopkeeper });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//--------------user&shopkeeper to count---------------


app.post("/shopkeeper/user/update-laptop-count", async (req, res) => {
  try {
    const { userId, shopkeeperId, laptopName, increment, decrement } = req.body;

    // Update the user's laptop count (decrement if decrement is true, increment if increment is true)
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $inc: {
          //"products.laptop.$[element].count": increment ? 1 : decrement ? -1 : 0,
        },
      },
      
    );

    // Update the shopkeeper's laptop count accordingly
    const shopkeeper = await Shopkeeper.findOneAndUpdate(
      { _id: shopkeeperId, "products.laptop.laptopName": laptopName },
      {
        $inc: {
          "products.laptop.$[element].count": increment ? 1 : decrement ? -1 : 0,
        },
      },
      {
        new: true,
        arrayFilters: [{ "element.laptopName": laptopName }],
      }
    );

    res.status(200).json({ message: "Product count updated successfully", user, shopkeeper });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//--------------another method for count route----------------

app.post("/shopkeeper/user/update-laptop-count2", async (req, res) => {
  try {
    const { userId, laptopName, increment, decrement } = req.body;

    // Update the user's laptop count (decrement if decrement is true, increment if increment is true)
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $inc: {
          //"products.laptop.$[element].count": increment ? 1 : decrement ? -1 : 0,
        },
      },
      
    );

    // Update the shopkeeper's laptop count accordingly
    const shopkeeper = await Shopkeeper.findOneAndUpdate(
      {  "products.laptop.laptopName": laptopName },
      {
        $inc: {
          "products.laptop.$[element].count": increment ? 1 : decrement ? -1 : 0,
        },
      },
      {
        new: true,
        arrayFilters: [{ "element.laptopName": laptopName }],
      }
    );

    res.status(200).json({ message: "Product count updated successfully", user, shopkeeper });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ---------------another method for count if and else conditions------------------- 


app.post("/shopkeeper/user/update-laptop-countifelse", async (req, res) => {
  try {
    const { userId, laptopName, action } = req.body;
    let incrementValue = 0;

    if (action === "increment") {
      incrementValue = 1;
    } else if (action === "decrement") {
      incrementValue = -1;
    }

    // Update the user's laptop count
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $inc: {
          //"products.laptop.$[elem].count": incrementValue
        },
      },
      {
        new: true,
        //arrayFilters: [{ "elem.laptopName": laptopName }],
      }
    );

    // Update the shopkeeper's laptop count accordingly
    const shopkeeper = await Shopkeeper.findOneAndUpdate(
      {  "products.laptop.laptopName": laptopName },
      {
        $inc: {
          "products.laptop.$[elem].count": incrementValue
        },
      },
      {
        new: true,
        arrayFilters: [{ "elem.laptopName": laptopName }],
      }
    );

    res.status(200).json({ message: "Product count updated successfully", user, shopkeeper });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//---------------another-------------------


app.post("/shopkeeper/update-laptop-count2", async (req, res) => {
  try {
    const {userId, laptopName } = req.body;

    const user = await User.findById(userId);

    // Find the shopkeeper
    const shopkeeper = await Shopkeeper.findOne({ "products.laptop.laptopName": laptopName });

    if (!shopkeeper) {
      res.status(404).json({ error: "Shopkeeper not found" });
      return;
    }

    // Get the current count of the laptop for the shopkeeper
    const shopkeeperLaptopCount = shopkeeper.products.laptop.find(product => product.laptopName === laptopName).count;

    // Check if there are enough products in stock to decrement
    if (shopkeeperLaptopCount <= 0) {
      res.status(400).json({ error: "Not enough products in stock" });
      return;
    }

    // Calculate the new shopkeeper's laptop count (decrement)
    const newShopkeeperLaptopCount = shopkeeperLaptopCount - 1;

    // Update the shopkeeper's laptop count
    const laptopIndex = shopkeeper.products.laptop.findIndex(product => product.laptopName === laptopName);
    shopkeeper.products.laptop[laptopIndex].count = newShopkeeperLaptopCount;

    await shopkeeper.save();

    res.status(200).json({ message: "Shopkeeper's product count updated successfully", user, shopkeeper });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// startDate and endDate

app.post('/date-range', (req, res) => {
  const startDate = "20231001";
  const endDate = "20231130"; 
  const interval = "7";

  // Ensure that the required parameters are provided
  if (!startDate || !endDate || !interval) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  // Parse the input dates
  const parsedStartDate = date.parse(startDate, 'YYYY-MM-DD');
  const parsedEndDate = date.parse(endDate, 'YYYY-MM-DD');

  if (!parsedStartDate || !parsedEndDate) {
    return res.status(400).json({ error: 'Invalid date format' });
  }

  // Calculate the interval dates
  const intervalDates = [];
  let currentDate = parsedStartDate;

  while (currentDate <= parsedEndDate) {
    intervalDates.push(date.format(currentDate, 'YYYY-MM-DD'));
    currentDate = date.addDays(currentDate, parseInt(interval, 10));
  }

  res.json({ intervalDates });
});

//startDate=2023-01-01&endDate=2023-02-28

app.post('/date-range/2', (req, res) => {
  const startDate = "2023-11-03";
  const endDate = "2023-11-30";

  // Ensure that the required parameters are provided
  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  // Parse the input dates using JavaScript's Date object
  const parsedStartDate = new Date(startDate);
  const parsedEndDate = new Date(endDate);

  // Check if the parsed dates are valid
  if (isNaN(parsedStartDate) || isNaN(parsedEndDate)) {
    return res.status(400).json({ error: 'Invalid date format' });
  }

  // You can perform any required date operations here

  // For example, you can calculate the difference in days
  const daysDifference = Math.floor(
    (parsedEndDate - parsedStartDate) / (1000 * 60 * 60 * 24)
  );
  
  res.json({ daysDifference });
  console.log("daysDifference:",daysDifference);
});

// // another method 2

// app.post('/date-range/3', (req, res) => {
//   const startDate = "2023/11/03";
//   const endDate = "2023/11/30";

//   // Ensure that the required parameters are provided
//   if (!startDate || !endDate) {
//     return res.status(400).json({ error: 'Missing parameters' });
//   }

//   // Parse the input dates using JavaScript's Date object
//   //const parsedStartDate = new Date(startDate);
//   //const parsedEndDate = new Date(endDate);

//   // Check if the parsed dates are valid
//   if (isNaN(startDate) || isNaN(endDate)) {
//     return res.status(400).json({ error: 'Invalid date format' });
//   }

//   // You can perform any required date operations here

//   // For example, you can calculate the difference in days
//   const daysDifference = Math.floor(
//     (endDate - startDate) / (1000 * 60 * 60 * 24)
//   );

//   res.json({ daysDifference });
// });



// start date and time and end date and time 


app.post('/calculateDuration', (req, res) => {
  try{
  const { startDate, endDate, startTime, endTime } = req.body;

  // Validate input
  if (!startDate || !endDate || !startTime || !endTime) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Assuming date and time are in ISO format
  const startDateTime = new Date(`${startDate}T${startTime}`);
  const endDateTime = new Date(`${endDate}T${endTime}`);

  // Calculate duration
  const duration = endDateTime - startDateTime;

  // Return the result
  res.json({ duration: duration });
} catch (error) {
  res.status(400).json({ error: error.message });
}
});


//another method


app.post('/calculateDuration/1', (req, res) => {
  try {
    const { startDate, endDate, startTime, endTime, duration } = req.body;

    // Validate input
    if (!startDate || !endDate || !startTime || !endTime || !duration) {
      throw new Error('Missing required fields');
    }

    // Convert date and time strings to Date objects
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    // Calculate duration in milliseconds
    const durationInMilliseconds = duration * 60 * 1000; // Convert duration to milliseconds

    // Split time range into 30-minute intervals
    const intervals = [];
    let currentDateTime = startDateTime;

    while (currentDateTime < endDateTime) {
      const nextDateTime = new Date(currentDateTime.getTime() + 30 * 60000); // 30 minutes in milliseconds
      intervals.push({
        start: currentDateTime.toISOString(),
        end: nextDateTime.toISOString(),
      });
      currentDateTime = nextDateTime;
    }

    // Return the result
    res.json({ intervals });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


//another method 2


app.post('/calculateDuration/2', (req, res) => {
  try {
    const { startDate, endDate, startTime, endTime, duration } = req.body;

    // Validate input
    if (!startDate || !endDate || !startTime || !endTime || !duration) {
      throw new Error('Missing required fields');
    }

    // Convert date and time strings to Date objects
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    // Debugging: Log the start and end date times
    console.log('Start DateTime:', startDateTime);
    console.log('End DateTime:', endDateTime);


    // Calculate duration in milliseconds
    const durationInMilliseconds = duration * 60 * 1000; // Convert duration to milliseconds

    // Split time range into 30-minute intervals
    const intervals = [];
    let currentDateTime = startDateTime;

    while (currentDateTime < endDateTime) {
      const nextDateTime = new Date(currentDateTime.getTime() + 30 * 60000); // 30 minutes in milliseconds
      intervals.push({
        startDate: currentDateTime.toISOString().split('T')[0],
        startTime: currentDateTime.toISOString().split('T')[1].slice(0, -8),
        endDate: nextDateTime.toISOString().split('T')[0],
        endTime: nextDateTime.toISOString().split('T')[1].slice(0, -8),
      });
      currentDateTime = nextDateTime;
    }

    // Return the result
    res.json({ intervals });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// another method 3

app.post('/calculateDuration/3', (req, res) => {
  try {
    const { startDate, endDate, startTime, endTime, duration } = req.body;

    // Validate input
    if (!startDate || !endDate || !startTime || !endTime || !duration) {
      throw new Error('Missing required fields');
    }

    // Convert date and time strings to Date objects using moment
    const startDateTime = moment(`${startDate} ${startTime}`, 'YYYY-MM-DD h:mm A');
    const endDateTime = moment(`${endDate} ${endTime}`, 'YYYY-MM-DD h:mm A');

    // Calculate duration in milliseconds
    const durationInMilliseconds = duration * 60 * 1000; // Convert duration to milliseconds

    // Split time range into 30-minute intervals
    const intervals = [];
    let currentDateTime = startDateTime.clone();

    while (currentDateTime.isBefore(endDateTime)) {
      const nextDateTime = currentDateTime.clone().add(30, 'minutes');
      intervals.push({
        startDate: currentDateTime.format('YYYY-MM-DD'),
        startTime: currentDateTime.format('h:mm A'),
        endDate: nextDateTime.format('YYYY-MM-DD'),
        endTime: nextDateTime.format('h:mm A'),
      });
      currentDateTime = nextDateTime;
    }

    // Return the result
    res.json({ intervals });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// another method 4

app.post('/calculateDuration/4', (req, res) => {
  try {
    const { startDate, endDate, startTime, endTime, duration, breakDuration } = req.body;

    // Validate input
    if (!startDate || !endDate || !startTime || !endTime || !duration || !breakDuration) {
      throw new Error('Missing required fields');
    }

    // Convert date and time strings to Date objects using moment
    const startDateTime = moment(`${startDate} ${startTime}`, 'YYYY-MM-DD h:mm A');
    const endDateTime = moment(`${endDate} ${endTime}`, 'YYYY-MM-DD h:mm A');

    // Calculate duration in milliseconds
    const durationInMilliseconds = duration * 60 * 1000; // Convert duration to milliseconds
    const breakDurationInMilliseconds = breakDuration * 60 * 1000; // Convert break duration to milliseconds

    // Split time range into intervals with breaks
    const intervals = [];
    let currentDateTime = startDateTime.clone();

    while (currentDateTime.isBefore(endDateTime)) {
      const nextDateTime = currentDateTime.clone().add(duration, 'minutes');
      intervals.push({
        startDate: currentDateTime.format('YYYY-MM-DD'),
        startTime: currentDateTime.format('h:mm A'),
        endDate: nextDateTime.format('YYYY-MM-DD'),
        endTime: nextDateTime.format('h:mm A'),
      });
      console.log('interval =',intervals)
      // Add break if not the last interval
      if (nextDateTime.isBefore(endDateTime)) {
        const breakStart = nextDateTime.clone();
        const breakEnd = breakStart.clone().add(breakDuration, 'minutes');
        intervals.push({
          startDate: breakStart.format('YYYY-MM-DD'),
          startTime: breakStart.format('h:mm A'),
          endDate: breakEnd.format('YYYY-MM-DD'),
          endTime: breakEnd.format('h:mm A'),
          break: true,
        });
        currentDateTime = breakEnd;
        
      } else {
        currentDateTime = nextDateTime;
      }
      console.log("breakintervals =",intervals)
    }

    // Return the result
    res.json({ intervals });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


//another method 5


app.post('/calculateDuration/5', (req, res) => {
  try {
    const { startDate, endDate, startTime, endTime, duration, breakDuration } = req.body;

    // Validate input
    if (!startDate || !endDate || !startTime || !endTime || !duration || !breakDuration) {
      throw new Error('Missing required fields');
    }

    // Convert date and time strings to Date objects using moment
    const startDateTime = moment(`${startDate} ${startTime}`, 'YYYY-MM-DD h:mm A');
    const endDateTime = moment(`${endDate} ${endTime}`, 'YYYY-MM-DD h:mm A');

    // Calculate duration in milliseconds
    const durationInMilliseconds = duration * 60 * 1000; // Convert duration to milliseconds
    const breakDurationInMilliseconds = breakDuration * 60 * 1000; // Convert break duration to milliseconds

    // Split time range into intervals with breaks
    const intervals = [];
    let currentDateTime = startDateTime.clone();

    while (currentDateTime.isBefore(endDateTime)) {
      const nextDateTime = currentDateTime.clone().add(duration, 'minutes');
      intervals.push({
        startDate: currentDateTime.format('YYYY-MM-DD'),
        startTime: currentDateTime.format('h:mm A'),
        endDate: nextDateTime.format('YYYY-MM-DD'),
        endTime: nextDateTime.format('h:mm A'),
        breakDuration: breakDurationInMilliseconds / (60 * 1000), // Include break duration in minutes
      });

      // Add break if not the last interval
      if (nextDateTime.isBefore(endDateTime)) {
        const breakStart = nextDateTime.clone();
        const breakEnd = breakStart.clone().add(breakDuration, 'minutes');
        intervals.push({
          startDate: breakStart.format('YYYY-MM-DD'),
          startTime: breakStart.format('h:mm A'),
          endDate: breakEnd.format('YYYY-MM-DD'),
          endTime: breakEnd.format('h:mm A'),
          break: true,
          breakDuration: breakDurationInMilliseconds / (60 * 1000), // Include break duration in minutes
        });
        currentDateTime = breakEnd;
      } else {
        currentDateTime = nextDateTime;
      }
    }

    // Return the result
    res.json({ intervals });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// another method using function


app.post('/calculateDuration/6', /*calculateIntervals,*/ async (req, res) => {
  try {
    const { startDate, endDate, startTime, endTime, duration, breakDuration } = req.body;

    // Use the calculateIntervals function
    const result = await calculateIntervals(startDate, endDate, startTime, endTime, duration, breakDuration);
  
    // Send the result back as a response
    res.json(result);
        
  }
  catch (error) {
    res.status(400).json({ error: error.message })
  }
});


// startDate and endDate to store in db


app.post('/calculateDuration/db', /*calculateIntervals,*/ async (req, res) => {
  try {
    const { startDate, endDate, startTime, endTime, duration, breakDuration } = req.body;

    // Use the calculateIntervals function
    const result = await calculateIntervals(startDate, endDate, startTime, endTime, duration, breakDuration);
  
    const newResult = new CalculationResult({
      startDate,
      endDate,
      startTime,
      endTime,
      duration,
      breakDuration,
      calculatedData: result,
      // Other properties from the 'result' object can be added if needed
    }).save();

    //const savedResult = await newResult.save(); // Save the result into the database

    // Send the saved result back as a response
    res.json(newResult);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});




