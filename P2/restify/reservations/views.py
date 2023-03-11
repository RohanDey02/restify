from django.shortcuts import render
from rest_framework.decorators import api_view
from reservations.models import Reservation, Property
from django.http import HttpRequest
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, UpdateAPIView
from .serializers import CreateReservationSerializer, UpdateReservationSerializer
# Create your views here.

# example URL
# reservations/all?user=host&state=approved
@api_view(['GET'])
def get_reservations(request: HttpRequest):
    if not request.user.is_authenticated:
        return Response({"message": "error", "details": "User that is not Host cannot create a property"}, status=status.HTTP_401_UNAUTHORIZED)

    # get query params and validate
    user_type = request.query_params.get("user").strip().lower()
    state = request.query_params.get("state").strip().lower()
    if user_type not in ["host", "guest"]:
        user_type = None
    # find correct list of states allowed
    if state not in ["pending", "denied", "approved", "cancelled", "completed", "terminated"]:
        state = None
    reservations = None
    if user_type and state:
        reservations = Reservation.objects.filter(user__account_type=user_type, status=state)
    elif state:
        reservations = Reservation.objects.filter(status=state)
    elif user_type:
        # fix this so that we filter by account_type
        reservations = Reservation.objects.filter(user__account_type=user_type)
    else:
        reservations = Reservation.objects.all()

    return Response({"message": "success",
                        "data": [{
                        "id": res.id,
                        "start_date": res.start_date,
                        "end_date": res.end_date,
                        "status": res.status,
                        } for res in reservations]})

@api_view(["GET"])
def get_user_reservations(request: HttpRequest):
    if not request.user.is_authenticated:
        return Response({"message": "error", "details": "User that is not Host cannot create a property"}, status=status.HTTP_401_UNAUTHORIZED)
    reservations = None
    state = request.query_params.get("state").strip().lower()
    if state not in ["pending", "denied", "approved", "cancelled", "completed", "terminated"]:
        state = None
    if request.user.account_type == "Host":
        if state:
            reservations = Reservation.objects.filter(property__host=request.user, status=state)
        else:
            reservations = Reservation.objects.filter(property__host=request.user)
    else:
        if state:
            reservations = Reservation.objects.filter(user=request.user, status=state)
        else:
            reservations = Reservation.objects.filter(user=request.user)
    return Response({"message": "success",
                        "data": [{
                        "id": res.id,
                        "start_date": res.start_date,
                        "end_date": res.end_date,
                        "status": res.status,
                        } for res in reservations]})

# Creating a reservation
# example URL
# reservations/{property_id}/create
class CreateReservationView(APIView):
    def post(self, request: HttpRequest, property_id):
        if not request.user.is_authenticated:
            return Response({"message": "error", "details": "Please login to book a reservation!"}, status=status.HTTP_401_UNAUTHORIZED)
        if request.user.account_type == "Host":
            return Response({"message": "error", "details": "Hosts cannot book a reservation!"}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            property = Property.objects.get(id=property_id)
        except Property.DoesNotExist:
            return Response({"message": "error", "details": "Property does not exist!"}, status=status.HTTP_404_NOT_FOUND)
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
        res_id = self.kwargs.get("reservation_id")
        try:
            res = Reservation.objects.get(id=res_id)
        except Reservation.DoesNotExist:
            return Response({"message": "error", "details": "Reservation does not exist!"}, status=status.HTTP_404_NOT_FOUND)
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

