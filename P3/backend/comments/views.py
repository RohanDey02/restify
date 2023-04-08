from datetime import datetime
from rest_framework.generics import ListAPIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .serializers import CommentsSerializer
from .pagination import CommentsPagination
from accounts.models import RestifyUser

from comments.models import Comment, Feedback
from properties.models import Property
from reservations.models import Reservation

class CreateComment(APIView):
    def post(self, request):
        if request.user.is_authenticated:
            data = request.data
            if data.get('message') is None:
                return Response({'message': 'Missing message field'}, status=status.HTTP_400_BAD_REQUEST)
            if "property_id" in data:
                property = None
                try:
                    property = Property.objects.get(id=data["property_id"])
                except:
                    return Response({"message": "error", "details": "Property not found"}, status=status.HTTP_404_NOT_FOUND)
                if request.user.account_type == "User":
                    reservations = property.reservations.all()
                    if reservations.filter(user=request.user, status="Completed").count() == 0:
                        return Response({"message": "error", "details": "User has not completed a reservation at this property"}, status=status.HTTP_403_FORBIDDEN)
                    else:
                        feedback = None
                        if reservations.filter(user=request.user, feedback__isnull=False, status="Completed").count() == 0:
                            feedback = Feedback(
                                property_rating=data.get("property_rating", None),
                            )
                            feedback.save()
                            reservation = reservations.filter(user=request.user, feedback__isnull=True, status="Completed").order_by('start_date').last()
                            reservation.feedback = feedback
                            reservation.save()
                        elif "reservation_id" in data:
                            reservation = None
                            try:
                                reservation = Reservation.objects.get(id=data["reservation_id"])
                            except:
                                return Response({"message": "error", "details": "Reservation not found"}, status=status.HTTP_404_NOT_FOUND)
                            if reservation.feedback and reservation.feedback.comment_set.filter(comment_type="property").count != 0 and reservation.feedback.comment_set.filter(comment_type="property").order_by('last_modified').last().sender_type == "host":
                                feedback = reservation.feedback
                                if "property_rating" in data:
                                    feedback.property_rating = data.get("property_rating", None)
                                    feedback.save()
                            else:
                                return Response({"message": "error", "details": "Host hasn't responded yet"}, status=status.HTTP_400_BAD_REQUEST)
                        else:
                            return Response({"message": "error", "details": "Reservation ID is required"}, status=status.HTTP_400_BAD_REQUEST)
                        comment = Comment(
                            message=data["message"],
                            comment_type="property",
                            sender_type="guest",
                            last_modified=datetime.now(),
                            feedback=feedback
                        )
                        comment.save()
                        return Response({"message": "success", "data": {
                            "id": comment.pk,
                            "message": comment.message,
                            "comment_type": comment.comment_type,
                            "sender_type": comment.sender_type,
                            "last_modified": comment.last_modified,
                            "rating": data.get("property_rating", None)
                        }}, status=status.HTTP_201_CREATED)
                else:
                    if "reservation_id" in data:
                        reservation = None
                        try:
                            reservation = Reservation.objects.get(id=data["reservation_id"])
                        except:
                            return Response({"message": "error", "details": "Reservation not found"}, status=status.HTTP_404_NOT_FOUND)
                        if reservation.feedback and reservation.feedback.comment_set.filter(comment_type="property").count != 0 and reservation.feedback.comment_set.filter(comment_type="property").order_by('last_modified').last().sender_type == "guest" and reservation.property.host == request.user:
                            comment = Comment(
                                message=data["message"],
                                comment_type="property",
                                sender_type="host",
                                last_modified=datetime.now(),
                                feedback=reservation.feedback
                            )
                            comment.save()
                            return Response({"message": "success", "data": {
                                "id": comment.pk,
                                "message": comment.message,
                                "comment_type": comment.comment_type,
                                "sender_type": comment.sender_type,
                                "last_modified": comment.last_modified,
                            }}, status=status.HTTP_201_CREATED)
                        else:
                            return Response({"message": "error", "details": "Reservation has no feedback or user is not a host for the reservation"}, status=status.HTTP_403_FORBIDDEN)
                    else:
                        return Response({"message": "error", "details": "Reservation ID is required"}, status=status.HTTP_400_BAD_REQUEST)
            elif "guest_id" in data:
                guest = None
                try:
                    guest = RestifyUser.objects.get(id=data["guest_id"])
                except:
                    return Response({"message": "error", "details": "Guest not found"}, status=status.HTTP_404_NOT_FOUND)
                if request.user.account_type == "Host":
                    properties = request.user.property_set.all()
                    for property in properties:
                        if Reservation.objects.filter(user=guest, property=property, status="Completed").count() != 0:
                            feedback = None
                            if Reservation.objects.filter(user=guest, property=property, feedback__isnull=False, status="Completed").count() == 0:
                                feedback = Feedback(
                                    user_rating=data.get("user_rating", None)
                                )
                                feedback.save()
                                reservation = Reservation.objects.filter(user=guest, property=property, feedback__isnull=True, status="Completed").order_by('start_date').last()
                                reservation.feedback = feedback
                                reservation.save()
                            elif "reservation_id" in data:
                                reservation = None
                                try:
                                    reservation = Reservation.objects.get(id=data["reservation_id"])
                                except:
                                    return Response({"message": "error", "details": "Reservation not found"}, status=status.HTTP_404_NOT_FOUND)
                                if reservation.feedback and reservation.feedback.comment_set.filter(comment_type="guest").count() != 0 and reservation.feedback.comment_set.filter(comment_type="guest").order_by('last_modified').last().sender_type == "guest":
                                    feedback = reservation.feedback
                                    if "user_rating" in data:
                                        feedback.user_rating = data.get("user_rating", None)
                                        feedback.save()
                                else:
                                    return Response({"message": "error", "details": "Guest hasn't responded yet"}, status=status.HTTP_400_BAD_REQUEST)
                            else:
                                return Response({"message": "error", "details": "Reservation ID is required"}, status=status.HTTP_400_BAD_REQUEST)
                            comment = Comment(
                                message=data["message"],
                                comment_type="guest",
                                sender_type="host",
                                last_modified=datetime.now(),
                                feedback=feedback
                            )
                            comment.save()
                            return Response({"message": "success", "data": {
                                "id": comment.pk,
                                "message": comment.message,
                                "comment_type": comment.comment_type,
                                "sender_type": comment.sender_type,
                                "last_modified": comment.last_modified,
                                "rating": data.get("user_rating", None)
                            }}, status=status.HTTP_201_CREATED)
                    return Response({"message": "error", "details": "User did not host this guest"}, status=status.HTTP_403_FORBIDDEN)
                else:
                    if "reservation_id" in data:
                        reservation = None
                        try:
                            reservation = Reservation.objects.get(id=data["reservation_id"])
                        except:
                            return Response({"message": "error", "details": "Reservation not found"}, status=status.HTTP_404_NOT_FOUND)
                        if reservation.feedback and reservation.feedback.comment_set.filter(comment_type="guest").count != 0 and reservation.feedback.comment_set.filter(comment_type="guest").order_by('last_modified').last().sender_type == "host" and reservation.user == request.user:
                            comment = Comment(
                                message=data["message"],
                                comment_type="guest",
                                sender_type="guest",
                                last_modified=datetime.now(),
                                feedback=reservation.feedback
                            )
                            comment.save()
                            return Response({"message": "success", "data": {
                                "id": comment.pk,
                                "message": comment.message,
                                "comment_type": comment.comment_type,
                                "sender_type": comment.sender_type,
                                "last_modified": comment.last_modified,
                            }}, status=status.HTTP_201_CREATED)
                        else:
                            return Response({"message": "error", "details": "Reservation has no feedback or user is not a guest for the reservation"}, status=status.HTTP_403_FORBIDDEN)
                    else:
                        return Response({"message": "error", "details": "Reservation ID is required"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"message": "error", "details": "Property or guest not specified"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "error", "details": "User is not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

class GetAllPropertyFeedbackComments(ListAPIView):
    serializer_class = CommentsSerializer
    pagination_class = CommentsPagination

    def get_queryset(self):
        property = None
        try:
            property = Property.objects.get(id=self.kwargs["id"])
        except:
            return []

        reservations = property.reservations.all()
        comments = []
        guests = []
        for reservation in reservations:
            feedback = reservation.feedback
            if feedback:
                feedback_comments = feedback.comment_set.all()
                earliest_comment = feedback_comments.filter(comment_type="property", sender_type="guest").order_by('id').first()
                if earliest_comment:
                    comments.append(earliest_comment)
                    guests.append({
                        "username": reservation.user.username,
                        "avatar": reservation.user.avatar.url if reservation.user.avatar else None,
                        "first_name": reservation.user.first_name,
                        "last_name": reservation.user.last_name
                    })
        
        data_list = []
        for comment_num in range(0, len(comments)):
            data_list.append({
                "id": comments[comment_num].pk,
                "message": comments[comment_num].message,
                "comment_type": comments[comment_num].comment_type,
                "sender_type": comments[comment_num].sender_type,
                "last_modified": comments[comment_num].last_modified,
                "property_rating": comments[comment_num].feedback.property_rating,
                "guest_info": guests[comment_num]
            })

        return data_list

@api_view(['GET'])
def get_all_guest_feedback_comments(request, id):
    if request.user.is_authenticated:
        guest = None
        try:
            guest = RestifyUser.objects.get(id=id)
        except:
            return Response({"message": "error", "details": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        if guest.account_type != "User":
            return Response({"message": "error", "details": "The requested user is not a guest"}, status=status.HTTP_404_NOT_FOUND)
        reservations = Reservation.objects.filter(user=guest)
        is_users_guest = False
        for reservation in reservations:
            if reservation.property.host == request.user:
                is_users_guest = True
                break
        if not is_users_guest:
            return Response({"message": "error", "details": "User is not a guest of the requesting user"}, status=status.HTTP_403_FORBIDDEN)
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
            "user_rating": comment.feedback.user_rating,
        } for comment in comments]}, status=status.HTTP_200_OK)
    else:
        return Response({"message": "error", "details": "User is not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def get_comment(request, id):
    if request.user.is_authenticated:
        comment = None
        try:
            comment = Comment.objects.get(id=id)
        except:
            return Response({"message": "error", "details": "Comment not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"message": "success", "data": {
            "id": comment.pk,
            "message": comment.message,
            "comment_type": comment.comment_type,
            "sender_type": comment.sender_type,
            "last_modified": comment.last_modified,
        }}, status=status.HTTP_200_OK)
    else:
        return Response({"message": "error", "details": "User is not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def get_property_conversation_comments(request, id):
    if request.user.is_authenticated:
        reservation = None
        try:
            reservation = Reservation.objects.get(id=id)
        except:
            return Response({"message": "error", "details": "Reservation not found"}, status=status.HTTP_404_NOT_FOUND)
        if reservation.property.host == request.user or reservation.user == request.user:
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
            } for comment in comments]}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "error", "details": "User is not a host or guest for the reservation"}, status=status.HTTP_403_FORBIDDEN)
    else:
        return Response({"message": "error", "details": "User is not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def get_guest_conversation_comments(request, id):
    if request.user.is_authenticated:
        reservation = None
        try:
            reservation = Reservation.objects.get(id=id)
        except:
            return Response({"message": "error", "details": "Reservation not found"}, status=status.HTTP_404_NOT_FOUND)
        if reservation.property.host == request.user or reservation.user == request.user:
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
            } for comment in comments]}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "error", "details": "User is not a host or guest for the reservation"}, status=status.HTTP_403_FORBIDDEN)
    else:
        return Response({"message": "error", "details": "User is not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def get_ratings(request, id):
    if request.user.is_authenticated:
        reservation = None
        try:
            reservation = Reservation.objects.get(id=id)
        except:
            return Response({"message": "error", "details": "Reservation not found"}, status=status.HTTP_404_NOT_FOUND)
        feedback = reservation.feedback
        if feedback:
            return Response({"message": "success", "data": {
                "property_rating": feedback.property_rating,
                "user_rating": feedback.user_rating,
            }}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "error", "details": "Feedback not found"}, status=status.HTTP_404_NOT_FOUND)
    else:
        return Response({"message": "error", "details": "User is not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def get_associated_reservation(request, id):
    if request.user.is_authenticated:
        comment = None
        try:
            comment = Comment.objects.get(id=id)
        except:
            return Response({"message": "error", "details": "Reservation not found"}, status=status.HTTP_404_NOT_FOUND)

        feedback = comment.feedback
        if feedback:
            return Response({"message": "success", "data": {
                "reservation_id": feedback.reservation.id
            }}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "error", "details": "Feedback not found"}, status=status.HTTP_404_NOT_FOUND)
    else:
        return Response({"message": "error", "details": "User is not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def get_all_conversation_comments(request, id):
    if request.user.is_authenticated:
        reservation = None
        try:
            reservation = Reservation.objects.get(id=id)
        except:
            return Response({"message": "error", "details": "Reservation not found"}, status=status.HTTP_404_NOT_FOUND)
        comments = []
        feedback = reservation.feedback
        if feedback:
            comments = feedback.comment_set.all().order_by('last_modified')
        return Response({"message": "success", "data": [{
            "id": comment.pk,
            "message": comment.message,
            "comment_type": comment.comment_type,
            "sender_type": comment.sender_type,
            "last_modified": comment.last_modified,
        } for comment in comments]}, status=status.HTTP_200_OK)
    else:
        return Response({"message": "error", "details": "User is not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)
