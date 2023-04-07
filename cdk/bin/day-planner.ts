#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DayPlannerStack } from '../lib/day-planner-stack';

// Creates a new Stack named after the current branch being modified during the codebuild process
// Will need to run cdk deploy after pushing a new branch
const codebuildInitiator = process.env.CODEBUILD_INITIATOR
const branchName = codebuildInitiator ? codebuildInitiator.substring(codebuildInitiator.indexOf("-") + 1) : "main";
const app = new cdk.App();
new DayPlannerStack(app, `DayPlannerStack-${branchName}`, branchName);
