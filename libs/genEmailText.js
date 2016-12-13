const webSite = 'https://trac.dharma-treasure.org/ticket/';

export function genPureText(xml) {
  const text = xml.replace(/<br\/>/g, '\n').replace(/&nbsp;/g, ' ').replace(/<.+?>/g, '');
  return text;
}

export function genHtmlText(obj, today) {
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

function listTickets(arr) {
  const link = '<a href="' + webSite + + arr[1] + '">#' + arr[1] + '</a>';
  const date = arr[0];
  const title = arr[2];
  return '&nbsp;&nbsp;&nbsp;&nbsp;' + date + '&nbsp;&nbsp;' + link + ':&nbsp;' + title + '<br/>';
}