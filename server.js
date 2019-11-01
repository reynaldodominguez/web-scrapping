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
        console.log(results);
        res.json(results);
    })
})

app.post("/articles", function (req, res) {
    console.log(req.params);
    
    db.Article.create(req.params)
        .then(function (dbArticle) {
            console.log(dbArticle);
        })
        .catch(function (err) {
            console.log(err);
        });
})

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});