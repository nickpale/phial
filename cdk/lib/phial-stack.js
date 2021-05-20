const core = require("@aws-cdk/core");
const acm = require("@aws-cdk/aws-certificatemanager");
const route53 = require("@aws-cdk/aws-route53");
const targets = require("@aws-cdk/aws-route53-targets");
const apigateway = require("@aws-cdk/aws-apigateway");
const lambda = require("@aws-cdk/aws-lambda");
// const s3 = require('@aws-cdk/aws-s3');
const spa = require("cdk-spa-deploy");

class PhialStack extends core.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const hostedZoneName = "timephial.com";

    const phialHostedZone = route53.HostedZone.fromLookup(this, "HostedZone", {
      domainName: hostedZoneName,
    });

    const phialAPICertificate = new acm.Certificate(this, "APICertificate", {
      domainName: "api.timephial.com",
      validation: acm.CertificateValidation.fromDns(phialHostedZone),
    });

    new spa.SPADeploy(this, "PhialSite").createSiteFromHostedZone({
      zoneName: hostedZoneName,
      indexDoc: "index.html",
      websiteFolder: "../site/build",
    });

    const flaskApp = new lambda.Function(this, "PhialFlask", {
      runtime: lambda.Runtime.PYTHON_3_8,
      code: lambda.Code.fromAsset("../api", {
        bundling: {
          image: lambda.Runtime.PYTHON_3_8.bundlingImage,
          command: [
            "bash",
            "-c",
            "pip install -r requirements.txt -t /asset-output && cp -au . /asset-output",
          ],
        },
      }),
      handler: "main.handler",
    });

    const phialAPI = new apigateway.LambdaRestApi(this, "PhialAPI", {
      restApiName: "Phial API",
      description: "This is the gateway to the phial api",
      handler: flaskApp,
      domainName: {
        domainName: "api.timephial.com",
        certificate: phialAPICertificate,
      },
    });

    new route53.ARecord(this, "PhialAPIAliasRecord", {
      zone: phialHostedZone,
      target: route53.RecordTarget.fromAlias(new targets.ApiGateway(phialAPI)),
      recordName: "api.timephial.com",
    });
  }
}

module.exports = { PhialStack };
