const mongoose=require('mongoose')

const blogSchema=new mongoose.Schema({
    title:{
        type:String,
        require:[true,'title is require']
    },
    description:{
        type:String,
        require:[true,'descriotion is require']
    },
    image:{
        type:String,
        require:[true,'image is require']
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        require:[true,'user id is require'],
    },
    
    
},{timestamps:true})

const blogModel=mongoose.model('Blog',blogSchema)

module.exports=blogModel