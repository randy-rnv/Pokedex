var type     = require('./types.json');
var color    = require('./color.json');

var MongoClient = require('mongodb').MongoClient;
var liType   = [];
var i = 1;

type.forEach(type => {
    var name    = type.ename;
    var number  = i;

    var currentType = {
        "name": name,
        "color": color[i].hex,
        "cname": type.cname
    };
    
    liType.push(currentType);

    i++;
});

//persistance dans la base

MongoClient.connect("mongodb://localhost:27017/pokedex", (err, db)=>{
    if(err) { return console.dir(err); }

    var collection = db.db("pokedex").collection("types");

    collection.insert(liType, (err, result)=>{
        if(err) throw err;
        console.log('done');
    });  
});


