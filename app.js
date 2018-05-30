var express = require('express');
var mongoose = require('mongoose');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
var multer = require('multer');

// multer, module pour gérer l'upload des fichiers
var upload = multer({
    dest: __dirname + "/uploads"
});

//connexion à la base pokedex
mongoose.connect('mongodb://localhost/pokedex');

var app = express();

//utilisation des modules
app.use(upload.single('file')); // en paramètre le nom du champ du formulaire fichier

//chargement des fichiers static avec les middlewares
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/assets', express.static(__dirname + '/assets'));

app.use('/', require('./routes/pokemons'));
app.use('/types', require('./routes/types'));

// pour utiliser les images plus facilement (fichiers static également)
app.use('/uploads/img', express.static(__dirname + "/uploads/img"));

//configuration du moteur de template
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

console.log('pokedex lancé');
app.listen(3000);