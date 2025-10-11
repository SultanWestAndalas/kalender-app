from django.contrib import admin
from .models import Message, Calendar, Event


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
	list_display = ('id', 'content')


@admin.register(Calendar)
class CalendarAdmin(admin.ModelAdmin):
	list_display = ('id', 'name', 'owner')
	filter_horizontal = ('shared_with',)


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
	list_display = ('id', 'title', 'start_time', 'end_time', 'owner', 'calendar')
	list_filter = ('category', 'start_time')
	search_fields = ('title', 'description', 'location')
