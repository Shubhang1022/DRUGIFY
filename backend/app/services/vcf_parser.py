"""VCF v4.2 Parser"""
from typing import Dict, Any, List


def parse_vcf(content: str) -> Dict[str, Any]:
    lines = content.strip().split("\n")
    metadata: Dict[str, str] = {}
    variants: List[Dict[str, Any]] = []
    sample_id = "UNKNOWN"

    for line in lines:
        line = line.strip()
        if not line:
            continue
        if line.startswith("##"):
            parts = line[2:].split("=", 1)
            if len(parts) == 2:
                metadata[parts[0]] = parts[1]
            continue
        if line.startswith("#CHROM"):
            cols = line.split("\t")
            if len(cols) >= 10:
                sample_id = cols[9]
            continue

        cols = line.split("\t")
        if len(cols) >= 8:
            variants.append({
                "chrom": cols[0],
                "pos": int(cols[1]),
                "id": cols[2] if cols[2] != "." else "",
                "ref": cols[3],
                "alt": cols[4],
                "qual": cols[5],
                "filter": cols[6],
                "info": cols[7],
                "genotype": cols[9] if len(cols) >= 10 else ".",
            })

    return {
        "sample_id": sample_id,
        "variants": variants,
        "metadata": metadata,
    }
