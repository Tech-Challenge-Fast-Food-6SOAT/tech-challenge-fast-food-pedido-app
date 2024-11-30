#!/bin/bash

K8S_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
kubectl apply -f "$K8S_DIR/configmap.yaml" -n lanchonete-pedido
kubectl apply -f "$K8S_DIR/deployment.yaml" -n lanchonete-pedido
kubectl apply -f "$K8S_DIR/service.yaml" -n lanchonete-pedido
kubectl apply -f "$K8S_DIR/hpa.yaml" -n lanchonete-pedido
