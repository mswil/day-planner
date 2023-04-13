import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function, InlineCode, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Vpc } from 'aws-cdk-lib/aws-ec2';

export class Ec2Stack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
      super(scope, id, props);

      new Vpc(this, 'Vpc', {});
    }
}