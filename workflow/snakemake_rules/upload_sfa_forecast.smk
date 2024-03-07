"""
This part of the workflow uploads forecast results to S3 for the public website.
"""

def _get_s3_key(w, input_file):
    s3_key_map = {
        f"results/gisaid/nextstrain_clades/usa/mlr/{w.date}_results.json.gz": f"data/us_states/us_nextstrain_clades.json",
        f"results/gisaid/nextstrain_clades/usa/mlr/{w.date}_washington.json.gz": f"data/wa/wa_nextstrain_clades.json",
        f"results/gisaid/pango_lineages/usa/mlr/{w.date}_results.json.gz": f"data/us_states/us_pango_lineages.json",
        f"results/gisaid/pango_lineages/usa/mlr/{w.date}_washington.json.gz": f"data/wa/wa_pango_lineages.json",
    }
    assert input_file in s3_key_map, f"Unexpected file for upload to S3: {input_file}"
    return s3_key_map[input_file]

rule zip_files:
    input:
        us_results = "results/{data_provenance}/{variant_classification}/usa/{model}/{date}_results.json",
        wa_results = "results/{data_provenance}/{variant_classification}/usa/{model}/{date}_washington.json"
    output:
        "results/{data_provenance}/{variant_classification}/usa/{model}/{date}_results.json.gz",
        "results/{data_provenance}/{variant_classification}/usa/{model}/{date}_washington.json.gz"
    shell:
        """
        gzip -k {input.us_results} && gzip -k {input.wa_results}
        """

rule upload_zip_files_to_s3:
    input:
        us_results = "results/{data_provenance}/{variant_classification}/usa/{model}/{date}_results.json.gz",
        wa_results = "results/{data_provenance}/{variant_classification}/usa/{model}/{date}_washington.json.gz"
    output:
        s3_upload_complete = touch("results/{data_provenance}/{variant_classification}/usa/{model}/{date}_s3_upload.done")
    params:
        s3_bucket = config.get("sfa_s3_bucket"),
        us_s3_key = lambda w, input: _get_s3_key(w, input.us_results),
        wa_s3_key = lambda w, input: _get_s3_key(w, input.wa_results)
    shell:
        """
        aws s3api put-object --bucket {params.s3_bucket} --key {params.us_s3_key} --content-encoding gzip --content-type application/json --body {input.us_results} && \
        aws s3api put-object --bucket {params.s3_bucket} --key {params.wa_s3_key} --content-encoding gzip --content-type application/json --body {input.wa_results}
        """
