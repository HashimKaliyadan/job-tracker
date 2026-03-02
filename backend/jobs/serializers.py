from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'role', 'is_email_verified', 'date_joined']
        read_only_fields = ['id', 'is_email_verified', 'date_joined']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['email', 'name', 'password', 'role']

    def validate_role(self, value):
        # Normally, an Admin creates other Admins/Managers. 
        # For an open registration, you might restrict this.
        # Assuming open registration allows choosing any role per requirements:
        if value not in dict(User.ROLE_CHOICES).keys():
            raise serializers.ValidationError("Invalid role.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            name=validated_data['name'],
            password=validated_data['password'],
            role=validated_data.get('role', 'User')
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'), email=email, password=password)

            if not user:
                raise serializers.ValidationError('Invalid login credentials.', code='authorization')
            
            if not user.is_email_verified:
                raise serializers.ValidationError('Email is not verified. Please check your inbox.', code='authorization')

        else:
            raise serializers.ValidationError('Must include "email" and "password".', code='authorization')

        data['user'] = user
        return data
