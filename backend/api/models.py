from django.db import models
from django.conf import settings

class Message(models.Model):
    content = models.CharField(max_length=200)

    def __str__(self):
        return self.content

class Calendar(models.Model):
    name = models.CharField(max_length=100)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='calendars')
    shared_with = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='shared_calendars', blank=True)

    def __str__(self):
        return self.name

class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    location = models.CharField(max_length=200, blank=True)
    category = models.CharField(max_length=50, blank=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='events')
    calendar = models.ForeignKey(Calendar, null=True, blank=True, on_delete=models.SET_NULL, related_name='events')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title