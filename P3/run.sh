#!/bin/bash

cd backend ; source ./venv/Scripts/activate ; py manage.py runserver & cd ../frontend ; npm start && fg
