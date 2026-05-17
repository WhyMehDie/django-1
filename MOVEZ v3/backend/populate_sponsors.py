import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "sport_app.settings")
django.setup()

from competitions.models import Sponsor

def run():
    if not Sponsor.objects.exists():
        Sponsor.objects.create(name='MAROC TELECOM', logo_url='https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Maroc_Telecom_logo.svg/512px-Maroc_Telecom_logo.svg.png', order=1)
        Sponsor.objects.create(name='RED BULL', logo_url='https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/RedBullEnergyDrink.svg/512px-RedBullEnergyDrink.svg.png', order=2)
        Sponsor.objects.create(name='LOGITECH G', logo_url='https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Logitech_G_logo.svg/512px-Logitech_G_logo.svg.png', order=3)
        Sponsor.objects.create(name='ROYAL AIR MAROC', logo_url='https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Royal_Air_Maroc_Logo.svg/512px-Royal_Air_Maroc_Logo.svg.png', order=4)
        Sponsor.objects.create(name='NIKE SPORTS', logo_url='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/512px-Logo_NIKE.svg.png', order=5)
        Sponsor.objects.create(name='SIDI ALI', logo_url='https://placehold.co/200x80/12333E/FFF?text=SIDI+ALI&font=montserrat', order=6)
        print("Sponsors added to database!")
    else:
        print("Sponsors already exist in database.")

if __name__ == '__main__':
    run()
