from django.contrib.auth.base_user import BaseUserManager
from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.db import models
from django.utils.translation import gettext_lazy as _

class UserManager(BaseUserManager):
    def create_user(self, username, email, account_type, first_name, last_name, password=None):
        if not username:
            raise ValueError('Must have an username')

        if not email:
            raise ValueError('Must have an email')

        if not account_type:
            raise ValueError('Must have an account type')

        if not first_name:
            raise ValueError('Must have a first name')

        if not account_type:
            raise ValueError('Must have a last name')

        user = self.model(
            username=username,
            email=self.normalize_email(email),
            account_type=account_type,
            first_name=first_name,
            last_name=last_name
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_staffuser(self, username, email, account_type, first_name, last_name, password):
        user = self.create_user(
            username,
            email,
            account_type,
            first_name,
            last_name,
            password,
        )
        user.staff = True
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, account_type, first_name, last_name, password):
        user = self.create_user(
            username,
            email,
            account_type,
            first_name,
            last_name,
            password,
        )
        user.staff = True
        user.admin = True
        user.save(using=self._db)
        return user


# https://docs.djangoproject.com/en/dev/topics/auth/customizing/#a-full-example
class RestifyUser(AbstractBaseUser):
    username = models.CharField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone_number = models.CharField(max_length=10, blank=True, null=True)
    account_type = models.CharField(max_length=255) # Backend endpoints would check account type.
    avatar = models.ImageField(upload_to="avatars/")
    is_active = models.BooleanField(default=True)
    staff = models.BooleanField(default=False) # An admin user; non super-user
    admin = models.BooleanField(default=False) # A superuser

    objects = UserManager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email", "first_name", "last_name", "account_type"]

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"

    def get_short_name(self):
        return self.first_name

    def __str__(self):
        return self.username

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.staff

    @property
    def is_admin(self):
        return self.admin
