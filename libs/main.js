import fs from 'fs';
import SQL from 'sql.js';
import compareDate from './compareDate.js';
import {genHtmlText, genPureText} from './genEmailText.js';
import sendEmail from './sendEmail.js';
const filebuffer = fs.readFileSync('../trac.db');

// Load the db
const db = new SQL.Database(filebuffer);
const date = new Date();

const today = date.toISOString().split('T')[0];
const sqlText = 'SELECT ticket_custom.ticket, ticket_custom.value ' +
  'FROM ticket_custom, ticket ' +
  'WHERE ticket_custom.ticket = ticket.id AND ticket_custom.value != "" AND ticket.status != "closed" ' +
  'AND ticket_custom.name = "due_date"';
const tickietCustom = db.exec(sqlText)[0].values;
const tickets = compareDate(tickietCustom, db, today);
const htmlText = genHtmlText(tickets, today);
const pureText = genPureText(htmlText);

sendEmail({from: '', to: '', subject: 'trac due date', htmlBody: htmlText, textBody: pureText});
