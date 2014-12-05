var request = require('request');
var url="http://en.wikipedia.org/wiki/United_States_presidential_election,_2012";
// request(url, function (error, response, body) {
//   if (!error && response.statusCode == 200) {
//     console.log(body);
//   }
// })
function formatState(state){
  return state['name']+","+state['obama']+","+state['romney'];
}
var jsdom = require("jsdom");
//gets 1.11
jsdom.env(
  url,
  ["http://code.jquery.com/jquery.js"],
  function (errors, window) {
    var $=window.$;
    var $tds = $('body table.sortable  tr td');
    var states=[];
    //console.log($('html').html());
    //console.log("Length",$tds.length);
    //Only want 50 states + DC. 15 cols per state
    var k=0;
    var thisstate=null;
    for (var i=0;i<51*15; i++){
      if (i % 15 === 0) {
        //console.log("State", $($tds[i]).text());
        states[k]={};
        thisstate = states[k];
        thisstate['name'] = $($tds[i]).text().trim();
      } else if (i % 15 === 3){
        thisstate['obama'] = $($tds[i]).text().trim().replace('%','');
      } else if (i % 15 === 5){
        thisstate['romney'] = $($tds[i]).text().trim().replace('%','');
        k = k+1;
      }
    }

    for (var j=0;j<states.length;j++){
         console.log(formatState(states[j]));
    }
  }
);
