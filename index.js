var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


// this loads index
app.get('/', function(request, response) {
  response.render('pages/index')
});


// this is for fb messenger
app.get('/webhook', function (req, res) {
  console.log('WEBHOOK works')
  if (req.query['hub.verify_token'] === 'LUKzfBrS') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
})


app.post('/webhook', function (req, res) {
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      // Handle a text message from this sender
    }
  }
  res.sendStatus(200);
});



app.get('/cool', function(request, response) {
  response.send(cool());
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
