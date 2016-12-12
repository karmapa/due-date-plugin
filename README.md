# due-date-plugin

[![Build Status](https://travis-ci.org/karmapa/due-date-plugin.svg?branch=master)](https://travis-ci.org/karmapa/due-date-plugin)

Using aws-ses service to track trac due date.

###Install plugin:
```
cd path/to/trac/db
git clone https://github.com/karmapa/due-date-plugin
cd due-date-plugin && npm install
```

###Setup
Export the following environment variables in .bashrc:
```javascript
export AWS_ACCESS_KEY_ID='ID'
export AWS_SECRET_ACCESS_KEY='SECRET'
```
set email address  & web site in main.js:
```javascript
sendEmail({from: 'someone's email', to: 'another's email', subject: 'trac due date', htmlBody: htmlText, textBody: pureText});

function listTickets(arr) {
  const link = '<a href="https://trac.dharma-treasure.org/ticket/'...
  ...
}

```
set crontab:
```
crontab -e
//vi example: run every Mon to Fri at 9am
0 9 * * 1-5 cd /var/local/trac/db/due-date-plugin && . ~/.bashrc && /usr/local/bin/node index.js
```
