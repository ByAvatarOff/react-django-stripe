from django.contrib import admin
from .models import Item, Currency, Order, Basket, Discount


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'price', 'date_add', 'user']


@admin.register(Currency)
class CurrencyAdmin(admin.ModelAdmin):
    list_display = ['type_currency', 'id', ]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['stripe_order_id', 'user']


@admin.register(Basket)
class BasketAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', ]


@admin.register(Discount)
class DiscountAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'percent', ]