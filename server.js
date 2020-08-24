var express = require('express');
var app = express();
var Pool = require('pg').Pool;
var morgan = require('morgan');
var bodyParser = require('body-parser');




app.use(bodyParser.json());


var config = {
  user: 'postgres',
  database: 'postgres',
  host: 'localhost',
  port: '5432',
  password: 'qwerty'
}

var pool = new Pool(config)
app.use(morgan('combined'));
app.get('/',function(req,res){

  res.send("hi ");
});

app.get('/index',function(req,res){
  res.sendFile(__dirname+ '/index.html');
});

app.get('/get_hello',function(req,res){
  res.json({
     key:'hi',
     value: "this is value"
  });
});

app.post('/get_hello',function(req,res){

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
var port = 8080;
app.listen(port,function(){
  console.log(`First App is listenting on ${port} `);
});