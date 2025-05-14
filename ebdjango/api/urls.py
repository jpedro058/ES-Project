from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('shop/', views.shop_info, name='shop_info'),
    path('new-repair/', views.submit_repair, name='submit_repair'),
    path('repairs/', views.get_repairs, name='get_repairs'),
    path('repairs/status/<repair_id>/', views.repair_status, name='repair_status'),
    path('pay/', views.pay, name='pay'),
]
