#!/bin/bash

# Deploy script for vite-metronic-9 with custom hostname Oil.wintel.tech

NAMESPACE="vite-metronic-9"
APP_NAME="vite-metronic-9"

echo "=== Deploying vite-metronic-9 to OpenShift ==="

# Create namespace if not exists
echo "Creating namespace..."
oc get namespace $NAMESPACE || oc create namespace $NAMESPACE

# Apply deployment
echo "Applying deployment..."
oc apply -f deployment.yaml

# Apply service
echo "Applying service..."
oc apply -f service.yaml

# Apply route with custom hostname
echo "Applying route with custom hostname Oil.wintel.tech..."
oc apply -f route.yaml

# Wait for deployment to be ready
echo "Waiting for deployment to be ready..."
oc rollout status deployment/$APP_NAME -n $NAMESPACE --timeout=300s

# Get route URL
echo "=== Deployment Complete ==="
echo "Application URL: https://Oil.wintel.tech"
echo "Route details:"
oc get route $APP_NAME -n $NAMESPACE

# Check pod status
echo "Pod status:"
oc get pods -n $NAMESPACE -l app=$APP_NAME

echo "=== Deployment finished ===" 