//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require("https");
var _ = require("lodash");
const {
  lowerCase
} = require("lodash");

const homeStartingContent = "Explore our huge selection of delicious recipe ideas including; easy desserts, delicious vegan and vegetarian dinner ideas, gorgeous pasta recipes, quick bakes, family-friendly meals and gluten-free recipes. And create your owm recipes";
const aboutContent = "Our cookbook is here to help you cook delicious meals with less stress and more joy. We offer recipes and cooking advice for home cooks, by home cooks. Helping create “kitchen wins” is what we’re all about. Simply Recipes was founded in 2003 by Elise Bauer as a home cooking blog to record her favorite family recipes. Today, Simply Recipes has grown into a trusted resource for home cooks with more than 3,000 tested recipes, guides, and meal plans, drawing over 15 million readers each month from around the world. We’re supported by a diverse group of recipe developers, food writers, recipe and product testers, photographers, and other creative professionals.";
const contactContent = "Have something you’d like to let us know? Whether you have a comment on a recipe or an idea to share, we would love to hear from you: contact@ourcookbook.com.";

const app = express();

let posts = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.get("/", function (req, res) {

  res.render("home", {
    startingContent: homeStartingContent,
    posts: posts
  });
});

app.get("/about", function (req, res) {

  res.render("about", {
    aboutUsContent: aboutContent,
  });
});

app.get("/contact", function (req, res) {

  res.render("contact", {
    contactUsContent: contactContent,
  });
});

app.get("/compose", function (req, res) {

  res.render("compose");
});


app.post("/compose", function (req, res) {
  const newRecipe = {
    recipeTitle: req.body.titleText,
    recipeIngredients: req.body.ingredientsText,
    recipeDirections: req.body.directionsText
  };
  posts.push(newRecipe);
  res.redirect("/");
});

app.get("/posts/:title", function (req, res) {

  const requestedTitle = _.lowerCase(req.params.title);

  posts.forEach(post => {

    const storedTitle = _.lowerCase(post.recipeTitle);

    if (storedTitle === requestedTitle) {
      res.render("post", {
        postTitle: post.recipeTitle,
        postIngredients: post.recipeIngredients,
        postDirections: post.recipeDirections

      });
    }
  });
});


app.listen(3000, function () {
  console.log("Server started on port 3000");
});