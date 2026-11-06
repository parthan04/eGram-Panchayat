from django.apps import AppConfig
from django.db.models.signals import post_migrate


def create_admin(sender, **kwargs):
    from django.conf import settings
    from django.contrib.auth import get_user_model
    User = get_user_model()

    admin = User.objects.filter(username=settings.ADMIN_USERNAME).first()
    if admin:
        User.objects.filter(pk=admin.pk).update(role='admin', is_superuser=True, is_staff=True)
        return

    User.objects.create_superuser(
        username=settings.ADMIN_USERNAME,
        email=settings.ADMIN_EMAIL,
        password=settings.ADMIN_PASSWORD,
        phone='0000000000', address='Panchayat Office', district='-',
        dob='2000-01-01', id_proof='-', role='admin',
    )


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        post_migrate.connect(create_admin, sender=self)