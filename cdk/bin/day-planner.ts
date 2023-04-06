#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DayPlannerStack } from '../lib/day-planner-stack';

const { promisify } = require('util');
const exec = promisify(require('child_process').exec)

async function createStack() {
  //   "CODEBUILD_INITIATOR": "codepipeline/DayPlannerCDKPipeline-cdk-branching-strategy",
  console.log("LOOK HERE " + process.env.CODEBUILD_INITIATOR)
  // const branchCommand = await exec('git branch --show-current'); 
  // const branchName = branchCommand.stdout.trim(); 

  const codebuildInitiator = process.env.CODEBUILD_INITIATOR
  const branchName = codebuildInitiator ? codebuildInitiator.substring(codebuildInitiator.indexOf("-") + 1) : "main";
  // check if env exists
  console.log("branch name " + branchName);
  const app = new cdk.App();
  new DayPlannerStack(app, `DayPlannerStack-${branchName}`, branchName);
}

createStack();
