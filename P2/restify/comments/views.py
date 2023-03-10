from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from P2.restify.accounts.models import RestifyUser

from P2.restify.comments.models import Comment
from P2.restify.properties.models import Property
from P2.restify.reservations.models import Reservation

class CreateComment(APIView):
    def post(self, request):
        if request.user.is_authenticated:
            data = request.data
            comment = Comment(
                message=data["message"],
                comment_type=data["comment_type"],
                sender_type=data["sender_type"],
                last_modified=data["last_modified"],
                feedback=data["feedback"]
            )
            comment.save()
            return Response({"message": "success", "data": {
                "id": comment.pk,
                "message": comment.message,
                "comment_type": comment.comment_type,
                "sender_type": comment.sender_type,
                "last_modified": comment.last_modified,
                "feedback": comment.feedback
            }}, status=status.HTTP_201_CREATED)
        else:
            return Response({"message": "error", "details": "User is not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def get_all_property_feedback_comments(request, id):
    if request.user.is_authenticated:
        try:
            property = Property.objects.get(id=id)
        except:
            return Response({"message": "error", "details": "Property not found"}, status=status.HTTP_404_NOT_FOUND)
        reservations = property.reservation_set.all()
        comments = []
        for reservation in reservations:
            feedback = reservation.feedback
            if feedback:
                feedback_comments = feedback.comment_set.all()
                earliest_comment = feedback_comments.filter(comment_type="property", sender_type="guest").order_by('last_modified').first()
                if earliest_comment:
                    comments.append(earliest_comment)
        return Response({"message": "success", "data": [{
            "id": comment.pk,
            "message": comment.message,
            "comment_type": comment.comment_type,
            "sender_type": comment.sender_type,
            "last_modified": comment.last_modified,
            "feedback": comment.feedback
        } for comment in comments]}, status=status.HTTP_200_OK)
    else:
        return Response({"message": "error", "details": "User is not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def get_all_guest_feedback_comments(request, id):
    if request.user.is_authenticated:
        try:
            guest = RestifyUser.objects.get(id=id)
        except:
            return Response({"message": "error", "details": "Property not found"}, status=status.HTTP_404_NOT_FOUND)
        if guest.account_type != "User":
            return Response({"message": "error", "details": "The requested user is not a guest"}, status=status.HTTP_404_NOT_FOUND)
        reservations = Reservation.objects.filter(user=guest)
        comments = []
        for reservation in reservations:
            feedback = reservation.feedback
            if feedback:
                feedback_comments = feedback.comment_set.all()
                earliest_comment = feedback_comments.filter(comment_type="guest", sender_type="host").order_by('last_modified').first()
                if earliest_comment:
                    comments.append(earliest_comment)
        return Response({"message": "success", "data": [{
            "id": comment.pk,
            "message": comment.message,
            "comment_type": comment.comment_type,
            "sender_type": comment.sender_type,
            "last_modified": comment.last_modified,
            "feedback": comment.feedback
        } for comment in comments]}, status=status.HTTP_200_OK)
    else:
        return Response({"message": "error", "details": "User is not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def get_property_conversation_comments(request, id):
    if request.user.is_authenticated:
        try:
            reservation = Reservation.objects.get(id=id)
        except:
            return Response({"message": "error", "details": "Reservation not found"}, status=status.HTTP_404_NOT_FOUND)
        comments = []
        feedback = reservation.feedback
        if feedback:
            comments = feedback.comment_set.filter(comment_type="property")
        return Response({"message": "success", "data": [{
            "id": comment.pk,
            "message": comment.message,
            "comment_type": comment.comment_type,
            "sender_type": comment.sender_type,
            "last_modified": comment.last_modified,
            "feedback": comment.feedback
        } for comment in comments]}, status=status.HTTP_200_OK)
    else:
        return Response({"message": "error", "details": "User is not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def get_guest_conversation_comments(request, id):
    if request.user.is_authenticated:
        try:
            reservation = Reservation.objects.get(id=id)
        except:
            return Response({"message": "error", "details": "Reservation not found"}, status=status.HTTP_404_NOT_FOUND)
        comments = []
        feedback = reservation.feedback
        if feedback:
            comments = feedback.comment_set.filter(comment_type="guest")
        return Response({"message": "success", "data": [{
            "id": comment.pk,
            "message": comment.message,
            "comment_type": comment.comment_type,
            "sender_type": comment.sender_type,
            "last_modified": comment.last_modified,
            "feedback": comment.feedback
        } for comment in comments]}, status=status.HTTP_200_OK)
    else:
        return Response({"message": "error", "details": "User is not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def get_ratings(request, id):
    if request.user.is_authenticated:
        try:
            reservation = Reservation.objects.get(id=id)
        except:
            return Response({"message": "error", "details": "Reservation not found"}, status=status.HTTP_404_NOT_FOUND)
        feedback = reservation.feedback
        if feedback:
            return Response({"message": "success", "data": {
                "property_rating": feedback.property_rating,
                "guest_rating": feedback.guest_rating
            }}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "error", "details": "Feedback not found"}, status=status.HTTP_404_NOT_FOUND)
    else:
        return Response({"message": "error", "details": "User is not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)
