const mongoose=require('mongoose');

const demoauth='mongodb+srv://pradeepnegi:pradeep1997@cluster0.gvz7j.mongodb.net/demoauth?retryWrites=true&w=majority';

mongoose.connect(demoauth,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log('connection successfull');
}).catch((err)=>console.log(err));