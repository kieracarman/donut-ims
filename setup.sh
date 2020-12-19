#!/bin/bash

npm ci
cd server && npm ci
cd ../client && npm ci
