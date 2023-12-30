from django_stripe_api.settings import STRIPE_API_KEY, SITE_URL
from rest_framework.response import Response
from rest_framework import viewsets, status, permissions
from items.models import Item, Basket, Order, Discount
from items.api.serializers import ItemListSerializer, ItemRetrieveSerializer, OrderListSerializer, \
    BasketAddSerializer, BasketListSerializer, DiscountListSerializer
from services.items_service import create_order, convert_decimal_to_int_value, convert_currency, apply_discounts

import stripe

stripe.api_key = STRIPE_API_KEY


class ItemViewSet(viewsets.ViewSet):
    """
    Class view model Item
    Methods:
        list_all_items[GET]: return list all items
        get_item[GET<item_id>]: return one item
        buy_item[GET]<item_id>; Need Auth: create stripe intent session and return it instance
    """
    permission_classes_by_action = {
        'buy_item': [permissions.IsAuthenticated, ],
    }

    def list_all_items(self, request):
        """
        Generate list of all items
        Return serialized data about all items
        """
        queryset = Item.objects.all() \
            .select_related('user', 'currency')
        serializer = ItemListSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get_item(self, request, pk: int):
        """
        Get item object use item_id given in the get parameter.
        Return serialized data about item
        """
        try:
            queryset = Item.objects.get(id=pk)
            serializer = ItemRetrieveSerializer(queryset)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Item.DoesNotExist:
            return Response(data={"error": "Item with get id not found"}, status=status.HTTP_404_NOT_FOUND)

    def buy_item(self, request, pk: int):
        """
        Get item object use item_id given in the get parameter.
        Create Payment Intent use item attributes
        Create row in model order
        Return Payment Intent
        """
        try:
            item = Item.objects.get(id=pk)
            payment_intent = stripe.PaymentIntent.create(
                amount=convert_decimal_to_int_value(item.price),
                currency=item.currency.type_currency,
                payment_method_types=["card"],
                metadata={
                    'price': item.price,
                    'name_item': item.name
                }
            )
            order = create_order(payment_intent.id, item, request.user)
            if not order:
                return Response({'error': 'Something was wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response(data=dict(payment_intent), status=status.HTTP_200_OK)

        except Item.DoesNotExist:
            return Response(data={"error": "Error. Item with get id not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
            return Response({'error': 'Something was wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get_permissions(self):
        try:
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except KeyError:
            return [permission() for permission in self.permission_classes]


class OrderViewSet(viewsets.ViewSet):
    """
    Class view model Order
    Methods:
        list_all_orders[GET] Need auth: return list all user orders
    """

    permission_classes_by_action = {
        'list_all_orders': [permissions.IsAuthenticated, ],
    }

    def list_all_orders(self, request):
        queryset = Order.objects.filter(user=request.user).order_by('-id').prefetch_related('item')
        serializer = OrderListSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update_type_order(self, request):
        event = None
        payload = request.data
        sig_header = request.headers['STRIPE_SIGNATURE']

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, stripe.api_key
            )
        except ValueError as e:
            raise e
        except stripe.error.SignatureVerificationError as e:
            raise e

        if event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
        else:
            print('Unhandled event type {}'.format(event['type']))

        return Response(status=status.HTTP_200_OK)

    def get_permissions(self):
        try:
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except KeyError:
            return [permission() for permission in self.permission_classes]


class BasketViewSet(viewsets.ViewSet):
    """
    Class view model Basket
    Methods:
        list_items_in_basket[GET] Need auth: return list all user items in the basket
        add_item_in_basket[POST] Need auth: Create Basket instance and return
        delete_item_from_basket[DELETE]<item_id> Need auth: Delete user item in the basket
                                                            and return new list of all items in basket
        confirm_order_in_basket[GET]<item_ids><currency> Need auth: filter items use list of given ids
    """

    permission_classes_by_action = {
        'list_items_in_basket': [permissions.IsAuthenticated, ],
        'add_item_in_basket': [permissions.IsAuthenticated, ],
        'delete_item_from_basket': [permissions.IsAuthenticated, ],
        'confirm_order_in_basket': [permissions.IsAuthenticated, ],
    }

    def list_items_in_basket(self, request):
        queryset = Basket.objects.filter(user=request.user).order_by('-id') \
            .select_related('user', 'item')
        serializer = BasketListSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def add_item_in_basket(self, request):
        try:
            serializer = BasketAddSerializer(data={'user': request.user.id, 'item': request.data.get('item_id')})
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(status=status.HTTP_201_CREATED)
        except Item.DoesNotExist:
            return Response(data={"error": "Error. Item with get id not found"}, status=status.HTTP_404_NOT_FOUND)

    def delete_item_from_basket(self, request, pk):
        try:
            queryset = Basket.objects.get(user=request.user, item__id=pk)
            queryset.delete()
            updated_basket = Basket.objects.filter(user=request.user).order_by('-id').select_related('item', 'user')
            serializer = BasketListSerializer(updated_basket, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Basket.DoesNotExist:
            return Response(data={"error": "Error. Item with get id not found"}, status=status.HTTP_404_NOT_FOUND)

    def confirm_order_in_basket(self, request, ids, currency):
        items = Item.objects.filter(id__in=ids.split(','))
        if not items:
            return Response(data={'message': 'Your basket is empty'}, status=status.HTTP_400_BAD_REQUEST)
        info_items = " ".join([f'{item.name} - {item.price}{item.currency}' for item in items])
        payment_intent = stripe.PaymentIntent.create(
            amount=convert_decimal_to_int_value(apply_discounts(convert_currency(items, currency), request.user)),
            currency=currency,
            payment_method_types=['card'],
            metadata={'items_data': info_items}
        )
        order = create_order(payment_intent.id, items, request.user)
        if not order:
            return Response({'error': 'Order not created'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(data=dict(payment_intent), status=status.HTTP_200_OK)

    def get_permissions(self):
        try:
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except KeyError:
            return [permission() for permission in self.permission_classes]


class DiscountViewSet(viewsets.ViewSet):
    """
    Class view model Discount
    Methods:
        list_user_discount[GET] Need auth: return list all user discount
    """

    permission_classes_by_action = {
        'list_all_orders': [permissions.IsAuthenticated, ],
    }

    def list_user_discount(self, request):
        queryset = Discount.objects.filter(user=request.user).prefetch_related('user')
        serializer = DiscountListSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get_permissions(self):
        try:
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except KeyError:
            return [permission() for permission in self.permission_classes]


