

var express = require('express');
var app = express();
var nodemailer = require('nodemailer');

var server = app.listen(process.env.PORT || 8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://localhost:%s",port)
})




app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://maximolanza.herokuapp.com"); // update to match the domain you will make the request from
  //res.header("Access-Control-Allow-Origin", "http://localhost:4200"); // update to match the domain you will make the request from
 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/test', function(req, res) {
  res.send("Hola mundo!");
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
   // console.log(res);
    sendMessage({
      message_type: 'text',
      text: '' // iniciar conversación con mensaje vacío
    });
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
     // console.log(err); // algo ha ido mal
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
  })/*.then(res  => {
    respuesta= res;
  });*/;
  var textoRespuesta;
respuestas.forEach( item => {
  textoRespuesta = textoRespuesta + srt + '<br>' +  item + '<br>';
})
 // res.send(respuestas.toString());
  //console.log(respuestas.toString());
  //Enviar lista de mensajes
  //res.send(textoRespuesta);
  res.send(respuesta);

    //res.send(srt + 'Sesion obtenida' + SESSIONID_temp);
  });


  /* Node Mailer */


 
  
 


  app.get('/mail/:mailtext', function(req, res) {
    var mailtext = req.params.mailtext;
    console.log("Mensaje a procesar: "+ mailtext);


    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mlmailsender@gmail.com',
        pass: 'TheBestPassword!'
      }
    });

    var mailOptions = {
      from: 'mlmailsender@gmail.com',
      to: 'max.slanza@gmail.com',
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

 
  console.log(this.mail,this.mensaje);

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mlmailsender@gmail.com',
        pass: 'TheBestPassword!'
      }
    });

    var mailOptions = {
      from: 'mlmailsender@gmail.com',
      to: 'max.slanza@gmail.com',
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
/* Dynamic routes setup for express server*/

 if(process.env.NODE_ENV === 'production'){
  //set static folder
  app.use(express.static('client/build'));
}
app.get('*',(req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});