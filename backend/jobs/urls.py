from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, VerifyEmailView, LoginView, UserViewSet
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    # Auth Endpoints
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/email-verify/', VerifyEmailView.as_view(), name='email-verify'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User Management Endpoints
    path('', include(router.urls)),
]
