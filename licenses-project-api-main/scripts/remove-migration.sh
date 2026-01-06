#!/bin/bash
while getopts e: flag
do
    case "${flag}" in
        e) environment=${OPTARG};;
    esac
done

export ASPNETCORE_ENVIRONMENT=$environment
echo "Setting environment to: $environment"
echo "Removing last migration"

dotnet ef migrations remove \
    -c ApplicationDbContext \
    -s GSLP.WebApi/ \
    -p GSLP.Infrastructure/ 