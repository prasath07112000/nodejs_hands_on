const multer = require('multer');


//const Storage = multer.memoryStorage({       //data: req.file.buffer,    buffer for memorystorage     
const Storage = multer.diskStorage({
    //destination: './uplaod/images',
    destination: (req,file,cb)=>{
        cb(null, './uplaod/images',)
      },
    filename: (req,file,cb)=>{
        cb(null, file.fieldname + Date.now() + file.originalname)
    }, 
});

const upload = multer({ storage: Storage }).single('profile');

module.exports = upload;