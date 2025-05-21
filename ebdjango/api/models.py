from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

# Create your models here.
class CustomUser(AbstractUser):
    """
    Custom user model that extends the default Django user model.
    """
    face_id = models.CharField(max_length=100, blank=True, null=True)
    s3_image_key = models.CharField(max_length=255, blank=True, null=True)

class AppointmentSlot(models.Model):
    start_time = models.DateTimeField(unique=True)
    is_booked = models.BooleanField(default=False)

    def __str__(self):
        return self.start_time.strftime('%Y-%m-%d %H:%M')