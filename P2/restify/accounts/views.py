from django.http.response import HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView
from rest_framework import status
from .models import RestifyUser
from .serializers import CreateUserSerializer, UpdateUserSerializer

class CreateAccount(APIView):
    def post(self, request):
        serializer = CreateUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "success", "data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response({"message": "error", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def all_users(request, acc_type):
    if request.user.is_authenticated:
        users = RestifyUser.objects.filter(account_type=acc_type.capitalize())
        return Response({
            "message": "success",
            "data": [{
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'phone_number': user.phone_number,
                'account_type': user.account_type,
                'avatar': user.avatar.url if user.avatar else None
            } for user in users]
        })
    else:
        return Response({"message": "error", "details": "Unauthorized access"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET', 'DELETE'])
def user(request, username):
    if request.method == "GET":
        if request.user.is_authenticated:
            try:
                user = RestifyUser.objects.get(username=username)
                if request.user.username != user.username:
                    return Response({"message": "error", "details": "Cannot access another user"}, status=status.HTTP_403_FORBIDDEN)

                return Response({
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'email': user.email,
                    'phone_number': user.phone_number,
                    'account_type': user.account_type,
                    'avatar': user.avatar.url if user.avatar else None
                })
            except:
                return Response({"message": "error", "details": "Invalid user or user not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"message": "error", "details": "Unauthorized access"}, status=status.HTTP_401_UNAUTHORIZED)
    elif request.method == "DELETE":
        if request.user.is_authenticated:
            user = RestifyUser.objects.get(username=username)
            if request.user.username != user.username:
                return Response({"message": "error", "details": "Cannot delete another user"}, status=status.HTTP_403_FORBIDDEN)
            else:
                user.delete()
                return Response({"message": "success", "details": "User has been successfully deleted"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "error", "details": "Unauthorized access"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def user_avatar(request, username):
    user = RestifyUser.objects.get(username=username)
    return HttpResponse(user.avatar, content_type="image/png")

class UpdateAvatar(UpdateAPIView):
    queryset = RestifyUser.objects.all()
    serializer_class = UpdateUserSerializer
    lookup_field = 'username'

    def update(self, request, *args, **kwargs):
        if self.request.user.is_authenticated:
            if self.request.user.username != kwargs['username']:
                return Response({"message": "error", "details": "Cannot edit another user's profile"}, status=status.HTTP_403_FORBIDDEN)

            for item in request.data.keys():
                if item not in ['email', 'phone_number', 'account_type', 'avatar', 'password', 'password2']:
                    return Response({"message": "error", "details": "Invalid key in body"}, status=status.HTTP_400_BAD_REQUEST)

            serializer = self.get_serializer(self.get_object(), data=request.data, partial=True)
            if serializer.is_valid():
                user = serializer.save(kwargs['username'])
                response = {}

                for item in serializer.data.keys():
                    match item:
                        case 'email':
                            response[item] = user.email
                        case 'phone_number':
                            response[item] = user.phone_number
                        case 'account_type':
                            response[item] = user.account_type
                        case 'avatar':
                            response[item] = user.avatar.url

                return Response({"message": "success", "data": response}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "error", "details": serializer.errors})
        else:
            return Response({"message": "error", "details": "Unauthorized access"}, status=status.HTTP_401_UNAUTHORIZED)


# Login -> Return user with token

# Logout -> Remove token?

# Refresh user token (get refresh token and refresh for specific user)
