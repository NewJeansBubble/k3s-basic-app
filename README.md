# k3s-basic-app
[![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=fff)](#)
[![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=fff)](#)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=61DAFB)](#)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=fff)](#)
[![K3s](https://img.shields.io/badge/K3s-FFC61C?style=for-the-badge&logo=k3s&logoColor=000)](#)






## Overview

This repository contains a basic full-stack monorepo application with a frontend and a backend, designed to practice deploying applications to a lightweight Kubernetes cluster using k3s.

The goal is to follow the KISS principle in the aplication, while focusing on Kubernetes concepts such as deployments, services, configurations, networking, local cluster testing and much more.

## Project Structure
```bash
k3s-basic-app/
├─ .github/             # Github workflows
├─ backend/             # Simple backend API 
├─ docs/                # Basic documentation 
├─ frontend/            # Simple frontend
├─ k8s/                 # Kubernetes manifests
├─ .gitignore
└─ README.md
```

## Goals
- Learn the basics of deploying applications with k3s
- Pratice writing yaml manifests
- Deploy a simple frontend and backend
- Understand services and internal communication
- Maintain an CI/CD pipeline with github actions

## Requirements
- k3s installed and running
- kubectl configured
- Docker or another container runtime
- Basic knowledge of Kubernetes concepts

## Getting Started
Clone the repository:
```bash
git clone https://github.com/NewJeansBubble/k3s-basic-app.git
```

Check if the cluster is running:
```bash
kubectl get nodes
```

## Deploying to k3s
todo...