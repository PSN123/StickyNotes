const express=require('express');

const app=express();
const cookieParser=require('cookie-parser');
const auth=require('./middleware/auth');
const cors=require('cors');
const corsOptions ={
    origin:'*', 
    credentials:true,         
    optionSuccessStatus:200,
 }
app.use(cors(corsOptions));

require('./connection');
const userSignup=require('./Schema/userSchema');
const notesmodel=require('./Schema/noteSchema');
app.use(express.json());
app.use(cookieParser())


////////////////////// Notes API////////////////////////////////

app.post('/Notes',async(req,res)=>{
    
    try{
        const {Heading, Description, settings}=req.body;
        const uploadNotes=new notesmodel({Heading, Description,Creation_Date:new Date().toLocaleDateString(),settings});
        await uploadNotes.save();
        res.send(uploadNotes);
    }catch(err){
        console.log(err);
    }

});

app.get('/GetNotes',async(req,res)=>{
    try{
        notesmodel.find({},(err,Notes)=>{
            if(err){
                console.log(err)
            }else{
               // console.log(Notes)
                res.send(JSON.stringify(Notes));
            }
        })
    }catch(err){
        console.log(err)
    }
})

app.get('/GetDatabyId/:id',(req,res)=>{
    const _id = req.params.id;
    try{
        notesmodel.find({_id},(err,datanote)=>{
            if(err){
                console.log(err)   
            }else{
              //  console.log(datanote)
                res.send(JSON.stringify(datanote));
            }
        })
    }catch(err){
        console.log(err)
    }
})


app.delete('/Delete/:id',async(req,res)=>{
    const _id=req.params.id
    console.log(_id)
    try{
        const deleteitem=await notesmodel.findByIdAndDelete({_id})
//console.log(deleteitem)
    }catch(err){
        res.json({message : "Deleted "});
    }

})


app.put('/Updatenotes/:id',async(req,res)=>{
    const _id=req.params.id
    try{
        const updated=await notesmodel.findByIdAndUpdate({_id},req.body)
       // console.log(updated)
        res.send('ok');
    }catch(err){
        console.log(err)
    }
})


//Sorting Data

app.get('/sorteddata/:sortingData/:postPerPage/:currentPage',async(req,res)=>{
    const currentpage=parseInt(req.params.currentPage);
    const name=req.params.sortingData;
    const limit=parseInt(req.params.postPerPage);
    try{
            const sortedData=await notesmodel.find({}).sort({'_id': name==="Descending"? -1: 1}).limit(limit).skip(limit * currentpage)
            const Total_count=await notesmodel.count();
            
            const responseData={
                NotesData:sortedData,
                Total_Record:Total_count
            }
            
            res.json(responseData);
           
    }catch(err){
        console.log(err)
    }
})

//////////////////////// Signup API/////////////////////////////////////////
app.get("/Home",auth,(req,res)=>{
    res.send('Hi i am Home')
    
})


app.post('/Signup',async(req,res)=>{
    const {FirstName,LastName,Email,Contact,Password}=req.body;
    console.log(req.body);
    try{
        const oldUser=await userSignup.findOne({Email});

        if(oldUser){
            res.status(409).send("User Already Exist");
        }else{
        const signupdata=new userSignup({FirstName,LastName,Email,Contact,Password});    
        await signupdata.save();
        res.status(200).json({Success:"Data upload successfully"});
    }
    }catch(err){
        console.log(err);
    }
    // res.send('Home');
})

app.post('/Login',async(req,res)=>{
    const {Email,Password}=req.body;
    try{
        const userCredential=await userSignup.findOne({Email:Email,Password:Password});
        
        if(!userCredential){
            res.status(400).json({error:"invalid credential pass"});
        }else{
            const token=await userCredential.generateToken();
            console.log(token);
            res.cookie("jwt",token,{
                maxAge: 30000,
                httpOnly:true
            });
            res.status(200).json({Message:"Login successfully"});
        }
    }catch(err){
        console.log(err)
    }
})

app.listen(5000, () => {
    console.log("server running at 5000");
});