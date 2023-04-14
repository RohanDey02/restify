from django.contrib.auth import authenticate, logout as logout_user
from django.http.response import HttpResponse
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import RestifyUser
from .serializers import CreateUserSerializer, UpdateUserSerializer

class CreateAccount(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CreateUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(request.data.get('password2', None))
            return Response({"message": "success", "data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response({"message": "error", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def all_users(request, acc_type):
    if request.user.is_authenticated:
        users = RestifyUser.objects.filter(account_type=acc_type.capitalize())
        if len(users) == 0:
            return Response({"message": "error", "details": "No users found"}, status=status.HTTP_404_NOT_FOUND)

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
                return Response({"message": "success", "data": {
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'email': user.email,
                    'phone_number': user.phone_number,
                    'account_type': user.account_type,
                    'avatar': user.avatar.url if user.avatar else None
                }}, status=status.HTTP_200_OK)
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
def user_by_id(request, id):
    if request.method == "GET":
        if request.user.is_authenticated:
            try:
                user = RestifyUser.objects.get(id=id)
                return Response({"message": "success", "data": {
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'email': user.email,
                    'phone_number': user.phone_number,
                    'account_type': user.account_type,
                    'avatar': user.avatar.url if user.avatar else None
                }}, status=status.HTTP_200_OK)
            except:
                return Response({"message": "error", "details": "Invalid user or user not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"message": "error", "details": "Unauthorized access"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def user_avatar(request, username):
    if request.user.is_authenticated:
        try:
            user = RestifyUser.objects.get(username=username)
            if user.avatar != None:
                return HttpResponse(user.avatar, content_type="image/png")
            else:
                return Response({"message": "error", "details": "No avatar associated with user"}, status=status.HTTP_404_NOT_FOUND)
        except:
            return Response({"message": "error", "details": "Invalid user or user not found"}, status=status.HTTP_404_NOT_FOUND)
    else:
        return Response({"message": "error", "details": "Unauthorized access"}, status=status.HTTP_401_UNAUTHORIZED)

class UpdateUser(UpdateAPIView):
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

            if "avatar" in request.data.keys() and len(request.data.getlist("avatar")) != 1:
                return Response({"message": "error", "details": "Avatar should not have multiple files"}, status=status.HTTP_400_BAD_REQUEST)

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

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    if request.method == "POST":
        try:
            user = authenticate(username=request.data['username'], password=request.data['password'])
            if user == None:
                return Response({"message": "error", "details": "Invalid username and password combination"}, status=status.HTTP_400_BAD_REQUEST)

            access_token = AccessToken.for_user(user)
            refresh_token = RefreshToken.for_user(user)
            return Response({"message": "success", "data": {
                'id': user.id,
                'username': user.username,
                'password': request.data['password'],
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'phone_number': user.phone_number,
                'account_type': user.account_type,
                'avatar': user.avatar.url if user.avatar else None
            }, "tokens": {
                "access": str(access_token),
                "refresh": str(refresh_token)
            }}, status=status.HTTP_200_OK)
        except KeyError:
            return Response({"message": "error", "details": "Invalid username and password combination"}, status=status.HTTP_400_BAD_REQUEST)

# This gets rid of Refresh Token. Access Token will expire eventually.
@permission_classes([IsAuthenticated])
class LogoutUser(APIView):
    def post(self, request):
        if request.user.is_authenticated:
            try:
                logout_user(request)
                refresh_token = request.data["refresh_token"]
                token = RefreshToken(refresh_token)
                token.blacklist()

                return Response({"message": "success", "details": "User logged out successfully"}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"message": "error", "details": "User is already logged out"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "error", "details": "Unauthorized access"}, status=status.HTTP_401_UNAUTHORIZED)
