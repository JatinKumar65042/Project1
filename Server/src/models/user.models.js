const { mongoose, Schema } = require("mongoose");

const userSchema = new Schema({
    username : {
        type: String,
        required : [true , "username is required"],
        // unique: true,
        trim: true
    },
    email: {
        type: String,
        required : [true , "email is required"],
        unique: true,
        lowercase: true,
        trim : true,
        // validate: {
        //     validator: function (email) {
        //         return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
        //     },
        //     message: "Invalid email format. Please enter a complete email."
        // }
        match: [ /^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format" ]
    },
    age: {
        type: Number,
        // required : [true , "Age is required"],
        min : [0 , "Age cannot be negative"],
        max : [150 , "Age is not defined"],
    },
    password: {
        type: String,
        required : [true , "Password is required"],
    },
    avatar : {
        type: String,
        default : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT53amOASh6bWQsY-uCLtDjqnm9QizAhU7N4g&s"
    },
    role : {
        type : String,
        enum : ["USER" , "ADMIN"],
        default : "USER",
    },
    subscription: {
        id : String,
        status : String,
    }

} , {timestamps : true})

module.exports = mongoose.model('User' , userSchema) ;