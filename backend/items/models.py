from django.db import models
from datetime import datetime
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator


class Currency(models.Model):
    type_currency = models.CharField(max_length=10, unique=True)

    def __str__(self):
        return self.type_currency


class Item(models.Model):
    """
    Class for view item
    """
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(decimal_places=2, max_digits=10, validators=[MinValueValidator(0.0)])
    currency = models.ForeignKey(Currency, on_delete=models.DO_NOTHING, null=True)
    date_add = models.DateTimeField(default=datetime.now)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Order(models.Model):
    """
    class for record all user orders
    """
    TYPE_ORDER_CHOICE = {
        'success': 'success',
        'incomplete': 'incomplete',
        'failed': 'failed'
    }

    stripe_order_id = models.CharField(max_length=255)
    date_create_order = models.DateTimeField(default=datetime.now)
    type_order = models.CharField(max_length=20, choices=TYPE_ORDER_CHOICE)
    item = models.ManyToManyField(Item)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.stripe_order_id


class Basket(models.Model):
    """
    Class for record more than one user order
    """
    item = models.ForeignKey(Item, on_delete=models.CASCADE, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class Discount(models.Model):
    title = models.CharField(max_length=30)
    percent = models.DecimalField(decimal_places=2, max_digits=4, validators=[MinValueValidator(0.0)])
    user = models.ManyToManyField(User, blank=True)
