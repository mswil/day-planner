import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import { Ec2Stack } from './day-planner-ec2-stack';

export class DayPlannerAppStage extends cdk.Stage {

    constructor(scope: Construct, id: string, props?: cdk.StageProps) {
      super(scope, id, props);

      const ec2Stack = new Ec2Stack(this, 'Ec2Stack');
    }
}