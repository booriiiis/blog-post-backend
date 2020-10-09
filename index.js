const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const cors = require("cors")
const app = express();
app.use(cors())
app.use(bodyParser.json());

const publicVapidKey =
  "BJthRQ5myDgc7OSXzPCMftGw-n16F7zQBEN7EUD6XxcfTTvrLGWSIG7y_JxiWtVlCFua0S8MTB5rPziBqNx1qIo";
const privateVapidKey = "3KzvKasA2SoCxsp0iIG_o9B0Ozvl1XDwI63JRKNIWBM";

/*{
    id: 1,
    title: "Title1",
    subtitle: "Subtitle1",
    content: "Content1",
    img: "no-img"
  },
  {
    id: 2,
    title: "Title2",
    subtitle: "Subtitle1",
    content: "Content1",
    img: "no-img"
  },
  {
    id: 3,
    title: "Title3",
    subtitle: "Subtitle1",
    content: "Content1",
    img: "no-img"
  },
  {
    id: 4,
    title: "Title4",
    subtitle: "Subtitle1",
    content: "Content1",
    img: "no-img"
  },
  {
    id: 5,
    title: "Titl5",
    subtitle: "Subtitle1",
    content: "Content1",
    img: "no-img"
  },
  {
    id: 6,
    title: "Title6",
    subtitle: "Subtitle1",
    content: "Content1",
    img: "no-img"
  } */


const arrayOfCards = []

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
  const payload = JSON.stringify({
    title: "Push Test"
  });

  // Pass object into sendNotification
  webpush
    .sendNotification(subscription, payload)
    .catch(err => console.error(err));
});

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));