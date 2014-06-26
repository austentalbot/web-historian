var fs = require('fs');
var path = require('path');
var request=require('request');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback){
  //Read /archives/sites.txt using fs.readFile
  //Use the callback to return an array of the urls
  var fileName = path.join(process.cwd(), '../archives', 'sites.txt');
  fs.readFile(fileName,function(err,data){
    if(err){
      throw err;
    } else {
      var urls = data.toString().split('\n');

      callback(urls);
    }
  });
};

// exports.isUrlInList = function(testUrl, callback){

// };

exports.addUrlToList = function(testUrl){
  exports.readListOfUrls(function(urls){
    if (urls.indexOf(testUrl)===-1) {
      fs.appendFile(exports.paths.list, testUrl+'\n', function (err) {
        if (err) {
          throw error;
        }
      });
    }
  });
};

exports.isUrlArchived = function(url,callback){
  //create path name from url
  //check to see if path name exists in sites
    //use fs.exists to check to see if file is in folder
  var present=false;
  console.log("In isURLArchived",url)
  var fileName=path.join(process.cwd(), '../archives/sites', url);
  fs.exists(fileName, function(exists) {
    if (exists) {
      present=true;
    }
    callback(present);
  });

};

exports.downloadUrl = function(url){
  var fileName=path.join(process.cwd(), '../archives/sites', url);
  request('http://'+url).pipe(fs.createWriteStream(fileName));
};

