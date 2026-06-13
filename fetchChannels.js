const http = require('http');

const data = JSON.stringify({
  query: `
    query {
      products(first: 5, channel: "flash-shop", filter: { collections: ["nouveautes"] }) {
        edges {
          node {
            name
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
    console.log(JSON.stringify(JSON.parse(responseData), null, 2));
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();
