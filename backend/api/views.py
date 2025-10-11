from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, permissions
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.parsers import JSONParser
from .models import Message, Event
from .serializers import MessageSerializer, EventSerializer

class MessageList(APIView):
    def get(self, request):
        messages = Message.objects.all()
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

class EventList(generics.ListCreateAPIView):
    queryset = Event.objects.all().order_by('-start_time')
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # owner set dari user yang sedang login; jika anonim, owner harus di-set oleh client atau ditolak
        if self.request.user and self.request.user.is_authenticated:
            serializer.save(owner=self.request.user)
        else:
            serializer.save()  # development convenience; ganti dengan error di production

class EventDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class RegisterView(APIView):
    parser_classes = [JSONParser]
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password:
            return Response({'detail': 'username and password required'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(username=username).exists():
            return Response({'detail': 'user exists'}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create_user(username=username, password=password)
        return Response({'id': user.id, 'username': user.username}, status=status.HTTP_201_CREATED)
