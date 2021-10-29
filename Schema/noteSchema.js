const mongoose=require('mongoose');

const notesSchema=new mongoose.Schema({
    Heading:{
        type:String
    }, 
    Description:{
        type:String
    }, 
    Creation_Date:{
        type:String
    },
    settings:{
        type: Object
    }
})

const notesmodel=mongoose.model('NotedData',notesSchema);

module.exports=notesmodel;