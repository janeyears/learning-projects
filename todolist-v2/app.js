//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const mongoAtlasUri = "mongodb+srv://janeyears:<password>@cluster0.efhqumo.mongodb.net/todolistDB";
const _ = require("lodash");


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

const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Buy food"
});

const item2 = new Item({
  name: "Cook food"
});

const item3 = new Item({
  name: "Eat food"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/", function (req, res) {

  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Items successfully added!");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: "Today",
        newListItems: foundItems
      });
    }
  });
});

app.get("/:customListName", function (req, res) {


  const customListName = _.capitalize(req.params.customListName);

  List.findOne({
    name: customListName
  }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items
        });
      }
    }
  });


});

app.post("/delete", function (req, res) {
  const checkedItemID = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemID, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Work done successfully!");
        res.redirect("/");
      }
    });
  } else {
    List.findOne({
      name: listName
    }, function (err, foundList) {
      foundList.items.pull({
        _id: checkedItemID
      });
      foundList.save(function () {

        res.redirect("/" + listName);
      });
    });
  }


});


app.post("/", function (req, res) {

  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({
    name: itemName
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listName
    }, function (err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }

});

let port = process.env.PORT;

app.listen(port || 3000, function () {
  console.log("Server has started Successfully on dynamic port ");
});