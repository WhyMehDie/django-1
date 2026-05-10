from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'ADMIN')
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('JOUEUR', 'Joueur'),
        ('COACH', 'Coach Sportif'),
        ('GERANT', 'Gérant Complexe'),
        ('ORGANISATEUR', 'Organisateur'),
        ('ADMIN', 'Admin'),
    ]

    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='JOUEUR')
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    bio = models.TextField(blank=True)
    sport = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    height = models.IntegerField(null=True, blank=True, help_text="Taille en cm")
    weight = models.IntegerField(null=True, blank=True, help_text="Poids en kg")
    position = models.CharField(max_length=50, blank=True, help_text="Poste préféré")
    instagram = models.CharField(max_length=50, blank=True)
    cover_photo = models.ImageField(upload_to='covers/', null=True, blank=True)
    gallery_1 = models.ImageField(upload_to='gallery/', null=True, blank=True)
    gallery_2 = models.ImageField(upload_to='gallery/', null=True, blank=True)
    elo_rating = models.IntegerField(default=1000)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.role})"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
