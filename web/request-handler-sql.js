var archive = require('../helpers/archive-helpers');
var mysql = require('mysql');

var connection = mysql.createConnection(
    {
      host     : 'localhost',
      user     : 'root',
      password : 'qwerty',
      database : 'museum',
    }
);

exports.handleRequest = function (req, res) {
  var headers=require('./http-helpers.js').headers;
  var statusCode;
  headers['Allow'] = 'HEAD, GET, PUT, DELETE, OPTIONS';

  if (req.method==='OPTIONS') {
    res.writeHead(200, headers)
    res.end();
  } else if (req.method==='POST') {
    //if message key in database has corresponding HTML file
    //  serve up txt html page
    //else if key not in database
      //add to database
    req.on('data', function(chunk) {
      var message= JSON.parse(chunk.toString());
      connection.connect();

      var queryString = 'select HTML from museum where address="'+message+'";';
      connection.query(queryString, function(err, results){
        if (err) {
          throw err;
        }
        if (results.length!==0 && results!==undefined && results[0]['HTML']!=='' && results[0]['HTML']!==null) {
          // serve up html
          console.log('Serving up HTML');
          res.writeHead(200, headers);
          res.end(results[0]['HTML'].toString());
          connection.end();
        } else {
          var qstring = 'select count(*) as COUNT from museum where address="'+message+'";';
          connection.query(qstring,function(err,results){
            if (err) {
              throw err;
            }
            if(!results[0]['COUNT']) {
              var queryString = 'insert into museum (address) values ("'+message+'");';
              connection.query(queryString, function(err, rows, field){
                if (err){
                  throw err;
                }
                console.log('Added url');
                connection.end();
              });
            } else {
              console.log('Already stored in DB');
              connection.end();
            }
          });
        }
      });
    });
  }


};
