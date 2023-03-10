from django.urls import path
from . import views

app_name="comments"
urlpatterns = [
    path('create/', views.CreateComment.as_view(), name="create"),
    path('<int:id>/allPropertyFeedbackComments/', views.get_all_property_feedback_comments, name="get_all_property_feedback_comments"),
    path('<int:id>/allGuestFeedbackComments/', views.get_all_guest_feedback_comments, name="get_all_guest_feedback_comments"),
    path('<int:id>/propertyConversationComments/', views.get_property_conversation_comments, name="get_property_conversation_comments"),
    path('<int:id>/guestConversationComments/', views.get_guest_conversation_comments, name="get_guest_conversation_comments"),
    path('<int:id>/ratings/', views.get_ratings, name="get_ratings"),
]