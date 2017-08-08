var responseTime = require('response-time')
var axios = require('axios');
var redis = require('redis');
var bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

// create a new redis client and connect to our local redis instance
var client = redis.createClient({port: 32768});
// if an error occurs, print it to the console
client.on('error', function (err) {
    console.log("Error " + err);
});



var url = 'http://masrawy.com';
getUrls(url);

function getUrls(url) { 
    return  axios.get(url).then(res=> {
        var urlregex = /<a.+href="(.*?)".*?>(.*?)<\/a>/g;
        var match = urlregex.exec(res.data);
        
        while (match != null) {
            var foundUrl = match[1]
            client.sadd('urls', foundUrl);
            match = urlregex.exec(res.data);
        }
        client.quit();
    });
}

function savefile(name, data) {
    var fs = require('fs');
    fs.writeFile(`downloaded/${name}`, data, function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    }); 

}