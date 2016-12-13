import SQL from 'sql.js';
import {compareDate} from '../main.js';
import assert from 'assert';

const db = new SQL.Database();
let sqlstr = 'CREATE TABLE ticket (id int, status char, summary char);';
sqlstr += 'INSERT INTO ticket VALUES (1, "new", "test1");';
sqlstr += 'INSERT INTO ticket VALUES (2, "new", "test2");';
sqlstr += 'INSERT INTO ticket VALUES (3, "closed", "test3");';
sqlstr += 'INSERT INTO ticket VALUES (4, "accepted", "test4");';
sqlstr += 'INSERT INTO ticket VALUES (5, "new", "test5");';
sqlstr += 'INSERT INTO ticket VALUES (6, "accepted", "test6");';
sqlstr += 'INSERT INTO ticket VALUES (7, "new", "test7");';
sqlstr += 'INSERT INTO ticket VALUES (9, "accepted", "test9");';
sqlstr += 'CREATE TABLE ticket_custom (ticket int, name char, value char);';
sqlstr += 'INSERT INTO ticket_custom VALUES (1, "due_date", "12-02-2016");';
sqlstr += 'INSERT INTO ticket_custom VALUES (1, "parents", "");';
sqlstr += 'INSERT INTO ticket_custom VALUES (2, "due_date", "12-12-2016");';
sqlstr += 'INSERT INTO ticket_custom VALUES (2, "parents", "");';
sqlstr += 'INSERT INTO ticket_custom VALUES (3, "due_date", "12-14-2016");';
sqlstr += 'INSERT INTO ticket_custom VALUES (3, "parents", "");';
sqlstr += 'INSERT INTO ticket_custom VALUES (4, "due_date", "12-20-2016");';
sqlstr += 'INSERT INTO ticket_custom VALUES (4, "parents", "");';
sqlstr += 'INSERT INTO ticket_custom VALUES (5, "due_date", "01-02-2017");';
sqlstr += 'INSERT INTO ticket_custom VALUES (5, "parents", "1");';
sqlstr += 'INSERT INTO ticket_custom VALUES (6, "due_date", "02-02-2017");';
sqlstr += 'INSERT INTO ticket_custom VALUES (6, "parents", "");';
sqlstr += 'INSERT INTO ticket_custom VALUES (8, "due_date", "02-03-2017");';
sqlstr += 'INSERT INTO ticket_custom VALUES (8, "parents", "2");';
sqlstr += 'INSERT INTO ticket_custom VALUES (9, "due_date", "12-13-2016");';
sqlstr += 'INSERT INTO ticket_custom VALUES (9, "parents", "");';
db.run(sqlstr);

describe('test sql', function () {
  let arr;
  it('select correct sql', function () {
    const sqlText = 'SELECT ticket_custom.ticket, ticket_custom.value ' +
      'FROM ticket_custom, ticket ' +
      'WHERE ticket_custom.ticket = ticket.id AND ticket_custom.value != "" AND ticket.status != "closed" ' +
      'AND ticket_custom.name = "due_date"';
    const tickietCustom = db.exec(sqlText)[0].values;
    arr = tickietCustom;
    const result = [
      [1, '12-02-2016'],
      [2, '12-12-2016'],
      [4, '12-20-2016'],
      [5, '01-02-2017'],
      [6, '02-02-2017'],
      [9, '12-13-2016']
    ];
    assert.deepEqual(result, tickietCustom);
  });
  it('test compareDate', function () {
    const testDay = '2016-12-12';
    const tickets = compareDate(arr, db, testDay);
    const result = {
      overDue: [
        ['2016-12-02', 1, 'test1']
      ],
      d0: [
        ['2016-12-12', 2, 'test2']
      ],
      d3: [
        ['2016-12-13', 9, 'test9']
      ],
      d7: [],
      d30: [
        ['2016-12-20', 4, 'test4'],
        ['2017-01-02', 5, 'test5']
      ],
      far: [
        ['2017-02-02', 6, 'test6']
      ]
    };
    assert.deepEqual(result, tickets);
  });
});