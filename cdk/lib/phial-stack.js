const acm = require("@aws-cdk/aws-certificatemanager");
const apigateway = require("@aws-cdk/aws-apigateway");
const cognito = require("@aws-cdk/aws-cognito");
const core = require("@aws-cdk/core");
const { AttributeType, Table } = require("@aws-cdk/aws-dynamodb");
const lambda = require("@aws-cdk/aws-lambda");
const path = require("path");
const route53 = require("@aws-cdk/aws-route53");
const spa = require("cdk-spa-deploy");
const targets = require("@aws-cdk/aws-route53-targets");

class PhialStack extends core.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    new cognito.UserPool(this, "PhialUserPool", {
      autoVerify: { email: true },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
        tempPasswordValidity: Duration.days(3),
      },
      mfa: cognito.Mfa.OPTIONAL,
      mfaSecondFactor: {
        sms: true,
        otp: true,
      },
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
        preferredUsername: true,
        username: true,
      },
      userPoolName: "phial-userpool",
      userVerification: {
        emailSubject: "Verify your email to begin using Phial!",
        emailBody:
          "Thanks for signing up to use Phial! Your verification code is {####}",
        emailStyle: cognito.VerificationEmailStyle.CODE,
        smsMessage:
          "Thanks for signing up to use Phial! Your verification code is {####}",
      },
    });

    const dynamoTable = new Table(this, "PhialTable", {
      partitionKey: {
        name: "pk",
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "sk",
        type: AttributeType.STRING,
      },
      tableName: "phial",
    });

    const apiDomainName = "api." + props.hostedZoneName;

    const phialHostedZone = route53.HostedZone.fromLookup(this, "HostedZone", {
      domainName: props.hostedZoneName,
    });

    const phialAPICertificate = new acm.Certificate(this, "APICertificate", {
      domainName: apiDomainName,
      validation: acm.CertificateValidation.fromDns(phialHostedZone),
    });

    new spa.SPADeploy(this, "PhialSite").createSiteFromHostedZone({
      zoneName: props.hostedZoneName,
      indexDoc: "index.html",
      websiteFolder: path.join(__dirname, "../../site/build"),
    });

    const flaskApp = new lambda.Function(this, "PhialFlask", {
      runtime: lambda.Runtime.PYTHON_3_8,
      code: lambda.Code.fromAsset(path.join(__dirname, "../../api"), {
        bundling: {
          image: lambda.Runtime.PYTHON_3_8.bundlingImage,
          command: [
            "bash",
            "-c",
            "pip install -r requirements.txt -t /asset-output && cp -au . /asset-output",
          ],
        },
      }),
      environment: {
        TABLE_NAME: dynamoTable.tableName,
      },
      handler: "main.handler",
    });

    dynamoTable.grantReadWriteData(flaskApp);

    const phialAPI = new apigateway.LambdaRestApi(this, "PhialAPI", {
      restApiName: "Phial API",
      description: "This is the gateway to the phial api",
      handler: flaskApp,
      domainName: {
        domainName: apiDomainName,
        certificate: phialAPICertificate,
      },
    });

    new route53.ARecord(this, "PhialAPIAliasRecord", {
      zone: phialHostedZone,
      target: route53.RecordTarget.fromAlias(new targets.ApiGateway(phialAPI)),
      recordName: apiDomainName,
    });
  }
}

module.exports = { PhialStack };
