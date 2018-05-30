var pokedex = require('./pokedex.json');
var types = require('./types.json');

var MongoClient = require('mongodb').MongoClient;
var liPokemon = [];

MongoClient.connect("mongodb://localhost:27017/pokedex", (err, db) => {
    // récupération de tous les documents de la collection " types"
    db.db("pokedex").collection("types").find({}).toArray((err, result) => {
        // on boucle sur chaque objet dans le tableau pokedex
        pokedex.forEach(pokemon => {
            var name = pokemon.ename;
            var number = pokemon.id;
            var liType = [];
            var picture = "";

            // correspondance entre le(s) type(s) du pokemon et ceux dans la collection
            pokemon.type.forEach((pokemonType) => {
                result.forEach((type) => {
                    // si le type de pokémon est trouvé, on assigne la valeur de _id pour la persistance du pokemon après
                    if (pokemonType == type.cname) {
                        liType.push(type._id);
                    }
                });
            }); // pokemon.type.forEach

            // nom du fichier image du pokemon. Exception pour le numero 083
            picture = pokemon.id != "083" ? pokemon.id + name + ".png" : pokemon.id + "Farfetchd" + ".png";

            var currentPokemon = {
                "name": name,
                "number": number,
                "picture": picture,
                "description": "",
                "types": liType
            };

            liPokemon.push(currentPokemon);

        }); // pokedex.foreach

        //persistance dans la base
        if (err) { return console.dir(err); }

        var collection = db.db("pokedex").collection("pokemons");

        collection.insert(liPokemon, (err, result) => {
            if (err) throw err;
            console.log('done');
        });
    }); //type.toarray

}); // mongoclient.connect