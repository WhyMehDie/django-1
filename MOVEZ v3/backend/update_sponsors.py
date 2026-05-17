import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "sport_app.settings")
django.setup()

from competitions.models import Sponsor

updates = {
    'MAROC TELECOM': '/sponsors/maroc_telecom.png',
    'RED BULL': '/sponsors/red_bull.png',
    'LOGITECH G': '/sponsors/logitech.png',
    'ROYAL AIR MAROC': '/sponsors/royal_air_maroc.png',
    'NIKE SPORTS': '/sponsors/nike_sports.png',
    'SIDI ALI': '/sponsors/sidi_ali.png',
}

def run():
    for name, new_url in updates.items():
        Sponsor.objects.filter(name=name).update(logo_url=new_url)
    print("Successfully updated sponsor logos to use local images from the frontend public folder!")

if __name__ == '__main__':
    run()
