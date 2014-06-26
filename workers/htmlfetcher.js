// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.
var helper=require('../helpers/archive-helpers.js');
console.log("Running htmlFetcher func");
//look at each site in sites.txt
//check if site is archived
//if not archived, archive sites

//go home


// readListOfUrls
helper.readListOfUrls(function(urls){

  console.log("URL Array is ",urls);
  for(var i=0; i<urls.length-1;i++){
    var url=urls[i];
    //wrap in anonymous function to maintain value of url despite async calls
    (function(u) {
      console.log("Looping through URL ",u);
      helper.isUrlArchived(u,function(present){
        // console.log(arguments);
        // console. log("Finding URL ",u,present);
        if(!present){
          helper.downloadUrl(u);
        }
      });
    })(url);
  }
});
  // isUrlArchived
  // downloadUrl
