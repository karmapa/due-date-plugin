var fs = require('fs');
var SQL = require('sql.js');
var naturalSort = require('natural-sort');
import sendEmail from './sendEmail.js';
var filebuffer = fs.readFileSync('./trac.db');

// Load the db
var db = new SQL.Database(filebuffer);
var date = new Date();

var today = date.toISOString().split('T')[0];
var tickieCustom = db.exec('SELECT * FROM ticket_custom WHERE value != ""')[0].values;

var tickets = compareDate(tickieCustom);
console.log(today);
console.log(tickets);
var htmlText = genHtmlText(tickets);
console.log(htmlText);

//tickets = JSON.stringify(tickets);
sendEmail({from: 'trac@trac.dharma-treasure.org', to: 'rickie120243@gmail.com', subject: 'due date', htmlBody: htmlText, textBody: htmlText});

function genHtmlText(obj) {
  var text = today + ' Trac due day tracker' + '<br/><br/>';
//  console.log(obj['d0'])
  text += 'within ' + '3' + ' days:<br/>';
  obj['d3'].map(function(arr) {
    text += listTickets(arr);
  });
  return text;
}

function genPureText() {

}

function listTickets(arr) {
  var link = '<a href="http://rickie120243.dharma-treasure.org/ticket/' + arr[1] + '">#' + arr[1] + '</a>';
  var text = 'due date: ' + arr[0];
  var title = arr[2];
  return '  ' + link + ': ' + title + '  ' + text + '<br/>';
}

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
      var tickieTitle = db.exec('SELECT summary FROM ticket WHERE id = ' + obj[i][0])[0].values[0][0];
      var timeDiff = (new Date(ticketDate).getTime() - new Date(today).getTime());
      var daysDiff = Math.ceil(timeDiff / (1000 * 24 * 60 * 60));
      if(daysDiff === 0) {
        d0.push([ticketDate, obj[i][0], tickieTitle]);
      }
      if(3 >= daysDiff && daysDiff > 0) {
        d3.push([ticketDate, obj[i][0], tickieTitle]);
      }
      if(7 >= daysDiff && daysDiff > 3) {
        d7.push([ticketDate, obj[i][0], tickieTitle]);
      }
      if(30 >= daysDiff && daysDiff > 7) {
        d30.push([ticketDate, obj[i][0], tickieTitle]);
      }
      if(daysDiff > 30) {
        far.push([ticketDate, obj[i][0], tickieTitle]);
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
