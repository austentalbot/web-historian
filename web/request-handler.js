var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs=require('fs');
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
  console.log("In handle Request Function");
  var headers=require('./http-helpers.js').headers;

  //req==OPTIONS
  //req==POST
  //if req is in sites
  //if req is archived
  var statusCode;
  headers['Allow'] = "HEAD, GET, PUT, DELETE, OPTIONS";
  if (req.method==='OPTIONS') {
    res.writeHead(200, headers)
    res.end();
  } else if (req.method==='POST') {
    //check to see if url is in file
    //  if in file archived, serve up archive
    //  else, send to waiting page and add to file

    var message;
    req.on('data', function(chunk) {
      message= JSON.parse(chunk.toString());

      archive.isUrlArchived(message, function(present) {
        if (present) {
          //serve up html
          res.writeHead(200, headers);
          var fileName=path.join(process.cwd(), '../archives/sites', message);
          var fileStream = fs.createReadStream(fileName);
          fileStream.pipe(res);

        } else {
          //check if site site is in list
          //  if site not in list, add to list
          //redirect to loading.html
          archive.addUrlToList(message);

          //mysql test
          connection.connect();
          var queryString = 'SELECT * FROM museum';
          connection.query(queryString, function(err, rows,field){
            if (err){
              throw err;
            }
            console.log("Rows",rows);
            // console.log("Field",field);
            for (var i=0; i<rows.length; i++) {
              console.log('Address: ', rows[i]['ADDRESS']);
            }
          });

          connection.end();
          //end mysql test
          res.writeHead(200, headers);
          var fileName=path.join(process.cwd(), '../web/public', 'loading.html');
          var fileStream = fs.createReadStream(fileName);
          fileStream.pipe(res);
        }

      });

    });
  }




  // res.end(archive.paths.list);
};
