from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('email', 'password', 'password2', 'first_name', 'last_name', 'role', 'sport', 'city')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Les mots de passe ne correspondent pas."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id', 'email', 'first_name', 'last_name', 'full_name',
            'role', 'avatar', 'bio', 'sport', 'city', 'phone',
            'height', 'weight', 'position', 'instagram', 'cover_photo', 'gallery_1', 'gallery_2',
            'elo_rating', 'average_rating', 'date_joined'
        )
        read_only_fields = ('id', 'email', 'elo_rating', 'date_joined')

    def get_average_rating(self, obj):
        evals = obj.evaluations_received.all()
        if evals.exists():
            return round(sum(e.rating for e in evals) / evals.count(), 1)
        return None


class UserPublicSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'full_name', 'role', 'avatar', 'sport', 'city', 'height', 'weight', 'position', 'instagram', 'cover_photo', 'gallery_1', 'gallery_2', 'elo_rating', 'average_rating')

    def get_average_rating(self, obj):
        evals = obj.evaluations_received.all()
        if evals.exists():
            return round(sum(e.rating for e in evals) / evals.count(), 1)
        return None
