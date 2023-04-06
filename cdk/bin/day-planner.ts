#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DayPlannerStack } from '../lib/day-planner-stack';

const { promisify } = require('util');
const exec = promisify(require('child_process').exec)

async function createStack() {
  //   "CODEBUILD_INITIATOR": "codepipeline/DayPlannerCDKPipeline-cdk-branching-strategy",
  console.log("LOOK HERE " + JSON.stringify(process.env.CODEBUILD_INITIATOR))
  // const branchCommand = await exec('git branch --show-current'); 
  // const branchName = branchCommand.stdout.trim(); 

  const branchName = JSON.stringify(process.env.CODEBUILD_INITIATOR).split("/",2)[1];
  console.log("branch name " + branchName);
  const app = new cdk.App();
  new DayPlannerStack(app, `DayPlannerStack-${branchName}`, branchName);
}

createStack();
