// import mongoose from "mongoose";

// const useSchema=new mongoose.Schema(
//     {
//         firstName:{
//             type:String,
//             required:true
//         },
//         lastName:{
//             type:String,
//             required:true
//         },
//         emailId:{
//             type:String,
//             required:true,
//             // here i have set email as primary key 
//             unique:true
//         },
//         password:{
//             type:String,
//             required:true
//         },
//         isAdmin:{
//             type:Boolean,
//             default:false
//         }
//     },
//     {
//         timestamps:true
//     }
// )
// const user=new mongoose.model('user',useSchema);
// export default user;
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  emailId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
