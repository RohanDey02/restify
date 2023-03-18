from django.urls import path
from . import views

app_name="property"
urlpatterns = [ 
    path('create/', views.CreateProperty.as_view(), name="create"),
    path('allHostProperty/', views.AllHostProperties.as_view(), name="all"),
    path('<int:id>/', views.get_property, name="get_property"),
    path('<int:id>/update/', views.UpdateProperty.as_view(), name="update"),
    path('<int:id>/delete/', views.DeleteProperty.as_view(), name="delete"),
    path('search/', views.PropertySearch.as_view(), name="search")
]
