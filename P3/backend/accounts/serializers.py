from django.core.validators import validate_email
from rest_framework.exceptions import ValidationError
from rest_framework.fields import CharField
from rest_framework.serializers import ModelSerializer
from .models import RestifyUser

class CreateUserSerializer(ModelSerializer):
    class Meta:
        model = RestifyUser
        fields = ['username', 'password', 'email', 'phone_number', 'account_type', 'first_name', 'last_name']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def save(self, password2):
        validation_errors = {}
        phone_number=self.validated_data['phone_number']
        account_type=self.validated_data['account_type']

        user = RestifyUser(
            username=self.validated_data['username'],
            email=self.validated_data['email'],
            phone_number=phone_number,
            account_type=account_type,
            first_name=self.validated_data['first_name'],
            last_name=self.validated_data['last_name']
        )

        if len(phone_number) != 10:
            validation_errors['phone_number'] = 'Phone number must be 10 digits long'

        if account_type not in ["User", "Host"]:
            validation_errors['account_type'] = 'Account type must be either User or Host'

        password = self.validated_data['password']
        if password2 == None:
            validation_errors['password2'] = 'Verify Password not specified'
        if password != password2:
            validation_errors['password'] = 'Password does not match Password2'
        if len(password) < 8:
            validation_errors['password'] = 'Password must be at least 8 characters long'

        if validation_errors != {}:
            raise ValidationError(validation_errors)

        user.set_password(password)
        user.save()
        return user

class UpdateUserSerializer(ModelSerializer): 
    class Meta:
        model = RestifyUser
        fields = []

    def __init__(self, *args, **kwargs):
        for key in kwargs['data'].keys():
            self.Meta.fields = list(self.Meta.fields)
            self.Meta.fields.append(key)

        super(UpdateUserSerializer, self).__init__(*args, **kwargs)

    def save(self, username):
        updated_fields = []
        validation_errors = {}
        user = RestifyUser.objects.get(username=username)

        email = self.validated_data.get('email', None)
        phone_number = self.validated_data.get('phone_number', None)
        acc_type = self.validated_data.get('account_type', None)
        avatar = self.validated_data.get('avatar', None)
        password = self.validated_data.get('password', None)
        password2 = self.validated_data.get('password2', None)

        if email is not None:
            try:
                validate_email(email)
                user.email = email
                updated_fields.append('email')
            except:
                validation_errors['email'] = "Invalid email"

        if phone_number is not None:
            if len(phone_number) < 10 or not phone_number.isnumeric():
                validation_errors['phone_number'] = "Invalid phone number"
            else:
                user.phone_number = phone_number
                updated_fields.append('phone_number')

        if acc_type is not None:
            if acc_type not in ["User", "Host"]:
                validation_errors['account_type'] = "Account type is not 'User' or 'Host'"
            else:
                user.account_type = acc_type
                updated_fields.append('account_type')

        if password is not None:
            if password2 is not None:
                if password != password2:
                    validation_errors['password'] = "Password does not match Verify Password"
                elif len(password) < 8:
                    validation_errors['password'] = "Password is too short"
                else:
                    user.set_password(password)
                    updated_fields.append('password')
            else:
                validation_errors['password'] = "No Verify Password field provided"

        if validation_errors != {}:
            raise ValidationError(validation_errors)
        else:
            if avatar is not None:
                if user.avatar != avatar:
                    user.avatar.delete(save=True)
                user.avatar = avatar
                updated_fields.append('avatar')

            user.save(update_fields=updated_fields)
            return user
