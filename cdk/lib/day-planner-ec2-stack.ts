import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AmazonLinuxGeneration, AmazonLinuxImage, Instance, InstanceClass, InstanceSize, InstanceType, Peer, Port, SecurityGroup, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { NetworkLoadBalancer } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import {readFileSync} from 'fs';
import { InstanceIdTarget } from 'aws-cdk-lib/aws-elasticloadbalancingv2-targets';

export class Ec2Stack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
      super(scope, id, props);

      const vpc = new Vpc(this, 'Vpc', {});

      const securityGroup = new SecurityGroup(this, "SecurityGroup", {
        vpc
      })

      securityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(22), "SSH");
      securityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(80), "HTTP");

      const ec2Instance = new Instance(this, "Ec2Instance", {
        instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
        machineImage: new AmazonLinuxImage({
          generation: AmazonLinuxGeneration.AMAZON_LINUX_2
        }),
        vpc,
        securityGroup,
        vpcSubnets: {
          subnetType: SubnetType.PUBLIC,
        }
      })

      const networkLoadBalancer = new NetworkLoadBalancer(this, 'NetworkLoadBalancer', { 
        vpc,
        internetFacing: true
       });
      const listener = networkLoadBalancer.addListener('listener', { port: 80 });
      listener.addTargets('target', {
        port: 80,
        targets: [new InstanceIdTarget(ec2Instance.instanceId)]
      });

      const userDataScript = readFileSync("./lib/user-data.sh" , 'utf8')

      ec2Instance.addUserData(userDataScript)

    }
}
