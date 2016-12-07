var fs = require('fs');
var SQL = require('sql.js');
var naturalSort = require('natural-sort');
var filebuffer = fs.readFileSync('./trac.db');

// Load the db
var db = new SQL.Database(filebuffer);
var date = new Date();

var today = date.toISOString().split('T')[0];
var tickieCustom = db.exec('SELECT * FROM ticket_custom WHERE value != ""')[0].values;
var tickets = compareDate(tickieCustom);

console.log(today);
console.log(tickets);

function convertDateForm(arr) {
  var dateArr = arr.split('-');  //date format = MM-DD-YYYY
  var date = [dateArr[2], dateArr[0], dateArr[1]].join('-');  //convert to YYYY-MM-DD
  return date;
}

function compareDate(obj) {
  var d0 = [];
  var d3 = [];
  var d7 = [];
  var d30 = [];
  var far = [];
  for(var i in obj) {
    var ticketDate = convertDateForm(obj[i][2]);
    if(ticketDate >= today) {
      var timeDiff = (new Date(ticketDate).getTime() - new Date(today).getTime());
      var daysDiff = Math.ceil(timeDiff / (1000 * 24 * 60 * 60));
      if(daysDiff === 0) {
        d0.push([obj[i][2], obj[i][0]]);
      }
      if(3 >= daysDiff && daysDiff > 0) {
        d3.push([obj[i][2], obj[i][0]]);
      }
      if(7 >= daysDiff && daysDiff > 3) {
        d7.push([obj[i][2], obj[i][0]]);
      }
      if(30 >= daysDiff && daysDiff > 7) {
        d30.push([obj[i][2], obj[i][0]]);
      }
      if(daysDiff > 30) {
        far.push([obj[i][2], obj[i][0]]);
      }
    }
  }
  return {
    d0: d0.sort(naturalSort()),
    d3: d3.sort(naturalSort()),
    d7: d7.sort(naturalSort()),
    d30: d30.sort(naturalSort()),
    far: far.sort(naturalSort())
  };
}
