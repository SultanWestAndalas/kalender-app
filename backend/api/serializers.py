from rest_framework import serializers
from .models import Message, Event, Calendar

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'content']

class CalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calendar
        fields = ['id', 'name', 'owner', 'shared_with']

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'start_time', 'end_time', 'location', 'category', 'owner', 'calendar', 'created_at']
        read_only_fields = ['id', 'created_at', 'owner']