var express = require('express');
var router  = express.Router();

var Type    = require('./../models/Type');

router.get("/new", (req, res)=>{
    res.render("types/new.html");
});

router.post("/add", (req, res)=>{
    // traitement du nom
    var firstLetter = req.body.name.charAt(0).toUpperCase(); // premier caratère du nom en majuscule
    var otherLetter = req.body.name.substring(1, (req.body.name.length));
    var name = firstLetter + "" + otherLetter; 

    var color = req.body.color.toLowerCase();

    var type  = new Type();
    type.name   = name;
    type.color  = color;
    
    type.save();
    
    res.redirect("/");
});

router.get('/:type', (req, res)=>{
    Type.findOne({name: req.params.type}).populate('pokemons').then(type => {
        //vérification si le type existe
        if(!type) return res.status(404).send("Type introuvable");

        res.render('types/show.html', {
            type: type,
            pokemons: type.pokemons
        });
    });
});

module.exports = router;