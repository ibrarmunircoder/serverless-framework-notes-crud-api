'use strict';

const {
  CognitoIdentityProviderClient,
  AdminInitiateAuthCommand,
} = require('@aws-sdk/client-cognito-identity-provider');
const { fromIni } = require('@aws-sdk/credential-providers');

const client = new CognitoIdentityProviderClient({
  region: 'us-east-1',
  credentials: fromIni({
    clientConfig: {
      region: 'us-east-1',
    },
    profile: 'test-user',
  }),
});

exports.an_authenticated_user = async () => {
  const userPoolId = process.env.USER_POOL_ID;
  const clientId = process.env.CLEINT_ID;
  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;

  const command = new AdminInitiateAuthCommand({
    AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
    ClientId: clientId,
    UserPoolId: userPoolId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  });
  const user = await client.send(command);
  return user;
};
