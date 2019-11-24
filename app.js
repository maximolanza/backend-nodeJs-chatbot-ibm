



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

var express = require('express');
var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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


var server = app.listen(8080, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://localhost:%s",port)
})