const jwt=require("jsonwebtoken");

const auth=async (req,res,next)=>{
    try{
        const token =req.cookies.jwt
        jwt.verify(token,"mynameispradeepsinghnegiengineerbyprofession");
        next();
    }catch(err){
        res.status(401).send(err)
        console.log(err);
    }
}


module.exports=auth;