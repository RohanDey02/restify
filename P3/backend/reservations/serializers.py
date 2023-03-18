from rest_framework.exceptions import ValidationError
from rest_framework.serializers import ModelSerializer
from .models import Reservation, Property
from datetime import datetime
def generate_date_pairs(property: Property, exclude_id=None):
        date_pairs = []
        if exclude_id is None:
            for res in property.reservations.all():
                date_pairs.append([res.end_date, res.start_date])
        else:
            for res in property.reservations.all().exclude(id=exclude_id):
                date_pairs.append([res.end_date, res.start_date])
        date_pairs.sort()
        for i in range(len(date_pairs)):
            date_pairs[0][0], date_pairs[0][1] = date_pairs[0][1], date_pairs[0][0]
        return date_pairs
def check_date_overlap(start, end, date_pairs):
    for date_pair in date_pairs:
        if start <= date_pair[0] and end >= date_pair[1] \
            or start >= date_pair[0] and end <= date_pair[1] \
            or start >= date_pair[0] and start <= date_pair[1] \
            or end >= date_pair[0] and end <= date_pair[1]:
            return True
    return False
class CreateReservationSerializer(ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['start_date', 'end_date']


    def save(self, user, property: Property):
        if self.validated_data["end_date"] < self.validated_data["start_date"]:
            raise ValidationError({"dates": "End date must be after start date"})
        date_pairs = generate_date_pairs(property)
        if check_date_overlap(self.validated_data['start_date'], self.validated_data['end_date'], date_pairs):
            raise ValidationError({"dates": "Dates overlap with another reservation"})
        reservation = Reservation(
            start_date=self.validated_data['start_date'],
            end_date=self.validated_data['end_date'],
            status="Pending",
            user=user,
            property=property,
            feedback=None
        )

        reservation.save()
        return {
                'id': reservation.pk,
                'start_date': reservation.start_date,
                'end_date': reservation.end_date,
                'status': reservation.status,
                'feedback': reservation.feedback
                }

class UpdateReservationSerializer(ModelSerializer):
    class Meta:
        model = Reservation
        fields = ["id", "status", "start_date", "end_date"]
    def save(self, res: Reservation, **kwargs):
        # NOTE THAT json strings formatted "YYYY-MM-DD" are converted to datetime objects
        updated_fields = []
        start_date = self.validated_data.get('start_date', None)
        end_date = self.validated_data.get('end_date', None)
        status = self.validated_data.get('status', None)
        date_pairs = generate_date_pairs(res.property, res.id)

        # Change to both start and end date need to make sure dates dont overlap
        if start_date and end_date:
            if start_date > end_date:
                raise ValidationError({"dates": "Start date cannot be after end date"})
            if check_date_overlap(start_date, end_date, date_pairs):
                raise ValidationError({"dates": "Dates overlap with another reservation"})
            res.start_date = start_date
            res.end_date = end_date
            updated_fields.append("end_date")
            updated_fields.append("start_date")

        # Change to only end date need to make sure previous start date and new end date do not overlap
        elif end_date:
            # NO CONVERSION HAPPENING database sends back datetime object
            converted_start = res.start_date
            if converted_start > end_date:
                raise ValidationError({"dates": "Start date cannot be after end date"})
            if check_date_overlap(converted_start, end_date, date_pairs):
                raise ValidationError({"dates": "Dates overlap with another reservation"})
            res.end_date = end_date
            updated_fields.append("end_date")

        # Change to only start date need to make sure new start date and previous end date do not overlap
        elif start_date:
            converted_end = res.end_date
            if start_date > converted_end:
                raise ValidationError({"message": "error", "dates": "Start date cannot be after end date"})
            if check_date_overlap(start_date, converted_end, date_pairs):
                raise ValidationError({"message": "error", "dates": "Dates overlap with another reservation"})
            res.start_date = start_date
            updated_fields.append("start_date")

        # NON HOST USERS CANNOT CHANGE STATUS
        if status and status in ["pending", "denied", "approved", "cancelled", "completed", "terminated"]:
            res.status = status.capitalize()
            updated_fields.append("status")
        res.save(update_fields=updated_fields)
        return res

class SearchReservationSerializer(ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['id', 'start_date', 'end_date', 'status']
