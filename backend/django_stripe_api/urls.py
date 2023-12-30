from django.conf.urls.static import static
from django.urls import path, include
from django.views.generic import TemplateView
from django.contrib import admin
from django.conf import settings

from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/items/', include('items.api.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_view'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('', TemplateView.as_view(template_name='index.html')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

