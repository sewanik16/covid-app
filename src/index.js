const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { connection } = require('./connector')

app.get("/totalRecovered",(req,res)=>{
    let total = 0
    connection.find().then((data)=>{
       data.map((record)=>{
        total += record.recovered
       })
       res.status(200).json({data:{__id:"total",recovered:total}})
    })
})
app.get("/totalActive",(req,res)=>{
    let active = 0
    connection.find().then((data)=>{
       data.map((record)=>{
        active += (record.infected - record.recovered)
       })
       res.status(200).send({data:{__id:"total",active:active}})
    })
})
app.get("/totalDeath",(req,res)=>{
    let deaths = 0
    connection.find().then((data)=>{
       data.map((record)=>{
        deaths += record.death
       })
       res.status(200).send({data:{__id:"total",death:deaths}})
    })
})
app.get("/hotspotStates",(req,res)=>{
    let rec = []
    connection.find().then((data)=>{
       data.map((record)=>{
        if((record.infected-record.recovered)/record.infected > 0.1)
        rec.push({state:record.state,rate:((record.infected-record.recovered)/record.infected).toFixed(5)})
       })
       res.status(200).send({data:rec})
    })
})
app.get("/healthyStates",(req,res)=>{
    let rec = []
    connection.find().then((data)=>{
       data.map((record)=>{
        if(record.death/record.infected < 0.005)
        rec.push({state:record.state,mortality:(record.death/record.infected ).toFixed(5)})
       })
       res.status(200).send({data:rec})
    })
})


app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;