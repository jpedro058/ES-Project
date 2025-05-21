from rest_framework import serializers
from .models import CustomUser, AppointmentSlot
from datetime import timedelta

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'face_id']

class AppointmentSlotSerializer(serializers.ModelSerializer):
    end_time = serializers.SerializerMethodField()

    class Meta:
        model = AppointmentSlot
        fields = ['id', 'start_time', 'end_time', 'is_booked']
    
    def get_end_time(self, obj):
        return (obj.start_time + timedelta(minutes=60)).strftime('%Y-%m-%dT%H:%M:%SZ')

