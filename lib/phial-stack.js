const cdk = require("@aws-cdk/core");
const apigateway = require("@aws-cdk/aws-apigateway");
const lambda = require("@aws-cdk/aws-lambda");
// const s3 = require("@aws-cdk/aws-s3");

export class PhialStack extends cdk.Stack {
  constructor(scope, id) {
    super(scope, id);

    // const site = new s3.Bucket(this, "PhialFrontEnd");

    const flaskApp = new lambda.Function(this, "PhialFlask", {
      runtime: lambda.Runtime.PYTHON_3_8,
      code: lambda.Code.fromAsset("api/" + process.env.ZAPPA_LAMBDA_PACKAGE),
      handler: "lambda_handler",
    });

    const api = new apigateway.RestApi(this, "phial-api", {
      restApiName: "Phial API",
      description: "This is the gateway to the phial api",
    });

    const getPhialApp = new apigateway.LambdaIntegration(flaskApp, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' },
    });

    api.root.addMethod("GET", getPhialApp); // GET /
  }
}
