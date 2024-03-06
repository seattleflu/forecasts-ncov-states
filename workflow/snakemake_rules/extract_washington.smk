import json

"""
This part of the workflow extracts results for Washington.
"""
rule extract_washington:
    """
    Run script to extract results for Washington state
    """
    input: "results/{data_provenance}/{variant_classification}/{geo_resolution}/{model}/{date}_results.json"
    output: "results/{data_provenance}/{variant_classification}/{geo_resolution}/{model}/{date}_washington.json"
    
    shell:
        """
        python ./scripts/extract-location.py < {input} > {output}
        """
