from django.urls import path
from .views import MessageList, EventList, EventDetail, RegisterView, UserProfileView

urlpatterns = [
    path('messages/', MessageList.as_view(), name='message-list'),
    path('events/', EventList.as_view(), name='event-list'),
    path('events/<int:pk>/', EventDetail.as_view(), name='event-detail'),
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
]
