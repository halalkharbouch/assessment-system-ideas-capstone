# authentication_backends.py

from django.contrib.auth.backends import BaseBackend
from django.contrib.auth import get_user_model

class EmailBackend(BaseBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        UserModel = get_user_model()
        print(f"Attempting to authenticate user with email: {email}")
        try:
            user = UserModel.objects.get(email=email)
            if user.check_password(password):
                return user
            else:
                print("Password does not match.")
        except UserModel.DoesNotExist:
            print("User does not exist.")
        return None
