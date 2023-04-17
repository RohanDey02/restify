from django.db import models
from accounts.models import RestifyUser

class Notifications(models.Model):
    title = models.CharField(max_length=255, blank=False, null=False)
    description = models.TextField(blank=False, null=False)
    url = models.URLField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=255, null=False)
    user = models.ForeignKey(RestifyUser, on_delete=models.CASCADE, related_name='user', limit_choices_to={'account_type': 'User'}, null=True) # Make sure it is only 1 in the backend implementation
    host = models.ForeignKey(RestifyUser, on_delete=models.CASCADE, related_name='host', limit_choices_to={'account_type': 'Host'}, null=True) # Make sure it is only 1 in the backend implementation

    def __str__(self) -> str:
        return self.title
