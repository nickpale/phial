const cdk = require("@aws-cdk/core");
const apigateway = require("@aws-cdk/aws-apigateway");
const lambda = require("@aws-cdk/aws-lambda");
// const s3 = require("@aws-cdk/aws-s3");

class PhialStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // const site = new s3.Bucket(this, "PhialFrontEnd");

    const flaskApp = new lambda.Function(this, "PhialFlask", {
      runtime: lambda.Runtime.PYTHON_3_8,
      code: lambda.Code.fromAsset("api/" + process.env.ZAPPA_LAMBDA_PACKAGE),
      handler: "handler.lambda_handler",
    });

    new apigateway.LambdaRestApi(this, "phial-api", {
      restApiName: "Phial API",
      description: "This is the gateway to the phial api",
      handler: flaskApp,
    });
  }
}

module.exports = { PhialStack };
