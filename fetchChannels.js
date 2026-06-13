const http = require('http');

const data = JSON.stringify({
  query: `
    query {
      __type(name: "Query") {
        fields {
          name
          args {
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
    'Content-Length': data.length,
  },
};

const req = http.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    const json = JSON.parse(responseData);
    const productsField = json.data.__type.fields.find(
      (f) => f.name === 'products',
    );
    console.log(
      JSON.stringify(
        productsField.args.find((a) => a.name === 'channel'),
        null,
        2,
      ),
    );
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();
