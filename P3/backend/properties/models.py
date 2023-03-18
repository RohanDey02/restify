from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from accounts.models import RestifyUser

class Property(models.Model):
    title = models.CharField(max_length=255, blank=False, null=False)
    location = models.CharField(max_length=255, blank=False, null=False)
    description = models.TextField(blank=False, null=False)
    max_number_of_guests = models.PositiveIntegerField(blank=False, null=False)
    price = models.FloatField(validators=[MinValueValidator(0.0)], blank=False, null=False)
    amenities = models.TextField(null=False)
    host = models.ForeignKey(RestifyUser, on_delete=models.CASCADE, limit_choices_to={'account_type': 'Host'}) # Host can have multiple properties. Backend endpoints would check account type.

    def __str__(self) -> str:
        return self.title

def create_image_filename(instance, filename):
    title = instance.property.title
    return "property/%s-%s" % (title, filename)

class PropertyImages(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    image = models.ImageField(upload_to=create_image_filename)
