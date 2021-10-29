const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');

const userData=new mongoose.Schema({
    FirstName:{
        type:String
    },
    LastName:{
        type:String
    },
    Email:{
        type:String
    },
    Contact:{
        type:String
    },
    Password:{
        type:String
    },
    tokens:[{
        token:{
            type:String
        }
    }]
});

//generating token
userData.methods.generateToken = async function(){
    try{
        const token=jwt.sign({_id:this._id},"mynameispradeepsinghnegiengineerbyprofession",{
            expiresIn: 60
        });
        this.tokens=this.tokens.concat({token:token})
        await this.save();
        return token;
    }catch(err){
        res.send("Error"+err);
        console.log("error"+err);
    }
}


const userSignup= mongoose.model('usersignupdata',userData);

module.exports=userSignup;