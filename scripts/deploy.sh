#!/bin/bash

# Load environment variables from .env file
if [ ! -f .env ]; then
  echo "Error: .env file not found!"
  exit 1
fi

export $(grep -v '^#' .env | xargs)

# Verify required environment variables
if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ] || [ -z "$AWS_REGION" ]; then
  echo "Error: Missing required AWS credentials in .env file."
  exit 1
fi

# Debugging output
echo "Loaded environment variables:"
echo "AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID"
echo "AWS_REGION=$AWS_REGION"

# Check if the infra directory exists
if [ ! -d "infra" ]; then
  echo "Error: 'infra' directory not found!"
  exit 1
fi

# Change to infra directory
cd infra || exit

# Initialize Terraform
terraform init

# Destroy existing infrastructure
echo "Destroying existing infrastructure..."
terraform destroy -auto-approve

# Apply new configuration
echo "Applying new infrastructure..."
terraform apply -auto-approve -var aws_access_key=$AWS_ACCESS_KEY_ID \
                                  -var aws_secret_key=$AWS_SECRET_ACCESS_KEY \
                                  -var aws_region=$AWS_REGION
