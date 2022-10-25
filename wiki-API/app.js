//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const mongoAtlasUri = "mongodb+srv://janeyears:password@cluster0.efhqumo.mongodb.net/wikiDB";


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

try {
    mongoose.connect(
        mongoAtlasUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        () => console.log("Mongoose is connected")
    );

} catch (err) {
    console.log("could not connect");
}

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);




////// Requests targeting all articles ///////

app.route("/articles")
    .get(function (req, res) {
        Article.find(function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })
    .post(function (req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function (err) {
            if (!err) {
                res.send("Successfully added a new article");

            } else {
                res.send(err);
            }
        });
    })
    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            if (!err) {
                res.send("Successully deleted all articles");
            } else {
                res.send(err);
            }
        });
    });


////// Requests targeting a specific article ///////

app.route("/articles/:articleTitle")
    .get(function (req, res) {
        Article.findOne({
            title: req.params.articleTitle
        }, function (err, foundArticle) {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No article with matching title was found");
            }
        });
    })
    .put(function (req, res) {
        Article.replaceOne({
            title: req.params.articleTitle
        }, {
            title: req.body.title,
            content: req.body.content
        }, {
            overwrite: true
        }, function (err) {
            if (!err) {
                res.send("Successfully updated articles");
            } else {
                res.send(err);
            }
        });
    })
    .patch(function (req, res) {
        Article.updateOne({
            title: req.params.articleTitle
        }, {
            $set: req.body
        }, function (err) {
            if (!err) {
                res.send("Successfully updated the article");
            } else {
                res.send(err);
            }
        });
    })
    .delete(function (req, res) {
        Article.deleteOne({
            title: req.params.articleTitle
        }, function (err) {
            if (!err) {
                res.send("Successfully deleted the article");
            } else {
                res.send(err);
            }
        });
    });


app.listen(3000, function () {
    console.log("Server started on port 3000");
});