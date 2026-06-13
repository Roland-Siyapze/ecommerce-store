const http = require('http');

const data = JSON.stringify({
  query: `
    mutation {
      checkoutCreate(input: {
        channel: "flash-shop",
        shippingAddress: { country: CM },
        lines: [
          {
            quantity: 1,
            variantId: "UHJvZHVjdFZhcmlhbnQ6NjA3"
          }
        ]
      }) {
        checkout {
          id
        }
        errors {
          field
          message
          code
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
