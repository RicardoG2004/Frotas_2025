#!/bin/bash

# Clean any existing certificates
dotnet dev-certs https --clean

# Create directory if it doesn't exist
mkdir -p ./certs/

# Generate certificate
dotnet dev-certs https -ep ./certs/cert.pfx -p ${CERT_PASSWORD:-password123}

# Trust the certificate
dotnet dev-certs https --trust

echo "Certificates have been set up successfully!" 