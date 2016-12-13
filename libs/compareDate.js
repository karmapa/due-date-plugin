import naturalSort from 'natural-sort';

function convertDateForm(arr) {
  const dateArr = arr.split('-');  //date format = MM-DD-YYYY
  const date = [dateArr[2], dateArr[0], dateArr[1]].join('-');  //convert to YYYY-MM-DD
  return date;
}

export default function compareDate(obj, db, today) {
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
    const timeDiff = (new Date(ticketDate).getTime() - new Date(today).getTime());
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
