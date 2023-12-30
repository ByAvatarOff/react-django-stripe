import decimal
from django.contrib.auth.models import User
from currency_converter import CurrencyConverter
from django.db.models import Sum
from items.models import Order, Item, Discount
from django.db.models.query import QuerySet


def create_order(stripe_order_id: str, item: Item | QuerySet, user: User) -> bool:
    """
    Create order instance with type orderL incomplete

    """
    order = Order.objects.create(stripe_order_id=stripe_order_id, type_order='incomplete', user=user)
    if isinstance(item, Item):
        order.item.add(item)
        return True
    elif isinstance(item, QuerySet):
        order.item.add(*item)
        return True
    return False


def apply_discounts(total_price: decimal.Decimal, user: User) -> decimal.Decimal:
    """
    Apply discount for order price
    """
    total_discount = Discount.objects.filter(user=user).aggregate(total_discount=Sum('percent')).get('total_discount')
    if not total_discount:
        return total_price
    return total_price * (1 - total_discount / 100)


def convert_decimal_to_int_value(price: decimal) -> int:
    """
    Convert price for price with template: 121.00 and return int: 12100
    """

    return int(decimal.Decimal(f"{price:.2f}") * 100)


def convert_currency(items: QuerySet[Item], currency: str):
    """
    If multiply order currency only one return total price
    If currency more than one convert via CurrencyConverter library to currency given in request
    """
    if len(items.values_list('currency', flat=True).distinct()) < 2:
        return items.aggregate(total_price=Sum('price')).get('total_price')
    try:
        c = CurrencyConverter()
        total_convert_price = sum([item.price
                                   if str(item.currency).upper() == currency.upper()
                                   else decimal.Decimal(
            c.convert(item.price, str(item.currency).upper(), currency.upper()))
                                   for item in items])
        return total_convert_price
    except ValueError:
        return {'error': "unexpected currency"}
