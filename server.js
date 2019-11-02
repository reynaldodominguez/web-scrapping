var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");
var PORT = 3000;
var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/hwScraping", { useNewUrlParser: true });

app.get("/scrape", function (req, res) {

    axios.get("https://lapatilla.com").then(function (response) {

        var $ = cheerio.load(response.data);

        var results = [];
        $("div.column").each(function (i, element) {

            var title = $(element).find("h4").text();
            var link = $(element).find("a").attr("href");
            var date = $(element).find("span.post-date").text();
            var resume = $(element).find("p.home-post-excerpt").text();
            var img = $(element).find("img").attr("src");

            if (title != "" && title.length < 110 && resume != "" && link != "") {
                results.push({
                    title: title,
                    link: link,
                    date: date,
                    resume: resume,
                    img: img
                })

            }


        })
        // console.log(results);
        res.json(results);
    })
})

app.post("/articles", function (req, res) {
    // console.log("Working");
    // console.log(req.body);

    db.Article.create(req.body)
        .then(function (dbArticle) {
            res.json(dbArticle);
            // console.log(dbArticle);
        })
        .catch(function (err) {
            console.log(err);
        });
})

app.get("/savedarticles", function (req, res) {
    db.Article.find({})
        .then(function (data) {
            res.json(data);
        })
        .catch(function (err) {
            res.json(err);
        });
})

app.delete("/articles/:id", function(req, res){
    // console.log("Id back end " + req.params.id);

    db.Article.remove({_id: req.params.id})
    .then(function(data){
        res.json(data);
       // console.log("Deleted "+ data);
        
    })
    .catch(function (err) {
        res.json(err);
    });
})

app.post("/articles/:id", function(req, res){
    // console.log("Id back end " + req.params.id);

    db.Note.create(req.body)
    .then(function(dbNote){
        return db.Article.findByIdAndUpdate({_id: req.params.id}, {$push:{note: dbNote._id}}, {new: true});
        
    }).then(function(data){
        res.json(data);
    })
    .catch(function (err) {
        res.json(err);
    });
})

app.get("/articles/:id", function(req, res){
    // console.log("Id back end " + req.params.id);

    db.Article.findOne({_id: req.params.id})

    .populate("note")
    .then(function(data){
        res.json(data);
    })
    .catch(function (err) {
        res.json(err);
    });
})

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});