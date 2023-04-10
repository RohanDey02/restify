from django.core.files.uploadedfile import InMemoryUploadedFile
from rest_framework.exceptions import ValidationError
from rest_framework.serializers import ModelSerializer
from .models import Property, PropertyImages
import re

class CreatePropertySerializer(ModelSerializer):
    class Meta:
        model = Property
        fields = ['title', 'location', 'description', 'max_number_of_guests', 'price', 'amenities']

    def save(self, user):
        comma_seperated_pattern = re.compile(r"^[a-zA-Z0-9]{1,64}(?:,[a-zA-Z0-9]{1,64})*$")
        amenities = self.validated_data['amenities']

        if comma_seperated_pattern.match(amenities) == None:
            raise ValidationError({"amenities": "Amenities is not formatted as a comma-seperated list"})
        else:
            amenities_list = amenities.split(",")
            amenities_list.sort()
            amenities = ",".join(amenities_list)

        property = Property(
            title=self.validated_data['title'],
            location=self.validated_data['location'],
            description=self.validated_data['description'],
            max_number_of_guests=self.validated_data['max_number_of_guests'],
            price=round(self.validated_data['price'], 2),
            amenities=amenities,
            host=user
        )

        property.save()
        return {
                'id': property.pk,
                'title': property.title,
                'location': property.location,
                'description': property.description,
                'max_number_of_guests': property.max_number_of_guests,
                'price': property.price,
                'amenities': property.amenities
               }

class UpdatePropertySerializer(ModelSerializer):   
    class Meta:
        model = Property
        fields = []

    def __init__(self, *args, **kwargs):
        for key in kwargs['data'].keys():
            if key != "images":
                self.Meta.fields = list(self.Meta.fields)
                self.Meta.fields.append(key)

        super(UpdatePropertySerializer, self).__init__(*args, **kwargs)

    # When accessing property's images, primary image is the one with the lowest ID.
    def save(self, id, images):
        updated_fields = []
        validation_errors = {}
        property = Property.objects.get(id=id)

        title = self.validated_data.get('title', None)
        location = self.validated_data.get('location', None)
        description = self.validated_data.get('description', None)
        max_number_of_guests = self.validated_data.get('max_number_of_guests', None)
        price = self.validated_data.get('price', None)
        amenities = self.validated_data.get('amenities', None)

        if title is not None:
            property.title = title
            updated_fields.append('title')

        if location is not None:
            property.location = location
            updated_fields.append('location')

        if description is not None:
            property.description = description
            updated_fields.append('description')

        if max_number_of_guests is not None:
            if max_number_of_guests <= 0:
                validation_errors['max_number_of_guests'] = "Maximum number of guests must be > 0"
            else:
                property.max_number_of_guests = max_number_of_guests
                updated_fields.append('max_number_of_guests')

        if price is not None:
            if price <= 0:
                validation_errors['price'] = "Price must be > 0"
            else:
                property.price = round(price, 2)
                updated_fields.append('price')

        if amenities is not None:
            comma_seperated_pattern = re.compile(r"^[a-zA-Z0-9]{1,64}(?:,[a-zA-Z0-9]{1,64})*$")

            if comma_seperated_pattern.match(amenities) == None:
                validation_errors['amenities'] = "Amenities is not formatted as a comma-seperated list"
            else:
                amenities_list = amenities.split(",")
                amenities_list.sort()
                property.amenities = ",".join(amenities_list)
                updated_fields.append('amenities')

        if validation_errors != {}:
            raise ValidationError(validation_errors)
        else:
            property_image_objs = []
            if images is not None and images != []:
                if not all([type(elem) == InMemoryUploadedFile for elem in images]):
                    validation_errors['images'] = "Not all images are files"
                else:
                    # Delete current property images
                    property_images = property.propertyimages_set.all()
                    for image in property_images:
                        property_image_obj = PropertyImages.objects.get(id=image.id)
                        property_image_obj.image.delete(save=True)
                        property_image_obj.delete()
                    
                    # Create new images and add them
                    for image in images:
                        property_image_objs.append(PropertyImages(property=property, image=image))

                    updated_fields.append('images')

            if validation_errors != {}:
                raise ValidationError(validation_errors)
            else:
                if 'images' in updated_fields:
                    for property_image_obj in property_image_objs:
                        property_image_obj.save()
                    updated_fields.remove('images')

            property.save(update_fields=updated_fields)
            return property

class SearchPropertySerializer(ModelSerializer):
    class Meta:
        model = Property
        fields = '__all__'
