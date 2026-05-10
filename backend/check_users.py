import os
import sys
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "sport_app.settings")
django.setup()

from users.models import CustomUser

with open("users_log.txt", "w") as f:
    users = CustomUser.objects.all()
    if not users:
        f.write("NO USERS IN DB\n")
    else:
        for u in users:
            f.write(f"{u.email} - {u.role}\n")
