from django.db import models

class User(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=200)
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.name
