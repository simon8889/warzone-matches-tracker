const fetch = require("node-fetch");
var express = require('express');
var router = express.Router();


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
                "x-rapidapi-key": "d170cf1b2cmshc0dd66768bea07ap19708ajsnd4b02c59dbbd",
                "x-rapidapi-host": "call-of-duty-modern-warfare.p.rapidapi.com"
            }
        })
        .then(response => response.json())
        .then(response => res.json(response))
        .catch(err => console.error(err));
    });

module.exports = router;
