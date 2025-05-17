from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('/', views.shop_info, name='shop_info'),
    path('new-repair/', views.submit_repair, name='submit_repair'),
    path('repairs/', views.get_repairs, name='get_repairs'),
    path('pay/', views.pay, name='pay'),
    path('admin/showed-up/<repair_id>/', views.update_showed_up, name='update_showed_up'),
]
