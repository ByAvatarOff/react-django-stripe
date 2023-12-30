python manage.py makemigrations
python manage.py migrate --no-input

gunicorn django_stripe_api.wsgi:application --bind 0.0.0.0:8000