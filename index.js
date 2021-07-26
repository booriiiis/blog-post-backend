const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const cors = require("cors")
const app = express();
const path = require("path")
app.use(cors())
app.use(bodyParser.json());

const publicVapidKey =
  "BBmjWYs2Zppza9BRJ6u7JWxSx94MdBfZW5qZycSu7fQi27a_fguZ2JgRiCqJx4U81KNCHy42OD4vaF2DWRycufE";
const privateVapidKey = "a9wImWhoMTxmfOKF16rWiJgyL_3vrKRumTTRpsZBA_0";

const arrayOfCards = []
const connectedUsers = []

let _id = 0;

webpush.setVapidDetails(
  "mailto:test@test.com",
  publicVapidKey,
  privateVapidKey
);

app.get('/cards', (req, res) => {
  res.json(arrayOfCards)
})

app.post('/card', (req, res) => {
  const card = {
    id: ++_id,
    ...req.body
  }
  arrayOfCards.push(card)
  res.json(card)
})

app.put('/card/:id', (req, res) => {
  const itemId = req.params.id
  const itemToChange = arrayOfCards.find(el => el.id === parseInt(itemId))
  if (!itemToChange) {
    res.json({
      error: 'Item not found'
    })
  } else {
    itemToChange.title = req.body.title
    itemToChange.subtitle = req.body.subtitle
    itemToChange.content = req.body.content
    itemToChange.img = req.body.img

    res.json(itemToChange)
  }
})

// Subscribe Route
app.post("/subscribe", (req, res) => {
  // Get pushSubscription object
  const subscription = req.body;
  console.log(subscription, 'payload')
  // Send 201 - resource created
  res.status(201).json({});

  // Create payload

  const entry = connectedUsers.find(usr => usr.endpoint === subscription.endpoint)
  if(!entry) {
    connectedUsers.push(subscription)
  }


  // const payload = JSON.stringify({
  //   title: "Successfuly test"
  // });

  const payload = req.body.payload;

  webpush
    .sendNotification(subscription, payload)
    .catch(err => console.error(err));
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post("/sendnotif", (req, res) => {
  console.log("BROADCASTING MSG", req.body)
  connectedUsers.forEach(usr => {
        webpush.sendNotification(usr, JSON.stringify(
        
        req.body

        ))
      })
    res.json({ok: true})
});

// setInterval(() => {
//   connectedUsers.forEach(usr => {
//     webpush.sendNotification(usr, JSON.stringify(
//       {
//         title: 'Lol'
//       }
//     ))
//   })
// }, 3000);

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));