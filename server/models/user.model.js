import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
      },
      password: {
        type: String,
        required:true
        // required: [true, 'Password is required'],
        // minlength: [6, 'Password must be at least 6 characters'],
        // validate: {
        //   validator: function (v) {
        //     return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/.test(v);
        //   },
        //   message: props =>
        //     'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 special character',
        // }
      },
    role:{
        type:String,
        enum:["instructor", "student"],
        default:'student'
    },
    enrolledCourses:[
        {
          type:mongoose.Schema.Types.ObjectId,
          ref:'Course',
        },
    ],
    photoUrl:{
        type:String,
        default:""
    }
},{timestamps:true});

export const User = mongoose.model("User",userSchema); 