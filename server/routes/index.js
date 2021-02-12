const fetch = require("node-fetch");
const dotenv = require("dotenv");
var express = require('express');
var router = express.Router();

dotenv.config();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send("server")
});

router.route("/getstats")
    .get((req, res) =>{
        return res.send("cod tracker api")
    })
    .post((req,res) => {
        let body = req.body;
        fetch(`https://call-of-duty-modern-warfare.p.rapidapi.com/warzone-matches/${body.user}/${body.platform}`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": process.env.API_KEY,
                "x-rapidapi-host": process.env.API_HOST 
            }
        })
        .then(response => response.json())
        .then(response => res.json(response))
        .catch(err => console.error(err));
    });

module.exports = router;
