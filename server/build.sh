set -o errexit #abort if any command fails

pip install -r requirements.txt

python manage.py migrate

# Path: server/build.sh