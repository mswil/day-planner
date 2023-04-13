#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DayPlannerStack } from '../lib/day-planner-stack';

const { promisify } = require('util');
const exec = promisify(require('child_process').exec)

// Creates a new Stack named after the current branch being modified during the codebuild process
// Will need to run cdk deploy after pushing a new branch
async function computeBranchName() {
  const codebuildInitiator = process.env.CODEBUILD_INITIATOR

  let branchName = 'main';
  if (!codebuildInitiator) {
    const localBranchName = await exec("git branch --show-current");
    branchName = localBranchName.stdout.trim()
  } else {
    branchName = codebuildInitiator ? codebuildInitiator.substring(codebuildInitiator.indexOf("-") + 1) : "main";
  }
  return branchName
}

computeBranchName().then(branchName => {
  const app = new cdk.App();
  new DayPlannerStack(app, `DayPlannerStack-${branchName}`, branchName);
})
