from django.db import models

# Create your models here.
class App (models.Model):
    name = models.CharField(max_length=100)
    package = models.CharField(max_length=100)
    ver = models.IntegerField()
    url = models.CharField(max_length=200)
    release = models.CharField(max_length=20)
    action = models.CharField(max_length=20)
    groups = models.ManyToManyField('Group')


class User (models.Model):
    imei = models.CharField(max_length=20)
    group = models.ManyToManyField('Group')
    apps = models.ManyToManyField('App')


class Group (models.Model):
    name = models.CharField(max_length=20)

class Logs (models.Model):
    imei = models.CharField(max_length=20)
    access = models.DateTimeField()
    packages = models.TextField()
