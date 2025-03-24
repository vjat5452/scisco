from django.urls import path
from .views import PlatformView

urlpatterns = [
    path('<str:platform>/<str:username>/', PlatformView.as_view(), name='platform_view')
]