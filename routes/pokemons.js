var express = require('express');
var router = express.Router();

var Pokemon = require('./../models/Pokemon');
var Type = require('./../models/Type');

// pour la pagination
var numberOfPokemon;
Pokemon.count({}, (err, result) => {
    numberOfPokemon = result;
});

router.get("/", (req, res) => {
    res.redirect("/1");
});

router.get("/:page", function(req, res) {
    //page en cours
    if (!req.params.page) var currentPage = 1;
    else var currentPage = req.params.page;

    var numberOfPage = Math.ceil(numberOfPokemon / 12);
    var skip = currentPage == 1 ? 0 : (currentPage - 1) * 12;

    Pokemon.find({}).populate('types').skip(skip).limit(12).sort("number").then((pokemons) => {
        Type.find({}).then((types) => {
            res.render('pokemons/index.html', {
                pokemons: pokemons,
                types: types,
                numberOfPage: numberOfPage,
                currentPage: currentPage,
            });
        });
    }); // pokemon.find()
}); // router.get("/:page")

router.get("/new/pokemon", (req, res) => {
    Type.find({}).then((types) => {
        var pokemon = new Pokemon();
        res.render('pokemons/edit.html', { pokemon: pokemon, types: types, endpoint: '/' });
    });
});

router.get("/delete/:id", (req, res) => {
    Pokemon.findByIdAndRemove({ _id: req.params.id }).then(() => {
        res.redirect('/');
    });
});

router.get("/edit/:id", (req, res) => {
    Type.find({}).then((types) => {
        Pokemon.findById(req.params.id).then((pokemon) => {
            res.render('pokemons/edit.html', { pokemon: pokemon, types: types, endpoint: '/pokemon/' + pokemon._id.toString() });
        });
    });

});

router.get('/pokemon/:id/:lastPage?', function(req, res) {
    Pokemon.findById(req.params.id).populate('types').then(function(pokemon) {
        res.render('pokemons/show.html', { pokemon: pokemon, lastPage: req.params.lastPage });
    }, function(err) {
        res.status(500).send(err);
    });
});

// le "?" que le paramètre :id est optionnel
router.post('/:id?', (req, res) => {
    new Promise((resolve, reject) => {
        if (req.params.id) {
            Pokemon.findById(req.params.id).then(resolve, reject);
        } else {
            resolve(new Pokemon());
        }
    }).then(pokemon => {
        pokemon.name = req.body.name;
        pokemon.description = req.body.description;
        pokemon.number = req.body.number;
        pokemon.types = req.body.types;

        if (req.file) pokemon.picture = req.file.filename;

        return pokemon.save();
    }).then(() => {
        res.redirect('/');
    });
});

module.exports = router;