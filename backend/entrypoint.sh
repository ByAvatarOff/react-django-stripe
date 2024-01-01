python3 manage.py makemigrations
python3 manage.py migrate --no-input
python3 manage.py makemigrations items
python3 manage.py migrate items
python3 manage.py collectstatic

gunicorn django_stripe_api.wsgi:application --bind 0.0.0.0:8000