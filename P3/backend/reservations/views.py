from django.shortcuts import render
from rest_framework.decorators import api_view
from .models import Reservation, Property
from django.http import HttpRequest
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, UpdateAPIView
from .serializers import CreateReservationSerializer, SearchReservationSerializer, UpdateReservationSerializer
from .pagination import ReservationSearchPagination

# Create your views here.

# example URL
# reservations/all?user=host&state=approved
class GetReservations(ListAPIView):
    serializer_class = SearchReservationSerializer
    pagination_class = ReservationSearchPagination

    def get_queryset(self):
        # Get query params and validate
        user_type = self.request.query_params.get("user")
        if user_type:
            user_type = user_type.strip().lower()
        state = self.request.query_params.get("state")
        if state:
            state = state.strip().lower()
        if user_type not in ["Host", "User"]:
            user_type = None
        # find correct list of states allowed
        if state not in ["pending", "denied", "approved", "cancelled", "completed", "terminated"]:
            state = None
        reservations = None
        if user_type and state:
            reservations = Reservation.objects.filter(user__account_type=user_type, status=state.capitalize())
        elif state:
            reservations = Reservation.objects.filter(status=state.capitalize())
        elif user_type:
            # fix this so that we filter by account_type
            reservations = Reservation.objects.filter(user__account_type=user_type)
        else:
            reservations = Reservation.objects.all()

        return reservations

@api_view(['GET'])
def get_reservation_by_id(request, id):
    if request.user.is_authenticated:
        try:
            reservation = Reservation.objects.get(id=id)
        except:
            return Response({"message": "error", "details": "Reservation not found"}, status=status.HTTP_404_NOT_FOUND)

        if request.user != reservation.property.host and request.user != reservation.user:
            return Response({"message": "error", "details": "Cannot access other user's reservations"}, status=status.HTTP_401_UNAUTHORIZED)

        return Response({
            "message": "success",
            "data": {
                'id': reservation.id,
                'start_date': reservation.start_date,
                'end_date': reservation.end_date,
                'status': reservation.status,
                'feedback': reservation.feedback,
                'user': reservation.user.id,
                'property': reservation.property.id,
                "host": reservation.property.host.id,
            }
        }, status=status.HTTP_200_OK)
    else:
        return Response({"message": "error", "details": "Unauthorized access"}, status=status.HTTP_401_UNAUTHORIZED)

class GetUserReservations(ListAPIView):
    serializer_class = SearchReservationSerializer
    pagination_class = ReservationSearchPagination

    def get_queryset(self):
        reservations = None
        state = self.request.query_params.get("state")
        user_type = self.request.query_params.get("userType")
        if state:
            state = state.strip().lower()
        if state not in ["pending", "denied", "approved", "cancelled", "completed", "terminated"]:
            state = None
        if user_type:
            user_type = user_type.strip().lower()
        if user_type not in ["host", "user"]:
            user_type = None
        if self.request.user.account_type == "Host":
            if state and user_type and user_type == "user":
                reservations = Reservation.objects.filter(user=self.request.user, status=state.capitalize())
            elif user_type and user_type == "user":
                reservations = Reservation.objects.filter(user=self.request.user)
            elif state:
                reservations = Reservation.objects.filter(property__host=self.request.user, status=state.capitalize())
            else:
                reservations = Reservation.objects.filter(property__host=self.request.user)

        else:
            if state:
                reservations = Reservation.objects.filter(user=self.request.user, status=state.capitalize())
            else:
                reservations = Reservation.objects.filter(user=self.request.user)

        return reservations

# Creating a reservation
# example URL
# reservations/{property_id}/create
class CreateReservationView(APIView):
    def post(self, request: HttpRequest, property_id):
        if not request.user.is_authenticated:
            return Response({"message": "error", "details": "Please login to book a reservation!"}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            property = Property.objects.get(id=property_id)
        except Property.DoesNotExist:
            return Response({"message": "error", "details": "Property does not exist!"}, status=status.HTTP_404_NOT_FOUND)
        if request.user == property.host:
            return Response({"message": "error", "details": "You cannot book your own property!"}, status=status.HTTP_400_BAD_REQUEST)
        serializer = CreateReservationSerializer(data=request.data)
        if serializer.is_valid():
            res = serializer.save(request.user, property)
            return Response({"message": "success", "data": res}, status=status.HTTP_201_CREATED)
        return Response({"message": "error", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

# Updating a reservation
# example URL
# reservations/{reservation_id}/update
class UpdateReservationView(UpdateAPIView):
    queryset = Reservation.objects.all()
    serializer_class = UpdateReservationSerializer
    lookup_field = "id"
    def update(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response({"message": "error", "details": "Please login to update a reservation!"}, status=status.HTTP_401_UNAUTHORIZED)
        for item in request.data.keys():
                if item not in ['start_date', 'end_date', 'status']:
                    return Response({"message": "error", "details": "Invalid key in body"}, status=status.HTTP_400_BAD_REQUEST)
        res_id = self.kwargs.get("id")
        try:
            res = Reservation.objects.get(id=res_id)
        except Reservation.DoesNotExist:
            return Response({"message": "error", "details": "Reservation does not exist!"}, status=status.HTTP_404_NOT_FOUND)
        if res.user.id != request.user.id and res.property.host.id != request.user.id:
            return Response({"message": "error", "details": "User is not authorized to update this reservation!"}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = self.get_serializer(self.get_object(), data=request.data, partial=True)
        if serializer.is_valid():
            updated_res: Reservation = serializer.save(res)
            response = {
                "id": updated_res.pk,
                "status": updated_res.status,
                "start_date": updated_res.start_date,
                "end_date": updated_res.end_date,
            }
            return Response({"message": "success", "data": response}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "error", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

# New
@api_view(['GET'])
def get_reservation_by_property_id(request, property_id):
    if request.user.is_authenticated:
        try:
            all_reservations = Property.objects.get(id=property_id).reservations.all()
        except:
            return Response({"message": "error", "details": "Reservation not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response({
            "message": "success",
            "data": [{
                'id': reservation.id,
                'start_date': reservation.start_date,
                'end_date': reservation.end_date,
                'status': reservation.status
            } for reservation in all_reservations]}, status=status.HTTP_200_OK)
    else:
        return Response({"message": "error", "details": "Unauthorized access"}, status=status.HTTP_401_UNAUTHORIZED)
