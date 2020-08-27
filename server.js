var express = require('express');
var app = express();
var Pool = require('pg').Pool;
var morgan = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
const {
  SESSION_NAME='sid'
} =process.env

var config = {
  user: 'postgres',
  database: 'postgres',
  host: 'localhost',
  port: '5432',
  password: 'qwerty'
}

app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: false,
    saveUninitialized: true,
    name: SESSION_NAME, 
    saveUninitialized: false,
    cookie:{
      maxAge:1000*60*60,
      sameSite :true
    }
}));
const redirectLogin = function(req,res,next){
 
  if(!req.session.userId)
  {
    console.log(req.session);
    res.redirect('/login');
  }
  else{
    next();
  }
}
const redirectHome = function(req,res,next){
  if(req.session.userId)
  {
    res.redirect('/index');
  }
  else{
    next();
  }
}

var pool = new Pool(config)
app.use(morgan('combined'));

app.get('/',function(req,res){
  res.send(`
    <h1>Welcome to the webpage</h1>
    <hr>
    <a href="/login">Login </a>
  `);
});

app.get('/login',redirectHome,function(req,res){

  res.sendFile(__dirname+'/login.html');
});

app.post('/login',function(req,res){
  const { login ,password}=req.body
  console.log(login);
  console.log(password);
  if (!login || !password) {
    res.send("Enter both the fields!!");
  
  }
  else if (login == "admin" && password == "qwerty")
  {
    req.session.user = "admin";
    req.session.userId = 1;
    req.session.admin = true;
    res.redirect(301, 'http://localhost:8080/index');
  }
  else{
    res.send("Login Failed!!");
  }

});




app.get('/index',redirectLogin,function(req,res){
  res.sendFile(__dirname+ '/index.html');
});

app.get('/get_hello',redirectLogin,function(req,res){
  res.json({
     key:'hi',
     value: "this is value"
  });
});

app.post('/get_hello',redirectLogin,function(req,res){

  console.log("Hello from gethello");
  console.log(req.body);
  var x1 = req.body.value1;
  var x2 = req.body.value2;
  var x3 = req.body.value3;
  var x4 = req.body.value4;
  var x5 = req.body.value5;

  console.log(x1);
  var weights = [2, 3, 45, 12, 15, 12];
  var total = weights[0]+x1*weights[1]+x2*weights[2]+x3*weights[3]+x4*weights[4]+x5*weights[5];
  console.log(String(total));
  res.json({result: total});
  

})

app.get('/checkdb',function(req,res){
  pool.query('select * from weights',function(err,result){
    if(err)
    {
      res.send('error happened');
    }
    else
    {
      data = result.rows[0];
      console.log(data['weight1']);
      res.send(result.rows[0]);
    }
  })
})

app.get('/logout', function (req, res) {
 /* req.session.destroy(function(err){
    if(err){
       console.log(err);
    }else{

        res.clearCookie(SESSION_NAME);
        res.redirect(301, 'http://localhost:8080');
    }
 });*/

//res.clearCookie(SESSION_NAME);
req.session.destroy(function(err){
console.log('error part');
res.redirect(301,'/');
});


 
});
var port = 8080;
app.listen(port,function(){
  console.log(`First App is listenting on ${port} `);
});