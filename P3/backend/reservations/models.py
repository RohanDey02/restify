from django.db import models
from django.db.models.fields.related import OneToOneField
from accounts.models import RestifyUser
from comments.models import Feedback
from properties.models import Property

class Reservation(models.Model):
    start_date = models.DateField(blank=False, null=False)
    end_date = models.DateField(blank=False, null=False)
    status = models.CharField(max_length=255, blank=False, null=False)
    feedback = OneToOneField(Feedback, on_delete=models.SET_NULL, blank=True, null=True)

    # Foreign Keys
    user = models.ForeignKey(RestifyUser, on_delete=models.CASCADE, limit_choices_to={'account_type': 'User'})
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="reservations")
