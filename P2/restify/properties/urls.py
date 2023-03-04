from django.urls import path
from . import views

app_name="property"
urlpatterns = [ 
    path('create/', views.CreateProperty.as_view(), name="create"),
    path('all/', views.all_properties, name="all"),
    path('<int:id>/update/', views.UpdateProperty.as_view(), name="update")
]
