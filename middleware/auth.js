
const auth = (req, res, next)=>{
   console.log(req.cookies);
    const {token} = req.cookies;
    console.log(token);
      //if right hand side variable is same like req.body.token 
      //and we are trying to assign to the same variable
      //then we can only write req.body and assign it to same variable name

     // Authorization: "Bearer longtokenvalue"
     // const token = req.header("Authorization").replace("Bearer ", "");    

      //what if token is not here 
      if(!token) {
        return res.status(403).send('token is missing!!!');
      }


      //verify token through jwt
      try{
        const decode = jwt.verify(token, 'shhhhh')
        console.log(decode);

        req.user = decode
        //extract id from token and query the DB
        
      }

      catch(err)
      {
        res.status(401).send("token is invalid!!")
      }
      return next();
}

module.exports = auth