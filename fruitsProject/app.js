//jshint esversion:8

const mongoose = require('mongoose');
const mongoAtlasUri = "mongodb+srv://janeyears:janeantto1511@cluster0.efhqumo.mongodb.net/?retryWrites=true&w=majority";

try {
    mongoose.connect(
        mongoAtlasUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        () => console.log(" Mongoose is connected")
    );

} catch (err) {
    console.log("could not connect");
}

const fruitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 10
    },

    review: String
});


const Fruit = new mongoose.model("Fruit", fruitSchema);

const fruit = new Fruit({
    name: "Apple",
    rating: 10,
    review: "Yummy"
});

//fruit.save();

const peopleSchema = new mongoose.Schema({
    name: String,
    age: Number,
    favouriteFruit: fruitSchema
});


const Person = new mongoose.model("person", peopleSchema);

const kiwi = new Fruit({
    name: "Kiwi",
    rating: 3,
    review: "Not pleasant"
});

const banana = new Fruit({
    name: "Banana",
    rating: 8,
    review: "Very good"
});

const orange = new Fruit({
    name: "Orange",
    rating: 6,
    review: "Not bad"
});

/* Fruit.insertMany([kiwi, banana, orange], function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Succesfully saved all the fruits");
    }
}); */



Fruit.find(function (err, fruits) {
    if (err) {
        console.log(err);

    } else {
        mongoose.connection.close();
        fruits.forEach(function (fruit) {
            console.log(fruit.name);
        });
    }
});

const person = new Person({
    name: "Amy",
    age: 15,
    favouriteFruit: orange

});

/* person.save(); */

Person.updateOne({
    name: "John",
}, {
    favouriteFruit: banana
}, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Succesfully updated the document");
    }
});

/* Person.deleteMany({
    name: "John"
}, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Succesfully deleted the document");
    }
}); */