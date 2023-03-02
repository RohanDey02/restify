from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.db.models.deletion import SET_NULL

class Comment(models.Model):
    message = models.TextField(blank=False, null=False)
    sender_type = models.CharField(max_length=255, blank=False, null=False)
    last_modified = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.sender_type} // {self.last_modified}"

class Feedback(models.Model):
    user_rating = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(5.0)], blank=True, null=True)
    property_rating = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(5.0)], blank=True, null=True)
    comments = models.ForeignKey(Comment, on_delete=models.SET_NULL, null=True)
