from rest_framework.exceptions import ValidationError
from rest_framework.serializers import ModelSerializer
from .models import Reservation, Property
from datetime import datetime
def generate_date_pairs(property: Property):
        date_pairs = []
        for res in property.reservations.all():
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
        if user.id != property.owner.id:
            raise ValidationError({"user": "User is not the owner of the property"})
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
        updated_fields = []
        start_date = self.validated_data.get('start_date', None)
        end_date = self.validated_data.get('end_date', None)
        status = self.validated_data.get('status', None)
        date_pairs = generate_date_pairs(res.property)

        # Change to both start and end date need to make sure dates dont overlap
        if start_date and end_date:
            converted_start = datetime.strptime(start_date, "%m-%d-%Y")
            converted_end = datetime.strptime(end_date, "%m-%d-%Y")
            if converted_start > converted_end:
                raise ValidationError({"dates": "Start date cannot be after end date"})
            if check_date_overlap(converted_start, converted_end, date_pairs):
                raise ValidationError({"dates": "Dates overlap with another reservation"})
            res.start_date = converted_start
            res.end_date = converted_end
            updated_fields.append("end_date")
            updated_fields.append("start_date")

        # Change to only end date need to make sure previous start date and new end date do not overlap
        elif end_date:
            converted_start = datetime.strptime(res.start_date, "%m-%d-%Y")
            converted_end = datetime.strptime(end_date, "%m-%d-%Y")
            if converted_start > converted_end:
                raise ValidationError({"dates": "Start date cannot be after end date"})
            if check_date_overlap(converted_start, converted_end, date_pairs):
                raise ValidationError({"dates": "Dates overlap with another reservation"})
            res.end_date = converted_end
            updated_fields.append("end_date")

        # Change to only start date need to make sure new start date and previous end date do not overlap
        else:
            converted_start = datetime.strptime(start_date, "%m-%d-%Y")
            converted_end = datetime.strptime(res.end_date, "%m-%d-%Y")
            if converted_start > converted_end:
                raise ValidationError({"dates": "Start date cannot be after end date"})
            if check_date_overlap(converted_start, converted_end, date_pairs):
                raise ValidationError({"dates": "Dates overlap with another reservation"})
            res.start_date = converted_start
            updated_fields.append("start_date")
        if status:
            res.status = status
            updated_fields.append("status")
        res.save(updated_fields=updated_fields)
        return res