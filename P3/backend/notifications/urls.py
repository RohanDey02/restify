from django.urls import path
from . import views

app_name="notifications"
urlpatterns = [
    path('create/', views.CreateNotification.as_view(), name="create"),
    path('all/', views.GetNotifications.as_view(), name="all"),
    path('<int:id>/', views.get_notification, name="get_notification"),
    path('<int:id>/update/', views.UpdateNotification.as_view(), name="update"),
    path('<int:id>/delete/', views.DeleteNotification.as_view(), name="delete"),
]