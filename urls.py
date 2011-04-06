from django.conf.urls.defaults import *

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('updater.views',
    (r'^updater/get/(?P<imei>\w*)$', 'get'),
    (r'^updater/$', 'index'),
    (r'^updater/add_user/(?P<imei>\w*)$', 'add_user'),
    (r'^updater/add_app/(?P<app_str>\w*)$', 'add_app'),
    (r'^updater/logs/$', 'logs'),
    # Example:
    # (r'^updates/', include('updates.foo.urls')),

    # Uncomment the admin/doc line below and add 'django.contrib.admindocs' 
    # to INSTALLED_APPS to enable admin documentation:
    # (r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # (r'^admin/', include(admin.site.urls)),
)

urlpatterns += patterns('',
    (r'^updater/login/$', 'django.contrib.auth.views.login',
        {'template_name': 'login.html'}),
    (r'^updater/logout/$', 'django.contrib.auth.views.logout',
        {'template_name': 'login.html'}),
)
