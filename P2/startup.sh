# Go back to current directory
cd restify

# Install virtualenv
pip install virtualenv

# Create folder and activate
virtualenv venv 
chmod +x venv/bin/activate
source venv/bin/activate

# Install dependencies
pip install -r packages.txt

./manage.py makemigrations
./manage.py migrate
