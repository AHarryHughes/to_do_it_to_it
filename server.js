const express = require('express');
const Mustache = require('mustache-express');
const bodyParser = require('body-parser');
const postgres = require('pg');
const sequelize = require('sequelize');

const models = require("./models");

var application = express();
application.engine('mustache', Mustache());

application.set('views', './views');
application.set('view engine', 'mustache');

application.use(bodyParser.urlencoded({ extended: true }));

var local_model = {}
local_model.todos = []
local_model.dones = []

application.get('/', (request, response) => {
      
      models.todos.findAll().then(function (daTodos) {
        //populate local model w/ accurate data
         local_model.todos = daTodos;
      }).then(function (){
            models.dones.findAll().then(function (daDones) {
                //populate local model w/ accurate data
                  local_model.dones = daDones;
                  response.render('To_Do', local_model);
            });
          });

});

application.post("/", function (request, response) {
  var do_it_to_it = request.body.item

  models.todos.count().then(function (count) {
    let todo = models.todos.build({
      item: do_it_to_it
    });
    todo.save().then(function (new_todo) {
      response.redirect('/');
    });
  });
});

application.post("/:id", function (request, response) {
  //get requested id, add todo id to dones, remove todo id from todo
  var dex = parseInt(request.params.id);
  var item_to_move;
  
  models.todos.findOne({
    where: {
      id: dex
    }
  }).then(function (todo) {
    item_to_move = todo.item;
    models.todos.destroy({
      where: {
        id: dex
      }
    }).then(function(){
      let done = models.dones.build({
        item: item_to_move
      });
      console.log("done built");
      done.save().then(function (new_done) {
          console.log("done save");
          response.redirect('/');
      });
    });
  });

  
});

application.listen(5000);