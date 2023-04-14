#!/bin/bash

# Backend
cd backend

# Check if Python is installed
python3.11 --version
if [ $? -eq 127 ] ; then
    sudo add-apt-repository ppa:deadsnakes/ppa
    sudo apt update
    sudo apt install python3.11
    sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.11 1
fi

sudo apt remove python3-apt
sudo apt autoremove
sudo apt autoclean
sudo apt install python3-apt

pip3 --version
if [ $? -eq 127 ] ; then
    sudo apt install python3-pip
fi

sudo apt install curl
curl -sS https://bootstrap.pypa.io/get-pip.py | sudo python3.11

# Go back to current directory
cd restify

# Install virtualenv
pip3 install virtualenv

# Create folder and activate
python3 -m virtualenv venv
chmod +x venv/bin/activate
source venv/bin/activate

# Install dependencies
pip3 install -r packages.txt

python3 manage.py makemigrations
python3 manage.py migrate

cd ../..

# Frontend
cd frontend

npm install -g typescript
npm install

cd ..
