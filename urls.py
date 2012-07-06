from django.conf.urls.defaults import *

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('uapp.views',
	(r'^uapp/add_app/(?P<app_str>\w*)$', 'add_app'),
	(r'^uapp/add_user/(?P<imei>\w*)$', 'add_user'),
	(r'^uapp/listClients/$', 'listClients'),
	(r'^uapp/listApps/$', 'listApps'),
	(r'^uapp/listAppNames/$', 'listAppNames'),
	(r'^uapp/listGroups/$', 'listGroups'),
	(r'^uapp/getClientApps/(?P<imei>\w*)$', 'getClientApps'),
	(r'^uapp/getClientTags/(?P<imei>\w*)$', 'getClientTags'),
	(r'^uapp/getClientLogs/(?P<imei>\w*)$', 'getClientLogs'),
	(r'^uapp/deleteClients/$', 'deleteClients'),
	(r'^uapp/getGroupApps/(?P<groupname>\w*)$', 'getGroupApps'),
	(r'^uapp/add_group/$', 'add_group'),
	(r'^uapp/delete_group/$', 'delete_group'),
	(r'^uapp/delete_app_version/$', 'delete_app_version'),
	(r'^uapp/getAppReleases/(?P<appname>\w*)$', 'getAppReleases'),
	(r'^uapp/getReleaseVersions/(?P<appname>\w*)/(?P<release>\w*)$', 'getReleaseVersions'),
	(r'^uapp/getAppDetails/$', 'getAppDetails'),
	(r'^uapp/getAppGroups/(?P<appname>\w*)/(?P<release>\w*)/(?P<version>\w*)$', 'getAppGroups'),
	(r'^uapp/batchEditClients/(?P<validated>\w*)$', 'batchEditClients'),
	(r'^uapp/get/(?P<imei>\w*)$', 'get'),
	(r'^uapp/register/', 'register'),
	
	# Needs to be re-written for data model change
	(r'^uapp/logs/$', 'logs'),
)

urlpatterns += patterns('',
    (r'^uapp/login/$', 'django.contrib.auth.views.login',
        {'template_name': 'login.html'}),
    (r'^uapp/logout/$', 'django.contrib.auth.views.logout',
        {'template_name': 'login.html'}),
)
