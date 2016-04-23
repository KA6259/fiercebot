var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();
var messaging_events;

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


// this loads index
app.get('/', function(request, response) {
  response.render('pages/index')
});


var token = "CAADVqZBlMB7kBABZCm7XXBYPRYt7Y6tlFeNdMPuGGjtsvEwhfIWFgZAucqPMlGvqXBXD3QBh5LAsK5pFDQkZBKqH0HYriex58W6hVgyJ5W7RjDkFrqWwkcQR9qt135JibBJfdXNgubLHoT0KH6cFM9EnZCBE2gsKu7emZAMOQ040Ev2PFI7HDTbm72qgYJyiUZD";


// this is for fb messenger
app.get('/webhook', function (req, res) {
  console.log('WEBHOOK works')
  if (req.query['hub.verify_token'] === 'LUKzfBrS') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
})


function sendTextMessage(sender, text) {
  messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}


// handle messages from FB Messenger
app.post('/webhook/', function (req, res) {
  console.log(req.entry[0]);
  messaging_events = req.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      sendTextMessage(sender, "Text received, echo: "+ text.substring(0, 200));
    }
  }
  res.sendStatus(200);
});


// app.get('/cool', function(request, response) {
//   response.send(cool());
// });

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
