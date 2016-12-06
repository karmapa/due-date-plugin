import AWS from 'aws-sdk';

/**
 * Don't hard-code your credentials!
 * Export the following environment variables instead:
 *
 * export AWS_ACCESS_KEY_ID='ID'
 * export AWS_SECRET_ACCESS_KEY='SECRET'
 */

AWS.config.region = 'us-west-2';

const ses = new AWS.SES();

export  default function sendEmail({from, to, subject = '', htmlBody = '', textBody = ''}) {
  return new Promise((resolve, reject) => {

    if ('string' === typeof to) {
      to = [to];
    }
    const params = {
      Source: from,
      Destination: {ToAddresses: to},
      Message: {
        Subject: {
          Data: subject
        },
        Body: {
          Html: {
            Data: htmlBody,
            Charset: 'UTF-8'
          },
          Text: {
            Data: textBody
          }
        }
      }
    };
    ses.sendEmail(params, (err, data) => err ? reject(err) : resolve(data));
  });
}

sendEmail({from: 'dharma.treasure.corp@gmail.com', to: 'rickie120243@gmail.com', subject: 'test', htmlBody: 'hello', textBody: 'hello'});
