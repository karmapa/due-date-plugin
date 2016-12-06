var fs = require('fs');
var SQL = require('sql.js');
var filebuffer = fs.readFileSync('./trac.db');

// Load the db
var db = new SQL.Database(filebuffer);
var date = new Date();

var today = date.toISOString().split('T')[0];
var dueDate = db.exec('SELECT * FROM ticket_custom');
var tickets = db.exec('SELECT * FROM ticket');


function convertDateForm() {

}

function compareDate() {

}

console.log(today);
console.log(dueDate);
console.log(dueDate[0].values);
//console.log(tickets[0].columns);
//console.log(tickets[0].values);