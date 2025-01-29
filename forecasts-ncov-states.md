# Forecasting pipeline

This documentation is specific to running the forecasting models for US and Washington state to update [this page](https://seattleflu.org/sars-cov-2-forecasts) on the SFA public website.

## Setup

### Requirements

- Nextclade CLI (can be installed [directly](https://docs.nextstrain.org/projects/cli/en/stable/installation/) or with [Docker](./nextstrain-cli-docker/README.md))

- AWS CLI (also included in Docker image)

### AWS

Running the commands below requires appropriate permission on S3, AWS Batch, and Cloudwatch, and setting env vars `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`; or `AWS_PROFILE`.


## Running locally

To run locally:
```
nextstrain build . --configfile config/config.yaml --config data_provenances=gisaid geo_resolutions=usa
```

## Running with AWS Batch

To run on AWS, using Nextstrain's AWS Batch runtime:
```
nextstrain build --aws-batch --aws-batch-s3-bucket <bucket-name> --aws-batch-job <aws-batch-job-name> --aws-batch-queue <aws-batch-job-queue-name> . --configfile config/config.yaml --config data_provenances=gisaid geo_resolutions=usa
```

The results folder is automatically downloaded when completed. Alteratively, we can run this in the background with `--detach` and retrieve the results from S3 later.

## Production setup

### ECR and ECS

In production, ECS is used to run the command above as a scheduled task, in detached mode.

A minimal docker image including the Nextstrain CLI and contents of this repo is published to ECR and used to run the `nextstrain build` commands from ECS. See [README.md](nextstrain-cli-docker/README.md)

An ECS task definition specifies the environment and nexstrain CLI command to run, and an ECS cluster runs this as a scheduled task.


### Final S3 outputs 

To update the files on the public website, an addition workflow rule is run by setting `send_sfa_forecast_to_s3` to `True` in config.yaml. The destination bucket and associated CloudFront distribution must be set via environment variables `sfa_s3_bucket` and `sfa_s3_bucket_cloudfront_id`. This workflow compresses and copies the files from the source bucket to the destination, sets the appropriate encoding and content types for pre-zipped files to be served via CloudFront (i.e. `content-encoding:gzip and content-type:application/json`), and invalidates the `/data/*` path of the CloudFront distribution.
