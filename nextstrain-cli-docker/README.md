# Minimal docker image for Nextstrain CLI

#### Building the Docker image

From the root directory of this repo:

```
docker build --tag nextstrain-cli -f ./nextstrain-cli-docker/Dockerfile .
```

#### Procedure
We will push the Docker image to Amazon Elastic Container Registry (ECR), so that it's available from Elastic Container Service (ECS).

This procedure assumes that the ECR repository has already been created.

You will need to know several things:

- **aws-account-id**: The AWS account ID, usually a 12-digit number
- **aws-region**: The AWS region in which the application is stored in ECR and hosted in Elastic Beanstalk. (Hint: This is probably `us-west-2`!)
- **ecr-repository-name**: The ECR repository name. (Hint: this is probably `nextstrain-cli`!)

1. Authenticate with Amazon Elastic Container Registry (ECR)

  Run this command, replacing `<region>` and `<aws-account-id>` as appropriate. The `--profile <aws-profile>` option is not necessary unless you are using named profiles with the AWS CLI.

  ```
  aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <aws-account-id>.dkr.ecr.<region>.amazonaws.com
  ```

  If you are using named profiles with the AWS CLI, you can add `—-profile <aws-profile-name>` to the `aws ecr get-login-password` command.
  
2. Tag the Docker image with the ECR repository.

  ```
  docker tag nextstrain-cli:latest <aws-account-id>.dkr.ecr.<region>.amazonaws.com/<ecr-repository-name>
  ```
3. Push the image to the repository.

  ```
  docker push <aws-account-id>.dkr.ecr.<region>.amazonaws.com/<ecr-repository-name>
  ```
