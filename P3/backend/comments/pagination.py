from rest_framework.pagination import PageNumberPagination
from properties.models import Property

class CommentsPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        response = super().get_paginated_response(data)        
        response.data['data'] = response.data['results']
        del response.data['results']
        return response
