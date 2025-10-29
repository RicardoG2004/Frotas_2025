#!/bin/bash
while getopts e:n: flag
do
    case "${flag}" in
        e) environment=${OPTARG};;
        n) migration=${OPTARG};;
    esac
done

export ASPNETCORE_ENVIRONMENT=$environment
echo "Setting environment to: $environment"
echo "Creating migration: $migration"

dotnet ef migrations add "$migration" \
    -c ApplicationDbContext \
    -s GSLP.WebApi/ \
    -p GSLP.Infrastructure/ \
    -o Persistence/Migrations 