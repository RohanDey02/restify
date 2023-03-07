from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework import serializers, status

class PropertySearchPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class HostPropertySearchPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

    def paginate_queryset(self, queryset, request, view=None):
        if request.user.is_authenticated:
            if request.user.account_type != "Host":
                raise serializers.ValidationError({"message": "error", "details": "User that is not a Host has no properties"})
            else:
                return super(self.__class__, self).paginate_queryset(queryset, request, view)
        else:
            raise serializers.ValidationError({"message": "error", "details": "Unauthorized access"})
