(function() {
    var childProcess = require("child_process");
    var oldSpawn = childProcess.spawn;
    function mySpawn() {
        console.log('spawn called');
        console.log(arguments);
        var result = oldSpawn.apply(this, arguments);
        return result;
    }
    childProcess.spawn = mySpawn;
})();


const express = require('express')
const app = express()
const port = 3000

const pageCrawler = require('./pageCrawler');

app.get('/checkwarranty/:serialNumber/:modelNumber', (req, res, next) => {
    var serialNumber = req.params.serialNumber;
    var modelNumber = req.params.modelNumber;

    pageCrawler(serialNumber, modelNumber).then(source => {
        res.send(source);
    }).catch(err => {
        next(err);
    });
    
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})