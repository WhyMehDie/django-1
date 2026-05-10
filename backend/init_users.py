import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sport_app.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

print("Users in DB:", User.objects.count())

accounts = [
    ('admin@sport.ma', 'Admin@1234', 'ADMIN', True),
    ('joueur@sport.ma', 'Joueur@1234', 'JOUEUR', False),
    ('joueur2@sport.ma', 'Joueur@1234', 'JOUEUR', False),
    ('org@sport.ma', 'Org@1234', 'ORGANISATEUR', False),
]

for email, password, role, is_staff in accounts:
    user = User.objects.filter(email=email).first()
    if user:
        print(f"{email}: exists. password matches? {user.check_password(password)}")
        if not user.check_password(password):
            user.set_password(password)
            user.save()
            print(f" -> updated password for {email}")
    else:
        print(f"{email}: missing. creating...")
        name = email.split('@')[0].capitalize()
        user = User.objects.create_user(
            email=email, 
            password=password, 
            role=role, 
            first_name=name, 
            last_name='Test',
            is_staff=is_staff,
            is_superuser=is_staff
        )
        print(f" -> created {email}")
