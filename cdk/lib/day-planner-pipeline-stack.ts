import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import * as sm from "aws-cdk-lib/aws-secretsmanager";
import { LinuxBuildImage } from 'aws-cdk-lib/aws-codebuild';
import { DayPlannerAppStage } from './day-planner-pipeline-app-stage';

export class DayPlannerPipelineStack extends Stack {
  constructor(scope: Construct, id: string, branch: string = 'main', props?: StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: `DayPlannerCDKPipeline-${branch}`,       // Creating a new code pipeline which is a construct
      synth: new ShellStep('Synth', {        // Add a new synthesis 'shellstep' which will be pointed at our gihub repository 
        input: CodePipelineSource.gitHub('mswil/day-planner', branch, { // replace the GitHub repository name with 'user-name/repository-name'
          authentication: sm.Secret.fromSecretNameV2(this, "github-token", "github-token-other").secretValue
        }), 
        // The build steps for the pipeline are defined by these commands
        commands: ['cd cdk',
                    'npm ci',
                    'npm run build',
                    'npx cdk synth'],
        primaryOutputDirectory: "cdk/cdk.out"
      }),
      codeBuildDefaults: {
        buildEnvironment: {
          buildImage: LinuxBuildImage.AMAZON_LINUX_2_4
        }
      }
    })

    pipeline.addStage(new DayPlannerAppStage(this, "app", {
      env: { account: "639197873250", region: "us-east-1" }
    }))

    // new dynamodb.Table(this, "SimpleDynamoDB", {
    //   partitionKey: {
    //     name: "id",
    //     type: dynamodb.AttributeType.STRING
    //   },
    // })
  }
}
