const multer = require('multer');


//const Storage = multer.memoryStorage({
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