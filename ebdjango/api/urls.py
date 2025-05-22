from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from . import views

urlpatterns = [
    path('', views.shop_info, name='shop_info'),
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('login/login-with-credentials/', views.loginWithCredentials, name='loginWithCredentials'),
    path('new-repair/', views.submit_repair, name='submit_repair'),
    path('repairs/', views.get_repairs, name='get_repairs'),
    path('pay/<repair_id>/', views.pay, name='pay'),
    path('admin/showed-up/<repair_id>/', views.update_showed_up, name='update_showed_up'),
    path('admin/picked-up/<repair_id>/', views.update_picked_up, name='update_picked_up'),
    path('admin/adcost/<repair_id>/', views.update_aditional_cost, name='update_aditional_cost'),
    path('available-slots/', views.get_available_slots, name='get_available_slots'),
    path('repairs/<str:repair_id>/', views.get_repair_by_id, name='get_repair_by_id')

]
