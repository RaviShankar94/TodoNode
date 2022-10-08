//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
var _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//mongodb+srv://ravishankar:<password>@cluster0.3awts.mongodb.net/?retryWrites=true&w=majority
//mongodb+srv://ravishankar:Pypl!1022@cluster0.3awts.mongodb.net/?retryWrites=true&w=majority
// mongoose.connect("mongodb://localhost:27017/todolistDB");
mongoose.connect(
  "mongodb+srv://ravishankar:Pypl!1022@cluster0.3awts.mongodb.net/todolistDB"
);
const itemsSchema = new mongoose.Schema({
  page: String,
  name: String,
});

const Item = mongoose.model("Item", itemsSchema);

// const buyFoodItem = new Item({ name: "Buy Food" });
// const cookFoodItem = new Item({ name: "Cook Food" });
// const eatFoodItem = new Item({ name: "Eat Food" });

// Item.insertMany([buyFoodItem, cookFoodItem, eatFoodItem], function (err) {});

app.get("/", function (req, res) {
  res.redirect("/Today");
});
app.get("/:todoPage", function (req, res) {
  // const day = date.getDate();
  const todoPage = req.params.todoPage;
  Item.find({ page: todoPage }, function (err, items) {
    items.forEach(item => console.log(item.name));
    if (!err) {
      res.render("list", {
        listTitle: todoPage,
        newListItems: items,
      });
    } else {
      console.error(err);
    }
  });
});

app.post("/", function (req, res) {
  const item = req.body.newItem;
  const page = req.body.list;
  console.log("Insert " + page + " " + item);
  const list = new Item({ name: item, page: page });
  list.save();
  res.redirect("/" + page);
});

app.post("/delete", function (req, res) {
  console.log("Deleting " + req.body.checkbox);
  Item.findByIdAndRemove({ _id: req.body.checkbox }, function (err) {
    if(err){
      console.error(err);
    }
  });
  const page = req.body.page;
  res.redirect("/" + page);
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
