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
            if data.get('title') is None or data.get('description') is None or data.get('status') is None:
                return Response({'message': 'Missing fields'}, status=status.HTTP_400_BAD_REQUEST)
            notification = Notifications(
                title=data['title'],
                description=data['description'],
                url=data.get('url', None),
                status=data['status'],
                user_id=data.get('user_id', None),
                host_id=data.get('host_id', None)
            )
            notification.save()
            return Response({'message': 'Success', 'data': {
                'id': notification.id,
                'title': notification.title,
                'description': notification.description,
                'url': notification.url,
                'status': notification.status,
                'user_id': notification.user.id if notification.user else None,
                'host_id': notification.host.id if notification.host else None
            }}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

class GetNotifications(ListAPIView):
    def get(self, request):
        if request.user.is_authenticated:
            notifications = None
            if request.user.account_type == 'User':
                notifications = Notifications.objects.filter(user=request.user)
            elif request.user.account_type == 'Host':
                notifications = Notifications.objects.filter(host=request.user)
            return Response({'message': 'Success', 'data': [{
                'id': notification.id,
                'title': notification.title,
                'description': notification.description,
                'url': notification.url,
                'status': notification.status,
                'user_id': notification.user.id if notification.user else None,
                'host_id': notification.host.id if notification.host else None
            } for notification in notifications]}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

class UpdateNotification(UpdateAPIView):
    def update(self, request, *args, **kwargs):
        if self.request.user.is_authenticated:
            data = request.data
            if data.get('title') is None or data.get('description') is None or data.get('status') is None:
                return Response({'message': 'Missing fields'}, status=status.HTTP_400_BAD_REQUEST)
            user = None
            host = None
            if data.get('user_id', None) is not None:
                try:
                    user = RestifyUser.objects.get(id=data['user_id'])
                except:
                    return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            if data.get('host_id', None) is not None:
                try:
                    host = RestifyUser.objects.get(id=data['host_id'])
                except:
                    return Response({'message': 'Host not found'}, status=status.HTTP_404_NOT_FOUND)
            notification = None
            try:
                notification = Notifications.objects.get(id=kwargs['id'])
            except:
                return Response({'message': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)
            notification.title = data['title']
            notification.description = data['description']
            notification.url = data.get('url', None)
            notification.status = data['status']
            notification.user = user
            notification.host = host
            notification.save()
            return Response({'message': 'Success', 'data': {
                'id': notification.id,
                'title': notification.title,
                'description': notification.description,
                'url': notification.url,
                'status': notification.status,
                'user_id': user.id if user else None,
                'host_id': host.id if host else None
            }}, status=status.HTTP_200_OK)
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
        return Response({'message': 'Success', 'data': {
            'id': notification.id,
            'title': notification.title,
            'description': notification.description,
            'url': notification.url,
            'status': notification.status,
            'user_id': notification.user.id if notification.user else None,
            'host_id': notification.host.id if notification.host else None
        }}, status=status.HTTP_200_OK)
    else:
        return Response({'message': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
    
class DeleteNotification(APIView):
    def delete(self, request, id):
        if self.request.user.is_authenticated:
            notification = None
            try:
                notification = Notifications.objects.get(id=id)
            except:
                return Response({'message': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)
            notification.delete()
            return Response({'message': 'Notification successfully deleted'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)