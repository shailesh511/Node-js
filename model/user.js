const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
      firstName:{
        type: String,
        default: null
      },
      lastName: {
        type: String,
        unique: true
      },
      email: {
        type: String,
        unique: true,
        required: [true, "Please enter email!!"]
      },
      password: {
        type: String,
      },
      token: {
        type:String
      }

})

module.exports = mongoose.model("user", userSchema)
//Here "users" will be used as a name for schema and saved