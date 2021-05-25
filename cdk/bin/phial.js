#!/usr/bin/env node

const cdk = require("@aws-cdk/core");
const { PhialStack } = require("../lib/phial-stack");

const app = new cdk.App();
new PhialStack(app, "PhialStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
