from django.db import models

# Create your models here.
class App (models.Model):
    name = models.CharField(max_length=100)
    package = models.CharField(max_length=100)
    ver = models.IntegerField()
    url = models.CharField(max_length=200)
    release = models.CharField(max_length=20)
    action = models.CharField(max_length=20)
    #groups = models.ManyToManyField('Group')


class User (models.Model):
    name = models.CharField(max_length=100, default='')
    imei = models.CharField(max_length=20)

    # A client automatically inherits apps from its group
    group = models.ManyToManyField('Group')

    # These are apps not inherited from the group
    user_apps = models.ManyToManyField('App')

    phone_tags = models.TextField(default='[]')
    manual_tags = models.TextField(default='[]')
    
    # Inventory Information
    locked_inventory = models.BooleanField()
    simid = models.CharField(max_length=40)
    phone = models.CharField(max_length=40)
    assettag = models.CharField(max_length=40)

class Group (models.Model):
    name = models.CharField(max_length=20)
    desc = models.TextField(default='')
    apps = models.ManyToManyField('App')

class Logs (models.Model):
    imei = models.CharField(max_length=20)
    access = models.DateTimeField()
    packages = models.TextField()


#class REGISTRY (models.Model):
#    imei = models.CharField(max_length=20)
#    simid = models.CharField(max_length=40)
#    phone = models.CharField(max_length=40)
#    assettag = models.CharField(max_length=40)
 
