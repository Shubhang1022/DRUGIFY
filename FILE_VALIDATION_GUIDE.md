# File Validation Guide

## Overview

DRUGIFY now includes comprehensive file validation to ensure only valid VCF files are processed. Users receive clear, detailed error messages when attempting to upload incorrect files.

## Validation Layers

### 1. **File Extension Validation**
- **Requirement**: Files must have `.vcf` extension
- **Error Message**: 
  ```
  ❌ Wrong file format: "example.txt"
  
  This application only accepts VCF (Variant Call Format) files.
  
  Expected: .vcf extension
  Received: TXT file
  
  Please upload a valid VCF file to proceed.
  ```

### 2. **File Size Validation**
- **Requirement**: Files must be under 5 MB
- **Error Message**:
  ```
  ❌ File exceeds size limit: "large_file.vcf"
  
  Current size: 7.45 MB
  Maximum allowed: 5.00 MB
  
  Please reduce the file size or upload a different VCF file.
  ```

### 3. **Empty File Detection**
- **Requirement**: Files must contain data (> 0 bytes)
- **Error Message**:
  ```
  ❌ Empty file: "empty.vcf"
  
  The uploaded file appears to be empty (0 bytes).
  
  Please upload a valid VCF file with genomic data.
  ```

### 4. **VCF Format Validation**
- **Requirement**: Files must start with `##fileformat=VCF`
- **Error Message**:
  ```
  ❌ Invalid VCF format: "not_vcf.vcf"
  
  This file does not appear to be a valid VCF file.
  
  VCF files must start with: ##fileformat=VCF
  Your file starts with: FASTA format detected...
  
  Please upload a properly formatted VCF v4.2 file.
  ```

### 5. **Content Validation**
- **Requirement**: Files must contain readable text data
- **Error Message**:
  ```
  ❌ Empty file content: "corrupted.vcf"
  
  The file appears to be empty or contains no readable data.
  
  Please upload a valid VCF file with genomic variants.
  ```

### 6. **Analysis Validation**
- **Requirement**: Files must be parseable by the VCF parser
- **Error Message**:
  ```
  ❌ Analysis Failed
  
  Failed to analyze the VCF file. The file may be corrupted or not in the correct format.
  
  Error details: Invalid variant format at line 45
  
  Please ensure:
  • The file is in VCF v4.2 format
  • The file contains valid genomic variant data
  • The file is not corrupted
  
  Try the "Run Demo" button to see a working example.
  ```

## User Interface Improvements

### Information Box
A blue information box displays accepted file requirements:
- Format: VCF (Variant Call Format) v4.2
- Extension: .vcf only
- Max Size: 5 MB
- Max Variants: 100,000

### Error Display
Errors are shown in a prominent red box with:
- ❌ Icon for visual clarity
- "Upload Error" heading
- Detailed multi-line error message
- Specific guidance on how to fix the issue

### Drag & Drop Feedback
- **Idle State**: "Drag & drop a VCF file"
- **Active Drag**: "Drop your VCF file here"
- **File Selected**: Shows file name and size with green checkmark
- **Error State**: Red border with detailed error message

## Accepted File Types

### MIME Types
- `text/plain` with `.vcf` extension
- `application/octet-stream` with `.vcf` extension

### File Requirements
1. **Extension**: Must be `.vcf` (case-insensitive)
2. **Size**: Maximum 5 MB (5,242,880 bytes)
3. **Format**: VCF v4.2 specification
4. **Header**: Must start with `##fileformat=VCF`
5. **Content**: Must contain valid genomic variant data

## Common Error Scenarios

### Scenario 1: Wrong File Type
**User Action**: Uploads `data.txt` or `genome.fasta`  
**Result**: Clear error explaining only .vcf files are accepted  
**Solution**: Convert file to VCF format or upload correct file

### Scenario 2: File Too Large
**User Action**: Uploads 10 MB VCF file  
**Result**: Error showing current size vs. maximum allowed  
**Solution**: Compress file or filter variants to reduce size

### Scenario 3: Corrupted File
**User Action**: Uploads damaged or incomplete VCF file  
**Result**: Error during analysis with specific error details  
**Solution**: Re-download or regenerate VCF file

### Scenario 4: Wrong Format
**User Action**: Uploads file with .vcf extension but FASTA content  
**Result**: Error showing expected vs. actual file header  
**Solution**: Upload actual VCF file, not renamed FASTA

## Testing

### Valid File Test
```bash
# Create a valid VCF file
cat > test.vcf << EOF
##fileformat=VCFv4.2
##source=TestData
#CHROM	POS	ID	REF	ALT	QUAL	FILTER	INFO
1	100	rs123	A	G	99	PASS	DP=50
EOF

# Upload test.vcf - Should succeed ✅
```

### Invalid Extension Test
```bash
# Create a file with wrong extension
cat > test.txt << EOF
##fileformat=VCFv4.2
#CHROM	POS	ID	REF	ALT	QUAL	FILTER	INFO
1	100	rs123	A	G	99	PASS	DP=50
EOF

# Upload test.txt - Should fail with extension error ❌
```

### Invalid Format Test
```bash
# Create a file with VCF extension but wrong content
cat > test.vcf << EOF
>Sequence1
ATCGATCGATCG
EOF

# Upload test.vcf - Should fail with format error ❌
```

### Large File Test
```bash
# Create a file larger than 5MB
dd if=/dev/zero of=large.vcf bs=1M count=6

# Upload large.vcf - Should fail with size error ❌
```

## Benefits

1. **User-Friendly**: Clear, actionable error messages
2. **Preventive**: Catches errors before processing
3. **Educational**: Explains what went wrong and how to fix it
4. **Secure**: Validates file content, not just extension
5. **Efficient**: Fails fast on invalid files
6. **Professional**: Polished error handling experience

## Future Enhancements

- [ ] Support for compressed VCF files (.vcf.gz)
- [ ] Batch file upload
- [ ] File preview before analysis
- [ ] Automatic file format conversion
- [ ] More detailed VCF validation (column count, data types)
- [ ] Sample file download for reference

---

**Last Updated**: 2026-02-19  
**Version**: 1.0.0
