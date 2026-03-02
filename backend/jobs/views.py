from rest_framework import generics, serializers, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.core.mail import send_mail
from django.conf import settings
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str

from .models import User
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer
from .tokens import email_verification_token
from .permissions import IsAdmin, IsOwnerOrAdmin, IsActionAllowed

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        self.send_verification_email(user)

    def send_verification_email(self, user):
        token = email_verification_token.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        # In a real app with a frontend, URL would be the React/NextJS route:
        # e.g. f"http://localhost:3000/verify-email?uid={uid}&token={token}"
        # For simplicity now, we'll route it back to a backend endpoint:
        current_site = get_current_site(self.request).domain
        relative_link = reverse('email-verify')
        absurl = f'http://{current_site}{relative_link}?uid={uid}&token={token}'

        email_body = f'Hi {user.name},\n\nPlease use the link below to verify your email address:\n{absurl}'
        
        send_mail(
            subject='Verify your email',
            message=email_body,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email],
            fail_silently=False,
        )

class VerifyEmailView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        token = request.GET.get('token')
        uidb64 = request.GET.get('uid')

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and email_verification_token.check_token(user, token):
            if user.is_email_verified:
                return Response({'message': 'Email is already verified.'}, status=status.HTTP_200_OK)
            
            user.is_email_verified = True
            user.save()
            return Response({'message': 'Email successfully verified. You can now login.'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Activation link is invalid or expired!'}, status=status.HTTP_400_BAD_REQUEST)

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })

class UserViewSet(viewsets.ModelViewSet):
    """
    CRUD User Management Viewset:
    - Admin: Can list, retrieve, create, update, delete all users.
    - Manager: Can list/retrieve users (read-only for users).
    - User: Can only retrieve and update their own profile.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsActionAllowed, IsOwnerOrAdmin]

    def get_queryset(self):
        # A User should only see themselves in the list view,
        # Admins/Managers can see everyone.
        # Standard 'User' can list (filtered by queryset) and manage own profile
        user = self.request.user
        if user.role in ['Admin', 'Manager']:
            return User.objects.all()
        return User.objects.filter(id=user.id)

    def perform_update(self, serializer):
        # Prevent Managers or Users from changing roles
        if self.request.user.role != 'Admin' and 'role' in self.request.data:
            raise serializers.ValidationError({"role": "Only an Admin can change user roles."})
        serializer.save()
