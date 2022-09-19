const { json } = require("express");
const express = require("express");
const bodyparser = require('body-parser');
const app = express();
const fs = require('fs');

const port = 3000;

app.use(bodyparser.urlencoded({ extended: false }));

app.use(bodyparser.json())


app.post("/checkAvailability", (req, res) => {
    console.log(req.body);
    let rawData = fs.readFileSync('resource.json');
    let resources = [];
    resources = JSON.parse(rawData);
    console.log(resources);

    for (let resorce of resources) {
        for (slots of resorce.busySlots) {
            let date = new Date(req.body.fromDate);

            const start = new Date(slots.startTime);
            const end = new Date(slots.endTime);


            if (date > start && date < end) {
                console.log('Resource not Available');
            } else {

                console.log('Resource available');
            }
        }
    }
});


app.post("/bookSlot", (req, res) => {
    console.log(req.body);
    let responseobj = {
        resourceData: []
    }

    fs.readFile('resource.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            responseobj = JSON.parse(data);
            responseobj.resourceData.push({ resource: req.body.resourceId, busySlots: [req.body.startTime, req.body.endTime] });
            let json = JSON.stringify(responseobj);
            fs.writeFile('resource.json', json, 'utf8');
        }
    });
});

app.listen(port, () => {
    console.log("Listening to the request ", port);
})