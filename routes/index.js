var express = require('express');
var router = express.Router();
const {
  GraphQLClient
} = require('graphql-request');


router.get('/', (req, res) => {
  const client = new GraphQLClient('https://payments.sandbox.braintree-api.com/graphql', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic bXdtcnJzNzRkZ2Ria3RjMjo4ZjY2NmFkMTM3NzFlNzA1NmVlNTE4NWMyYmY1OTI2Nw',
      'Braintree-Version': '2019-01-01'
    },
  })

  const query = `mutation {
  createClientToken {
    clientToken
  }
}`


  client.request(query).then(clientToken => {
    res.render('index', {
      clientToken
    });
  });
});



router.post('/transaction', (req, res) => {

  // In production you should not take amounts directly from clients
  const {
    amount,
    payment_method_nonce: paymentMethodNonce
  } = req.body;

  const client = new GraphQLClient('https://payments.sandbox.braintree-api.com/graphql', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic N2ducDNwZGhrczdiZnNyNjpjMzVjMzhjMWNlMGViNmI5NjQzZTI3MzM0N2RlMDhmYQ',
      'Braintree-Version': '2019-01-01'
    },
  })

  const query = `mutation ExampleCharge($input: ChargePaymentMethodInput!) {
  chargePaymentMethod(input: $input) {
    transaction {
      id
      status
    }
  }
}`

  const variables = {
    "input": {
      "paymentMethodId": paymentMethodNonce,
      "transaction": {
        "amount": amount
      }
    }
  }

  client.request(query, variables).then(data => res.send(data)).catch(err => {
    console.log(err.response.errors) // GraphQL response errors
    console.log(err.response.data) // Response data if available
    res.send(err.response.errors)
  })


});

module.exports = router;