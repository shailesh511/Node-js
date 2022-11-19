const mongoose = require("mongoose")
const {MONGO_URL} = process.env;

let connectionCode = mongoose.connect((MONGO_URL, { useNewUrlParser:true, useUnifiedTopology:true} ))
                                    .then(console.log("DB connected"))
                                    .catch(err => {
                                        console.log("Connection Failed!!!",err)
                                        console.log(err)
                                        process.exit(1)
                                    })

exports.connect = () => { connectionCode }