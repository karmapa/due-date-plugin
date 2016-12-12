import fs from 'fs';
import SQL from 'sql.js';
import naturalSort from 'natural-sort';
//import sendEmail from './sendEmail.js';
//const filebuffer = fs.readFileSync('../trac.db');

// Load the db
//const db = new SQL.Database(filebuffer);
//const date = new Date();

//const today = date.toISOString().split('T')[0];
//const sqlText = 'SELECT ticket_custom.ticket, ticket_custom.value ' +
//  'FROM ticket_custom, ticket ' +
//  'WHERE ticket_custom.ticket = ticket.id AND ticket_custom.value != "" AND ticket.status != "closed" ' +
//  'AND ticket_custom.name = "due_date"';
//const tickietCustom = db.exec(sqlText)[0].values;
//const tickets = compareDate(tickietCustom, db);
//const htmlText = genHtmlText(tickets);
//const pureText = genPureText(htmlText);

//sendEmail({from: '', to: '', subject: 'trac due date', htmlBody: htmlText, textBody: pureText});

export function genPureText(xml) {
  const text = xml.replace(/<br\/>/g, '\n').replace(/&nbsp;/g, ' ').replace(/<.+?>/g, '');
  return text;
}

export function genHtmlText(obj) {
  let text = today + ' trac due day tracker' + '<br/><br/>';
  for(let key in obj) {
    const dayRange = key.replace('d', '');
    if('overDue' === dayRange) {
      text += 'over due:' + '<br/>';
    } else if('far' === dayRange) {
      text += 'more than 30 days:' + '<br/>';
    } else if ('0' === dayRange) {
      text += 'today:' + '<br/>';
    } else {
      text += 'within ' + dayRange + ' days:' + '<br/>';
    }
    if (0 === obj[key].length) {
      text += '&nbsp;&nbsp;&nbsp;&nbsp;' + 'none' + '<br/><br/>';
    } else {
      obj[key].map(function(arr) {
        text += listTickets(arr);
      });
    text += '<br/>';
    }
  }
  return text;
}

export function listTickets(arr) {
  const link = '<a href="https://trac.dharma-treasure.org/ticket/' + arr[1] + '">#' + arr[1] + '</a>';
  const date = arr[0];
  const title = arr[2];
  return '&nbsp;&nbsp;&nbsp;&nbsp;' + date + '&nbsp;&nbsp;' + link + ':&nbsp;' + title + '<br/>';
}

export function convertDateForm(arr) {
  const dateArr = arr.split('-');  //date format = MM-DD-YYYY
  const date = [dateArr[2], dateArr[0], dateArr[1]].join('-');  //convert to YYYY-MM-DD
  return date;
}

export function compareDate(obj, db) {
  const overDue = [];
  const d0 = [];
  const d3 = [];
  const d7 = [];
  const d30 = [];
  const far = [];
  for(let i in obj) {
    const ticketDate = convertDateForm(obj[i][1]);
    const ticketId = obj[i][0];
    const tickieTitle = db.exec('SELECT summary FROM ticket WHERE id = ' + ticketId)[0].values[0][0];
    const timeDiff = (new Date(ticketDate).getTime() - new Date("2016-12-12").getTime());
    const daysDiff = timeDiff / (1000 * 24 * 60 * 60);
    if(0 > daysDiff) {
      overDue.push([ticketDate, ticketId, tickieTitle]);
    }
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
  const output = {
    overDue: overDue,
    d0: d0,
    d3: d3,
    d7: d7,
    d30: d30,
    far: far
  };
  for(let i in output) {
    output[i] = output[i].sort(naturalSort());
  }
  return output;
}
