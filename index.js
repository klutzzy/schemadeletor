// index.js
const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;
dates=[]
ws=null
ids=[]
combinedData=""
map=null
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/submit-api', async (req, res) => {
  try {
    dates=[]
    ids=[]
    apiData = req.body.apiData;
    const commaIndex = apiData.indexOf(',');
    url = apiData.slice(0, commaIndex);
    url = url.slice(0, -1);
    headerrr = apiData.slice(commaIndex + 1);
    console.log("URLSSS ", url);
    console.log("HEADERSSS ", headerrr);
    headerrr = JSON.parse(headerrr);
    bearer=headerrr.headers.authorization;
    console.log("BEARER ",bearer)

    const response = await fetch(url, headerrr); // Wait for the fetch to complete
    const data = await response.json(); // Wait for JSON parsing

    for (const item of data) {
      ws = item.ws + "," + item.id;
      ids.push(ws);
      const dateTime = item.dateTime;
      const timeZone = 'Europe/Bucharest'; // GMT+2

      const date = new Date(dateTime);
      date.setMinutes(date.getMinutes() - 60);
      const options = { timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZoneName: 'short' };

      formattedDate = date.toLocaleString('en-US', options);
      formattedDate = formattedDate.slice(0, -9);
      dates.push(formattedDate);
      console.log(formattedDate);
      
       combinedData = { dates, ids, bearer };
    }
    
    // handle the submitted API data
    console.log("Sending response to the client...");
    
    res.send(JSON.stringify(combinedData));
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred.");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
