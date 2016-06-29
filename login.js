(function () {

  'use strict';
  
  var nodeInstagram = require('./lib/instagram');
  var read = require('read');
   
  read({prompt: 'Username: '}, function(err, username) {
    read({prompt: 'Password: ', silent: true}, function(err, password) {
      nodeInstagram.login(username, password).then(function(output) {
        console.log(output)
      }).fail(function(err) {
        console.log(err)
      })
    })
  })

}());
