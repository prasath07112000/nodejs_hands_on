const jwt = require("jsonwebtoken");
const secretKey = 'my_secret_key';

const authenticateToken = (req,res,next)=>{
    const authheader = req.header('authorization');
    const token = authheader && authheader.split(' ')[1];
    if(!token)
        return res.status(401);
    try{
   const tokenResult = jwt.verify(token, secretKey)
   if(tokenResult)
   {
    req._id=tokenResult._id,
    req.email=tokenResult.email
    next();
   }
   else{
    res.status(500).json({error:'not valid token'});
   }
   }catch(error){
    return res.status(401).json({ error: 'Token verification failed' });
   }
}
   module.exports = authenticateToken; 