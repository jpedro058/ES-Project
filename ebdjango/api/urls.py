from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('shop/', views.shop_info, name='shop_info'),
    path('repairs/', views.submit_repair, name='submit_repair'),
    path('pay/', views.pay, name='pay'),
    path('status/<int:repair_id>/', views.repair_status, name='repair_status'),
]
