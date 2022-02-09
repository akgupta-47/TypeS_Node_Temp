#!/bin/bash

read fname

cd src

#create controller
cd controller

touch "$fname.controller.ts"

#create controller to control models
cd ../service

touch "$fname.service.ts"

#create models of mongo
cd ../models

touch "$fname.model.ts"

#create schema for models and data
cd ../schema

touch "$fname.schema.ts"