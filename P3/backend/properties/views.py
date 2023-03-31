from rest_framework.decorators import api_view
from rest_framework.generics import ListAPIView, UpdateAPIView
from .models import Property, PropertyImages
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .serializers import CreatePropertySerializer, SearchPropertySerializer, UpdatePropertySerializer
from .pagination import HostPropertySearchPagination, PropertySearchPagination
import re
from datetime import datetime
import pandas as pd

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

class AllHostProperties(ListAPIView):
    serializer_class = SearchPropertySerializer
    pagination_class = HostPropertySearchPagination

    def get_queryset(self):
        return self.request.user.property_set.all()

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
                'amenities': property.amenities,
                'images': [property_image.image.url for property_image in property.propertyimages_set.all()],
                'owner': property.host.username
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
            if self.request.user.account_type != "Host":
                return Response({"message": "error", "details": "User that is not a Host has no properties"}, status=status.HTTP_401_UNAUTHORIZED)

            try:
                property = Property.objects.get(id=kwargs['id'])
            except:
                return Response({"message": "error", "details": f"Property with id: {kwargs['id']} does not exist"}, status=status.HTTP_404_NOT_FOUND)

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
                return Response({"message": "error", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "error", "details": "Unauthorized access"}, status=status.HTTP_401_UNAUTHORIZED)

class DeleteProperty(APIView):
    def delete(self, request, id):
        if self.request.user.is_authenticated:
            if self.request.user.account_type != "Host":
                return Response({"message": "error", "details": "User that is not a Host has no properties"}, status=status.HTTP_401_UNAUTHORIZED)

            try:
                property = Property.objects.get(id=id)
            except:
                return Response({"message": "error", "details": f"Property with id: {id} does not exist"}, status=status.HTTP_404_NOT_FOUND)

            if self.request.user != property.host:
                return Response({"message": "error", "details": "Cannot delete another host's property"}, status=status.HTTP_403_FORBIDDEN)

            # Delete all property image files
            property_images = property.propertyimages_set.all()
            for image in property_images:
                property_image_obj = PropertyImages.objects.get(id=image.id)
                property_image_obj.image.delete(save=True)
                property_image_obj.delete()

            property.delete()
            return Response({"message": "success", "details": "Property successfully deleted"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "error", "details": "Unauthorized access"}, status=status.HTTP_401_UNAUTHORIZED)

class PropertySearch(ListAPIView):
    serializer_class = SearchPropertySerializer
    pagination_class = PropertySearchPagination

    def get_queryset(self):
        property_objs = Property.objects.all()

        # possible_filter_fields = ['amenities', 'location', 'max_number_of_guests', 'max_price', 'min_price', 'title', 'start_availability', 'end_availability']
        possible_order_by_fields = ['asc', 'desc']
        possible_sort_fields = ['id', 'title', 'location', 'max_number_of_guests', 'price']

        # Filtering
        amenities, location, max_number_of_guests, max_price, min_price, title = None, None, None, None, None, None
        if self.request.GET.get("amenities", None) != None:
            amenities = self.request.GET["amenities"]
            comma_seperated_pattern = re.compile(r"^[a-zA-Z0-9]{1,64}(?:,[a-zA-Z0-9]{1,64})*$")

            if comma_seperated_pattern.match(amenities) is not None:
                amenities_query_list = amenities.split(",")
                property_list = []

                for elem in property_objs:
                    amenities_list = elem.amenities.split(",")
                    if all(item in amenities_list for item in amenities_query_list):
                        property_list.append(elem.id)

                property_objs = property_objs.filter(id__in=property_list)

        if self.request.GET.get("location", None) != None:
            location = self.request.GET["location"]
            property_objs = property_objs.filter(location__contains=location)

        if self.request.GET.get("max_number_of_guests", None) != None:
            max_number_of_guests = self.request.GET["max_number_of_guests"]
            property_objs = property_objs.filter(max_number_of_guests__gte=max_number_of_guests)

        if self.request.GET.get("max_price", None) != None:
            max_price = self.request.GET["max_price"]
            property_objs = property_objs.filter(price__lte=max_price)

        if self.request.GET.get("min_price", None) != None:
            min_price = self.request.GET["min_price"]
            property_objs = property_objs.filter(price__gte=min_price)

        if self.request.GET.get("title", None) != None:
            title = self.request.GET["title"]
            property_objs = property_objs.filter(title__contains=title)
        
        if self.request.GET.get("start_availability", None) != None and self.request.GET.get("end_availability", None) != None:
            try:
                start_availability = datetime.strptime(self.request.GET["start_availability"], "%Y-%m-%d").date()
                end_availability = datetime.strptime(self.request.GET["end_availability"], "%Y-%m-%d").date()

                # If in the past or if end date is before start date
                if start_availability < datetime.now().date() or end_availability <= start_availability:
                    raise ValueError()

                # Generate all dates between start and end
                date_range_query = list(map(lambda dt: dt.date(), pd.date_range(start=start_availability,end=end_availability).to_pydatetime().tolist()))

                # Get properties that are available within these dates
                properties_to_be_dropped = []

                for elem in property_objs:
                    all_reservations = elem.reservations.all()
                    for reservation in all_reservations:
                        date_range = list(map(lambda dt: dt.date(), pd.date_range(start=reservation.start_date,end=reservation.end_date).to_pydatetime().tolist()))
                        if not set(date_range_query).isdisjoint(date_range):
                            properties_to_be_dropped.append(elem.id)
                            break

                property_objs = property_objs.exclude(id__in=properties_to_be_dropped)
            except:
                pass

        order_by_option = self.request.GET.get("order_by", None)
        sort_option = self.request.GET.get("sort", None)

        if order_by_option != None and order_by_option not in possible_order_by_fields:
            order_by_option = None

        if sort_option != None and sort_option in possible_sort_fields:
            sort_by_str = sort_option if order_by_option is None or order_by_option == 'asc' else f"-{sort_option}"
            property_objs = property_objs.order_by(sort_by_str)

        return property_objs
