from django.urls import path
from . import views

app_name="comments"
urlpatterns = [
    path('create/', views.CreateComment.as_view(), name="create"),
    path('<int:id>/', views.get_comment, name="get_comment"),
    path('<int:id>/allPropertyFeedbackComments/', views.GetAllPropertyFeedbackComments.as_view(), name="get_all_property_feedback_comments"),
    path('<int:id>/allConversationComments/', views.get_all_conversation_comments, name="get_all_conversation_comments"),
    path('<int:id>/allGuestFeedbackComments/', views.get_all_guest_feedback_comments, name="get_all_guest_feedback_comments"),
    path('<int:id>/propertyConversationComments/', views.get_property_conversation_comments, name="get_property_conversation_comments"),
    path('<int:id>/guestConversationComments/', views.get_guest_conversation_comments, name="get_guest_conversation_comments"),
    path('<int:id>/ratings/', views.get_ratings, name="get_ratings"),
    path('<int:id>/reservation/', views.get_associated_reservation, name="get_reservation"),
]
