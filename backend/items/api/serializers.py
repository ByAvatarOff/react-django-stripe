from rest_framework import serializers

from items.models import Item, Basket, Order, Currency, Discount


class ItemListSerializer(serializers.ModelSerializer):
    """
    Serializer for all item
    """

    currency = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = ('id', 'name', 'description', 'price', 'currency')

    def get_currency(self, obj):
        return obj.currency.type_currency


class ItemRetrieveSerializer(serializers.ModelSerializer):
    """
    Serializer for one item
    """

    currency = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = ('id', 'name', 'description', 'price', 'currency')

    def get_currency(self, obj):
        return obj.currency.type_currency


class OrderListSerializer(serializers.ModelSerializer):
    """
    Serializer for user list orders
    """

    item = ItemRetrieveSerializer(many=True)

    class Meta:
        model = Order
        fields = ('id', 'type_order', 'date_create_order', 'item')


class BasketListSerializer(serializers.ModelSerializer):
    """
    Serializer for added items in the basket
    """
    item = ItemRetrieveSerializer()

    class Meta:
        model = Basket
        fields = ['user', 'item']


class BasketAddSerializer(serializers.ModelSerializer):
    """
    Serializer for add item in the basket
    """

    class Meta:
        model = Basket
        fields = ['user', 'item']

    def validate(self, data):
        if Basket.objects.filter(item=data.get('item'), user=data.get('user')):
            raise serializers.ValidationError('This item was add in the basket')

        return data


class DiscountListSerializer(serializers.ModelSerializer):
    """
    Serializer for added items in the basket
    """

    class Meta:
        model = Discount
        fields = ['title', 'percent', ]



