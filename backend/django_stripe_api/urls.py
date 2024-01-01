from django.urls import path, include
from django.contrib import admin

from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/items/', include('items.api.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_view'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
