const http = require('http');

const data = JSON.stringify({
  query: `
    query {
      __type(name: "AddressInput") {
        inputFields {
          name
          type {
            name
            kind
            ofType {
              name
              kind
            }
          }
        }
      }
    }
  `,
});

const options = {
  hostname: 'localhost',
  port: 8000,
  path: '/graphql/',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
  },
};

const req = http.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    const json = JSON.parse(responseData);
    console.log(JSON.stringify({ json }, null, 2));
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();
