from django.urls import path
from . import views
app_name="reservation"
urlpatterns = [
    path("mine?state=<str:state>/", views.get_user_reservations, name="my_reservations"),
    path("mine/", views.get_user_reservations, name="my_reservations"),
    path("all/", views.GetReservations.as_view(), name="reservations"),
    path("<int:id>/", views.get_reservation_by_id, name="get_reservation"),
    path("<int:property_id>/create/", views.CreateReservationView.as_view(), name="create"),
    path("<int:id>/update/", views.UpdateReservationView.as_view(), name="update"),
]