from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from .models import Comment

class CommentsSerializer(ModelSerializer):
    property_rating = serializers.FloatField()
    guest_info = serializers.DictField()

    class Meta:
        model = Comment
        fields = ('id', 'message', 'comment_type', 'sender_type', 'last_modified', 'property_rating', 'guest_info')
