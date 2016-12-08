import fs from 'fs';
import SQL from 'sql.js';
import naturalSort from 'natural-sort';
import sendEmail from './sendEmail.js';
const filebuffer = fs.readFileSync('../trac.db');

// Load the db
const db = new SQL.Database(filebuffer);
const date = new Date();

const today = date.toISOString().split('T')[0];
const tickieCustom = db.exec('SELECT * FROM ticket_custom WHERE value != ""')[0].values;

const tickets = compareDate(tickieCustom);
console.log(tickets);
const htmlText = genHtmlText(tickets);

sendEmail({from: '', to: '', subject: 'trac due date', htmlBody: htmlText, textBody: htmlText});

function genHtmlText(obj) {
  let text = today + ' trac due day tracker' + '<br/><br/>';
  for(let key in obj) {
    const dayRange = key.replace('d', '');
    if('far' === dayRange) {
      text += 'more than 30 days:' + '<br/>';
    } else if ('0' === dayRange) {
      text += 'within ' + dayRange + ' day:' + '<br/>';
    } else {
      text += 'within ' + dayRange + ' days:' + '<br/>';
    }
    if (0 === obj[key].length) {
      text += '&nbsp;&nbsp;&nbsp;&nbsp;' + 'none' + '<br/><br/>';
    } else {
      obj[key].map(function(arr) {
        text += listTickets(arr);
      });
    text += '<br/>'
    }
  }
  return text;
}

function listTickets(arr) {
  const link = '<a href="https://trac.dharma-treasure.org/ticket/' + arr[1] + '">#' + arr[1] + '</a>';
  const date = arr[0];
  const title = arr[2];
  return '&nbsp;&nbsp;&nbsp;&nbsp;' + date + '&nbsp;&nbsp;' + link + ':&nbsp;' + title + '<br/>';
}

function convertDateForm(arr) {
  const dateArr = arr.split('-');  //date format = MM-DD-YYYY
  const date = [dateArr[2], dateArr[0], dateArr[1]].join('-');  //convert to YYYY-MM-DD
  return date;
}

function compareDate(obj) {
  const d0 = [];
  const d3 = [];
  const d7 = [];
  const d30 = [];
  const far = [];
  for(let i in obj) {
    const ticketDate = convertDateForm(obj[i][2]);
    if(ticketDate >= today) {
      const ticketId = obj[i][0]
      const tickieTitle = db.exec('SELECT summary FROM ticket WHERE id = ' + ticketId)[0].values[0][0];
      const timeDiff = (new Date(ticketDate).getTime() - new Date(today).getTime());
      const daysDiff = Math.ceil(timeDiff / (1000 * 24 * 60 * 60));
      if(0 === daysDiff) {
        d0.push([ticketDate, ticketId, tickieTitle]);
      }
      if(3 >= daysDiff && daysDiff > 0) {
        d3.push([ticketDate, ticketId, tickieTitle]);
      }
      if(7 >= daysDiff && daysDiff > 3) {
        d7.push([ticketDate, ticketId, tickieTitle]);
      }
      if(30 >= daysDiff && daysDiff > 7) {
        d30.push([ticketDate, ticketId, tickieTitle]);
      }
      if(daysDiff > 30) {
        far.push([ticketDate, ticketId, tickieTitle]);
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
