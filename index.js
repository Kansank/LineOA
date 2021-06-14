'use strict';

const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: "pSzZCtZWH0mlSlcKkMXUI1sXxSBg7vI9PZjTKXlP/6USTXkrn03HvSTn4IyljnSRkdZ6sfqsVCNBOQZTurcMVYkNT+5mc96lcnlMJaPQdjRvBVS4tPxQi8fU2BlGFQAsRhCaF2BIm4pbiUA2B4iFewdB04t89/1O/w1cDnyilFU=",
  channelSecret: "7f37c054c8e7a6108d581b7b956e46db",
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // create a echoing text message
  const echo = { type: 'text', text: event.message.text };

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
