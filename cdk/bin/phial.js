#!/usr/bin/env node

require("dotenv").config();
const cdk = require("@aws-cdk/core");
const { PhialStack } = require("../lib/phial-stack");
const { PhialPipelineStack } = require("../lib/phial-pipeline-stack");

const app = new cdk.App();

const phialStack = new PhialStack(app, "PhialStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  hostedZoneName: process.env.PHIAL_CDK_HOSTED_ZONE_NAME,
});
new PhialPipelineStack(app, "PhialPipelineStack", {
  githubBranch: process.env.PHIAL_GITHUB_BRANCH,
  githubOwner: process.env.PHIAL_GITHUB_OWNER,
  githubRepo: process.env.PHIAL_GITHUB_REPO,
  lambdaCode: phialStack,
});

app.synth();
