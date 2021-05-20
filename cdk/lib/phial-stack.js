const core = require("@aws-cdk/core");
const apigateway = require("@aws-cdk/aws-apigateway");
const lambda = require("@aws-cdk/aws-lambda");
// const s3 = require("@aws-cdk/aws-s3");
const spa = require("cdk-spa-deploy");

class PhialStack extends core.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    new spa.SPADeploy(this, "PhialSite").createSiteFromHostedZone({
      zoneName: "timephial.com",
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

    new apigateway.LambdaRestApi(this, "phial-api", {
      restApiName: "Phial API",
      description: "This is the gateway to the phial api",
      handler: flaskApp,
    });
  }
}

module.exports = { PhialStack };
