import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  profilePhoto: {
     type: String,
     required: false
     },
  userName: { 
    type: String, 
    required: true, 
    trim: true
 },
  email: { 
    type: String, 
    required: true, 
    unique: true,
     trim: true
     },
  phoneNumber: {
     type: String,
     required: true,
      trim: true
     },
  address: {
     type: String, 
     required: true, 
     trim: true 
    },
  town: {
     type: String, 
     required: true, 
     trim: true
     },
});

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
