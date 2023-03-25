import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { ManualApprovalStep } from 'aws-cdk-lib/pipelines';

export class DayPlannerStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new CodePipeline(this, 'Pipeline', {
      pipelineName: 'CDKTestPipeline',       // Creating a new code pipeline which is a construct
      synth: new ShellStep('Synth', {        // Add a new synthesis 'shellstep' which will be pointed at our gihub repository 
        input: CodePipelineSource.gitHub('mswil/day-planner', 'main'), // replace the GitHub repository name with 'user-name/repository-name'
        
        // The build steps for the pipeline are defined by these commands
        
        commands: ['cd /cdk',
                    'npm ci',
                    'npm run build',
                    'npx cdk synth'],
        
        primaryOutputDirectory: "cdk/cdk.out"
      }),
    })

    // new dynamodb.Table(this, "SimpleDynamoDB", {
    //   partitionKey: {
    //     name: "id",
    //     type: dynamodb.AttributeType.STRING
    //   },
    // })
  }
}
