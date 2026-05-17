import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sport_app.settings')
django.setup()

from users.models import CustomUser

def valider_comptes_test():
    comptes = [
        ('admin@sport.ma', 'Admin@1234', 'Admin', 'Sport', 'ADMIN', True),
        ('joueur@sport.ma', 'Joueur@1234', 'Karim', 'Benzema', 'JOUEUR', False),
        ('joueur2@sport.ma', 'Joueur@1234', 'Riyad', 'Mahrez', 'JOUEUR', False),
        ('org@sport.ma', 'Org@1234', 'Omar', 'Berrada', 'ORGANISATEUR', False)
    ]

    print("\n--- Création des comptes de test ---")
    for email, password, first, last, role, is_super in comptes:
        if not CustomUser.objects.filter(email=email).exists():
            if is_super:
                CustomUser.objects.create_superuser(
                    email=email, password=password, first_name=first, last_name=last
                )
            else:
                CustomUser.objects.create_user(
                    email=email, password=password, first_name=first, last_name=last, role=role
                )
            print(f"✅ {email} créé !")
        else:
            print(f"⚠️ {email} existe déjà.")

if __name__ == '__main__':
    valider_comptes_test()
