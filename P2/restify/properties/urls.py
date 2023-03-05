from django.urls import path
from . import views

app_name="property"
urlpatterns = [ 
    path('create/', views.CreateProperty.as_view(), name="create"),
    path('all/', views.all_properties, name="all"),
    path('allHostProperty/', views.all_host_properties, name="all"),
    path('<int:id>/', views.get_property, name="get_property"),
    path('<int:id>/update/', views.UpdateProperty.as_view(), name="update"),
    path('<int:id>/delete/', views.DeleteProperty.as_view(), name="delete"),
    path('search/', views.PropertySearch.as_view(), name="search")
]
