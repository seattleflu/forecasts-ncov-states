# Forecasts SARS-CoV-2

> :warning: **WARNING: This is an alpha release.** Output file format and address may change at any time

This repo forms the basis of our continually-updated modelling of SARS-CoV-2 variant frequencies.
Broadly speaking, the moving pieces in this repo are:

* Data ingest, which produces TSV files of sequence counts. See [./ingest/README](https://github.com/nextstrain/forecasts-ncov/blob/main/ingest/README.md) for more details.
* Variant modelling, which is detailed in this README. The models themselves are defined in the [evofr](https://github.com/blab/evofr) repo.
* The `./viz/` directory contains a web-app which visualises the latest model outputs. See [./viz/README](https://github.com/nextstrain/forecasts-ncov/blob/main/viz/README.md) for more details. Currently this web-app is available at [nextstrain.github.io/forecasts-ncov/](https://nextstrain.github.io/forecasts-ncov/).


## Automated pipeline
The automated pipeline runs daily based on a scheduled jobs and triggers from upstream data ingests.
We use GitHub actions to schedule these jobs, often with one job triggering another upon completion.

* Case counts are fetched from [external data sources](./ingest/README.md#data-sources) daily at 8 AM PST
* Raw metadata/sequences are fetched and cleaned via [nextstrain/ncov-ingest].
    * See [GISAID](https://github.com/nextstrain/ncov-ingest/blob/master/.github/workflows/fetch-and-ingest-gisaid-master.yml) and [open](https://github.com/nextstrain/ncov-ingest/blob/master/.github/workflows/fetch-and-ingest-genbank-master.yml) data workflows for their daily scheduled times
* The [nextstrain/ncov-ingest] pipelines trigger the clade counts jobs once the latest curated data has been uploaded to S3
    * The GISAID and open data ingest pipelines have different run times, so their clade counts jobs are triggered at different times.
* Clade counts jobs trigger the model runs once the counts data has been uploaded to S3
* Model results are uploaded to S3 as dated files where the date indicates the ***run*** date

### Inputs
See [available counts files](./ingest/README.md#outputs) for the input case counts and clade counts files.

### Outputs
The model results for GISAID data are stored at `s3://nextstrain-data/files/workflows/forecasts-ncov/gisaid`.
The model results for open (GenBank) data are stored at `s3://nextstrain-data/files/workflows/forecasts-ncov/open`.

The latest results are stored as `latest_results.json` and previously uploaded results can be found as `<YYYY-MM-DD>_results.json`.

#### Summary of Available files:

| Data Provenance | Variant Classification | Geographic Resolution | Model  | Address                                                                                                              |
| --------------- | ---------------------- | --------------------- | ------ | -------------------------------------------------------------------------------------------------------------------- |
| GISAID          | Nextstrain clades      | Global                | MLR    | `https://data.nextstrain.org/files/workflows/forecasts-ncov/gisaid/nextstrain_clades/global/mlr/latest_results.json` |
|                 | Pango lineages         |                       |        | `https://data.nextstrain.org/files/workflows/forecasts-ncov/gisaid/pango_lineages/global/mlr/latest_results.json`    |
| open (GenBank)  | Nextstrain clades      |                       |        | `https://data.nextstrain.org/files/workflows/forecasts-ncov/open/nextstrain_clades/global/mlr/latest_results.json`   |
|                 | Pango lineages         |                       |        | `https://data.nextstrain.org/files/workflows/forecasts-ncov/open/pango_lineages/global/mlr/latest_results.json`      |


## Installation

Please follow [installation instructions](https://docs.nextstrain.org/en/latest/install.html#installation-steps) for Nextstrain's software tools.

## Usage

To run pipeline for all available data for generated by ingest:

```
nextstrain build .
```

To run the pipeline for specific data provenance, variant classification and geo resolution (e.g. gisaid, nextstrain_clades and global only):

```
nextstrain build . --configfile config/config.yaml --config data_provenances=gisaid variant_classification=nextstrain_clades geo_resolutions=global
```

### Optional uploads

To run the pipeline that uploads the model results to S3 and sends Slack notifications:

```
nextstrain build . --configfile config/config.yaml config/optional.yaml
```

OR

Run the GitHub Action workflow named "Run models" to run the pipeline on AWS Batch.


## Configuration
The `data_provenances`, `variant_classifications` and `geo_resolutions` are required configs for the pipeline.

The current available options for `data_provenances` are
- gisaid
- open

The current available options for `variant_classifications` are
- nextstrain_clades
- pango_lineages

The current available options for `geo_resolutions` are
- global
- usa

### Data Prep Configurations

The `prepare_data` params in `config/config.yaml` are used to subset the full
case counts and clades counts data to specific date range, locations, and clades.

As of 2023-04-04, the config for the automated pipeline is set to only include data from:
* the past 150 days
    * excluding sequences from the last 12 days since they may be overly enriched for variants
* locations that have at least 500 sequences in the last 30 days
    * excluding locations specifically listed in `defaults/global_excluded_locations.txt`
* clades that have at least 5000 sequences in the last 150 days

### Model configurations
The specific model configurations are housed in separate config YAML files or each model.
These separate config files must be provided in the main config as `mlr_config` and `renewal_config` in order to run the models.
By default, the model config files used are `config/mlr-config.yaml` and `config/renewal-config.yaml`.
Note the inputs and outputs for the models are overridden in the Snakemake pipeline to conform to the Snakemake input/output framework.

### Environment variables

No environment variables are required for open data.
However, the following environment variables are required for the gisaid data:
- `AWS_DEFAULT_REGION`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

#### Uploads
If running pipeline with uploads to S3, the following environment variables are required (regardless of data provenance):
- `AWS_DEFAULT_REGION`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

#### Slack notifications
If running pipeline with Slack notifications, the following environment variables are required:
- `SLACK_CHANNELS`
- `SLACK_TOKEN`

[nextstrain/ncov-ingest]: https://github.com/nextstrain/ncov-ingest
