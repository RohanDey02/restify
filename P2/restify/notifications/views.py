from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, UpdateAPIView
from rest_framework.views import APIView
from rest_framework import status
from accounts.models import RestifyUser

from notifications.models import Notifications

class CreateNotification(APIView):
    def post(self, request):
        if request.user.is_authenticated:
            data = request.data
            user = None
            host = None
            try:
                user = RestifyUser.objects.get(id=data['user'])
            except:
                return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            try:
                host = RestifyUser.objects.get(id=data['host'])
            except:
                return Response({'message': 'Host not found'}, status=status.HTTP_404_NOT_FOUND)
            notification = Notifications(
                title=data['title'],
                description=data['description'],
                url=data['url'],
                status=data['status'],
                user=user,
                host=host
            )
            notification.save()
            return Response({'message': 'Success', 'notification': notification}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

class GetNotifications(ListAPIView):
    def get(self, request):
        if request.user.is_authenticated:
            notifications = Notifications.objects.filter(user=request.user)
            return Response({'message': 'Success', 'notifications': notifications}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

class UpdateNotification(UpdateAPIView):
    def update(self, request, *args, **kwargs):
        if self.request.user.is_authenticated:
            data = request.data
            user = None
            host = None
            try:
                user = RestifyUser.objects.get(id=data['user'])
            except:
                return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            try:
                host = RestifyUser.objects.get(id=data['host'])
            except:
                return Response({'message': 'Host not found'}, status=status.HTTP_404_NOT_FOUND)
            notification = None
            try:
                notification = Notifications.objects.get(id=kwargs['id'])
            except:
                return Response({'message': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)
            notification.title = data['title']
            notification.description = data['description']
            notification.url = data['url']
            notification.status = data['status']
            notification.user = user
            notification.host = host
            notification.save()
            return Response({'message': 'Success', 'notification': notification}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def get_notification(request, id):
    if request.user.is_authenticated:
        notification = None
        try:
            notification = Notifications.objects.get(id=id)
        except:
            return Response({'message': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'message': 'Success', 'notification': notification}, status=status.HTTP_200_OK)
    else:
        return Response({'message': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)