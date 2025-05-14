import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema({

    name:{
      type:String,
      required:true
    },
    phone:{
      type:String,
      required:true
    },
   email:{
      type:String,
      required:true    },
    address:{
      type:String,
      required:true
    },
    experience:{
      type:String,
      required:true
    },
    education :{
      type:String,
      required:true
      },
    summary :{
      type:String,
      required:true
    },
    skills:{
      type:String,
      required:true
    },
    image:{
      type:String,
      required:true
    },
    profession :{
      type:String,
      required:true
    },
    specialization:{
      type:String,
      required:true
    },
    Branch:{
      type:String,
      required:true
    },
      password: { 
    type: String, 
    required: true 
  },
    role: { 
    type: String, 
    enum: ['client', 'doctor', 'admin'], 
    default: 'doctor'
  },
});

export default mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema);