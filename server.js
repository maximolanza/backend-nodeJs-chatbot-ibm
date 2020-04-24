

var express = require('express');
var app = express();
var nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();

process.env.NODE_ENV = 'production';

var server = app.listen(process.env.PORT || 8081, function () {
  var port = server.address().port
  console.log("Example app listening at http://localhost:%s",port)
})

app.use(function(req, res, next) {
  //res.header("Access-Control-Allow-Origin","https://www.maximolanza.uy"); // update to match the domain you will make the request from
  
  res.header("Access-Control-Allow-Origin", "https://www.maximolanza.uy"); // update to match the domain you will make the request from
  
  //res.header("Access-Control-Allow-Origin", "http://localhost:4200"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/test', function(req, res) {
  res.send(__dirname);
});

const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

// Environment variables
const ASSISTANT_ID='7695f8ff-73da-4c06-80d4-189b4033a358'
// You need to provide your IAM API key and URL
const ASSISTANT_IAM_APIKEY='GiVI9_792gLvbz9fGT13LbL9fxe5N56ukrZpsoHfKOBm'
// ASSISTANT_IAM_URL=
const ASSISTANT_URL='https://gateway.watsonplatform.net/assistant/api'
// Configurar el derivador del servicio de asistente.

const service = new AssistantV2({
  version: '2019-11-20',
  authenticator: new IamAuthenticator({
    apikey: ASSISTANT_IAM_APIKEY,
  }),
  url: ASSISTANT_URL,
});

const assistant_Id = ASSISTANT_ID; // sustituir por el ID de asistente
let session_Id;
let respuesta;
var respuestas = [];
// Crear sesión.
service.createSession({
  assistantId: ASSISTANT_ID
})
  .then(res => {
    session_Id = res['result']['session_id'];
    // iniciar conversación con mensaje vacío
   // console.log(res);
    /*sendMessage({
      message_type: 'text',
      text: '' 
    });*/
  })
  .catch(err => {
    console.log(err); // algo ha ido mal
  });

// Enviar mensaje al asistente.
function sendMessage(messageInput) {
  console.log('Sesion' + session_Id);
  service.message({
    assistantId: assistant_Id,
    sessionId: session_Id,
    input: messageInput
    })
    .then(res => {
      processResponse(res);
    })
    .catch(err => {
      console.log(err); // algo ha ido mal
    });


    return new Promise(resolve => {
      setTimeout(() => {
        console.log('Obteniendo respuesta...')
        resolve();
       }, 3500);
    });
}

// Procesar la respuesta.
function processResponse(res) {
  // Mostrar la salida del asistente, si la hay. Solo se admite una única
  // respuesta de texto.
  if (res['result']['output']['generic'][0]['text']) {
    if (res['result']['output']['generic'].length > 0) {
      if (res['result']['output']['generic'][0].response_type === 'text') {
        console.log(res['result']['output']['generic'][0]['text']);
        respuesta = res['result']['output']['generic'][0]['text'];
        respuestas.push(respuesta);
    }
    }
  }


// Hemos terminado, así que cerramos la sesión.
/*service
  .deleteSession({
    assistantId: assistant_Id,
    sessionId: session_Id,
  })
  .catch(err => {
    console.log(err); // algo ha ido mal
  });*/
}


app.get('/api/:msg', function(req, res) {
  var srt = req.params.msg;
  console.log('Mensaje: ' + srt)

  sendMessage({

    message_type: 'text',
    text: srt // iniciar conversación con mensaje vacío
  }).then( () => {
    console.log('then; ' + respuesta);
    res.send(respuesta);
  }
  );
  
  var textoRespuesta;
respuestas.forEach( item => {
  textoRespuesta = textoRespuesta + srt + '<br>' +  item + '<br>';
})
 
  });


  /* Node Mailer */


  app.get('/mail/:mailtext', function(req, res) {
    var mailtext = req.params.mailtext;
    console.log("Mensaje a procesar: "+ mailtext);


    var transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user : process.env.DB_USER ,
        pass : process.env.DB_PASSWORD ,
      }
    });

    var mailOptions = {
      from: process.env.DB_USER,
      to: process.env.DB_USERTO,
      subject: '[WEBCV]',
      html: mailtext
    };

    console.log('Mensaje: ' + mailtext)
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
 });

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
 


 app.post('/send',function(req,res){
  var mail=req.body.mail
  var mensaje=req.body.mensaje;
  var error= false;

 
  console.log(this.mail,this.mensaje);
    /*var dot = '***';
    var name = 'mailsender';
    var first = 'ml';
    var third = 'sender';
    var second = 'mail';
    var really = '@gmail.com';
    var spetial = '!';
    var what = '--';
    var sirious = '++';*/
    var transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user : process.env.DB_USER ,
        pass : process.env.DB_PASSWORD ,
      }
    });

    var mailOptions = {
      from: process.env.DB_USER,
      to: process.env.DB_USERTO ,
      subject: '[CV] ' + mail,
      html: mensaje
    };

    console.log('Mensaje: ' + mail + ' ' + mensaje)
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      error=true;
    } else {
      console.log('Email sent: ' + info.response);
      error=fasle;
    }
  });
  var resJSON = {
   "error": error
  }
  res.send(JSON.stringify(resJSON));
});
 
 
 
 
app.get('/testmail',function(req,res){
  var mail='Test';
  var mensaje='Hi, I am testing my mailing service';

 
  console.log(this.mail,this.mensaje);
   /* var dot = '!!!';
    var name = 'mailsender';
    var first = 'ml';
    var third = 'sender';
    var second = 'mail';
    var really = '@gmail.com';
    var spetial = '*';
    var what = '--';
    var sirious = '++';*/
    //console.log(first+second+third+really);
    //console.log(spetial + dot + name + dot + spetial + what + sirious);
    var transporter = nodemailer.createTransport({
      //service: 'gmail',
      host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
      auth: {
        user: process.env.DB_USER,
        pass: process.env.DB_PASSWORD,
      }
    });

    var mailOptions = {
      from: process.env.DB_USER,
      to: process.env.DB_USERTO,
      subject: '[CV] ' + mail,
      html: mensaje
    };

    console.log('Mensaje: ' + mail + ' ' + mensaje)
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  var resJSON = {
    "mail": mail,
    "mensaje": mensaje
  }
  res.send(JSON.stringify(resJSON));
});
 
 /*
 

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email enviado: ' + info.response);
    }
  });
 });*/


// Dynamic routes setup for express server
app.use('/*',function(req, res) {
  //res.sendfile(__dirname + '/dist/index.html');
  res.send('Hi! Welcome to my NodeJS RestAPI! you can try https://maxibackend.herokuapp.com/api/mensaje');
});