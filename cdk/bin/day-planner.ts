#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DayPlannerStack } from '../lib/day-planner-stack';

const { promisify } = require('util');
const exec = promisify(require('child_process').exec)

async function createStack() {
  console.log(process.env.CODEBUILD_WEBHOOK_HEAD_REF)
  const branchCommand = await exec('git branch --show-current'); 
  const branchName = branchCommand.stdout.trim(); 
  console.log(branchName);
  const app = new cdk.App();
  new DayPlannerStack(app, `DayPlannerStack-${branchName}`, branchName);
}

createStack();
