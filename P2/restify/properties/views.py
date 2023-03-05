from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from rest_framework.decorators import api_view
from rest_framework.generics import UpdateAPIView
from properties.models import Property, PropertyImages
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .serializers import CreatePropertySerializer, UpdatePropertySerializer

class CreateProperty(APIView):
    def post(self, request):
        if request.user.is_authenticated:
            if request.user.account_type != "Host":
                return Response({"message": "error", "details": "User that is not Host cannot create a property"}, status=status.HTTP_401_UNAUTHORIZED)
            else:
                serializer = CreatePropertySerializer(data=request.data)
                if serializer.is_valid():
                    prop = serializer.save(request.user)
                    return Response({"message": "success", "data": prop}, status=status.HTTP_201_CREATED)
                return Response({"message": "error", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "error", "details": "User is not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def all_host_properties(request):
    if request.user.is_authenticated:
        if request.user.account_type != "Host":
            return Response({"message": "error", "details": "User that is not a Host has no properties"}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            properties = request.user.property_set.all()
            return Response({
                "message": "success",
                "data": [{
                    'id': property.id,
                    'title': property.title,
                    'location': property.location,
                    'description': property.description,
                    'max_number_of_guests': property.max_number_of_guests,
                    'price': property.price,
                    'amenities': property.amenities
                } for property in properties]
            })
    else:
        return Response({"message": "error", "details": "Unauthorized access"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def all_properties(request):
    if request.user.is_authenticated:
        properties = Property.objects.all()
        return Response({
            "message": "success",
            "data": [{
                'id': property.id,
                'title': property.title,
                'location': property.location,
                'description': property.description,
                'max_number_of_guests': property.max_number_of_guests,
                'price': property.price,
                'amenities': property.amenities
            } for property in properties]
        })
    else:
        return Response({"message": "error", "details": "Unauthorized access"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def get_property(request, id):
    if request.user.is_authenticated:
        try:
            property = Property.objects.get(id=id)
        except:
            return Response({"message": "error", "details": "Property not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response({
            "message": "success",
            "data": {
                'id': property.id,
                'title': property.title,
                'location': property.location,
                'description': property.description,
                'max_number_of_guests': property.max_number_of_guests,
                'price': property.price,
                'amenities': property.amenities
            }
        })
    else:
        return Response({"message": "error", "details": "Unauthorized access"}, status=status.HTTP_401_UNAUTHORIZED)

class UpdateProperty(UpdateAPIView):
    queryset = Property.objects.all()
    serializer_class = UpdatePropertySerializer
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        if self.request.user.is_authenticated:
            property = Property.objects.get(id=kwargs['id'])
            if self.request.user != property.host:
                return Response({"message": "error", "details": "Cannot edit another host's property"}, status=status.HTTP_403_FORBIDDEN)

            for item in request.data.keys():
                if item not in ['title', 'location', 'description', 'max_number_of_guests', 'price', 'amenities', 'images']:
                    return Response({"message": "error", "details": "Invalid key in body"}, status=status.HTTP_400_BAD_REQUEST)

            if 'images' in request.data.keys() and request.data.getlist('images') == ['']:
                return Response({"message": "error", "details": "Image update requested, but no images specified"}, status=status.HTTP_400_BAD_REQUEST)

            serializer = self.get_serializer(self.get_object(), data=request.data, partial=True)
            if serializer.is_valid():
                try:
                    images = request.data.getlist('images')
                except:
                    images = None

                property = serializer.save(kwargs['id'], images)
                response = {}

                for item in serializer.data.keys():
                    match item:
                        case 'title':
                            response[item] = property.title
                        case 'location':
                            response[item] = property.location
                        case 'description':
                            response[item] = property.description
                        case 'max_number_of_guests':
                            response[item] = property.max_number_of_guests
                        case 'price':
                            response[item] = property.price
                        case 'amenities':
                            response[item] = property.amenities

                if images != None:
                    response['images'] = [property_image.image.url for property_image in property.propertyimages_set.all()]

                return Response({"message": "success", "data": response}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "error", "details": serializer.errors})
        else:
            return Response({"message": "error", "details": "Unauthorized access"}, status=status.HTTP_401_UNAUTHORIZED)

class DeleteProperty(APIView):
    def delete(self, request, id):
        if self.request.user.is_authenticated:
            if self.request.user.account_type != "Host":
                return Response({"message": "error", "details": "User that is not a Host has no properties"}, status=status.HTTP_401_UNAUTHORIZED)
            
            property = Property.objects.get(id=id)
            if self.request.user != property.host:
                return Response({"message": "error", "details": "Cannot delete another host's property"}, status=status.HTTP_403_FORBIDDEN)

            property.delete()
            return Response({"message": "success", "details": "Property successfully deleted"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "error", "details": "Unauthorized access"}, status=status.HTTP_401_UNAUTHORIZED)

# Create ✅
# Get all of a user's properties ✅
# Update ✅
# Search w/ pagination, sort-by and filter -> GET Request
# Deletion ✅
