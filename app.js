const express = require('express')
var cron = require('node-cron');
const cors = require('cors');
const app = express()
app.use(cors());
const port = 3000
var sunsetData = require('./sunsetData.json');
getAllSunsets(sunsetData).then(() => {
    console.log(sunsetData.length);
});

cron.schedule('0 0 * * *', () => {    
    console.log("running task")
    //get sunset data from database
    getAllSunsets(sunsetData).then(() => {
        console.log(sunsetData.length);
    });
  });


app.get('/', (req, res) => {
    res.send(sunsetData);
  })
  
  app.listen(port, () => {
    console.log(`sunset time app listening on port ${port}`)
  })

  async function getAllSunsets(sunsetData){
    for(let i = 0; i < sunsetData.length; i++){
        let sunsetTime = await getSunsetTime(sunsetData[i].Latitude, sunsetData[i].Longitude);
        sunsetData[i].SunsetTime = sunsetTime;
    }
  }

  async function getSunsetTime(latitude, longitude){
    let sunsetTime = await fetch(`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}`)
    .then(response => response.json())
    .then(data => {
        return data.results.sunset;
    })
    return(sunsetTime);
}

