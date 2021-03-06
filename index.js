var express = require('express');
var bodyParser = require('body-parser');
var request = require("request")

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.json());
// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  if (req.query['hub.verify_token'] === 'LUKzfBrS') {
    res.send(req.query['hub.challenge']);
    console.log("app.get ran")
    res.sendStatus(200)
  }

  console.log("Error: wrong validation token")
})

app.post('/webhook/', function (req, res) {
  messaging_events = req.body.entry[0].messaging;
  console.log("app.post ran")
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      sendTextMessage(sender, text.substring(0, 200) + "!");
    }
  }
  res.sendStatus(200);
});

app.listen(port, function () {
  console.log('Listening on port ' + port);
});

var token = "CAADVqZBlMB7kBAEvCwFCPr7Va2jOFopHOPA4lfIJza7zJBQ5yK9gqKB2lNzKYgymsSEwBno6q03fGNc2IHcTUvu5BuSzhpR4AurZBsQXdr2X1wVooHkwXt1Sq712SsewqrtYh4mTrcUc6MJGTrZBykrCE04E9xTc0N8WhwOOXhde3uCDaMNQh7TMlpgZBwUZD";

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
