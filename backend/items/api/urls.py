from django.urls import path
from .views import ItemViewSet, OrderViewSet, BasketViewSet, DiscountViewSet


urlpatterns = [
    path('all_items/', ItemViewSet.as_view({"get": "list_all_items"}),
         name='list_all_items'),
    path('item/<int:pk>/', ItemViewSet.as_view({"get": "get_item"}),
         name='list_all_items'),
    path('buy/<int:pk>/', ItemViewSet.as_view({"get": "buy_item"}),
         name='list_all_items'),

    path('orders_list/', OrderViewSet.as_view({"get": "list_all_orders"}),
         name='list_all_orders'),
    path('update_order_type/', OrderViewSet.as_view({"post": "update_type_order"}),
         name='update_type_order'),

    path('basket_list/', BasketViewSet.as_view({"get": "list_items_in_basket"}),
         name='list_items_in_basket'),
    path('basket_add/', BasketViewSet.as_view({"post": "add_item_in_basket"}),
         name='add_item_in_basket'),
    path('delete_from_basket/<int:pk>/', BasketViewSet.as_view({"delete": "delete_item_from_basket"}),
         name='delete_item_from_basket'),
    path('create_multiply_order/<str:ids>/<str:currency>/', BasketViewSet.as_view({"get": "confirm_order_in_basket"}),
         name='confirm_order_in_basket'),

    path('user_discount/', DiscountViewSet.as_view({"get": "list_user_discount"}),
         name='list_user_discount'),
]