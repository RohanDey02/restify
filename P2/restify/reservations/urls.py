from django.urls import path
from . import views
app_name="reservation"
urlpatterns = [
    path("mine?state=<str:state>/", views.get_user_reservations, name="my_reservations"),
    path("mine/", views.get_user_reservations, name="my_reservations"),
    path("all/", views.get_reservations, name="reservations"),
    path("all?state=<str:state>&user=<str:user>/", views.get_reservations, name="reservations"),
    path("<int:property_id>/create/", views.CreateReservationView.as_view(), name="create"),
    path("<int:id>/update/", views.UpdateReservationView.as_view(), name="update"),
]