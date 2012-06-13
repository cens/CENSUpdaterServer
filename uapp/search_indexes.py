import datetime
from haystack.indexes import *
from haystack import site
from uapp.models import User
from uapp.models import Group
from uapp.models import App
import simplejson

# Note by Will Wu on May 15 2012:
#  We are using a Real Time Search Index, which means that whenever a Django model gets updated
#  i.e. whenever a new user is added, deleted, modified, etc., the Whoosh search index is rebuilt.
#
#  Note that the whoosh index path and all the files contained within it MUST have the same
#  owner and group as the Apache service that Django runs on. Otherwise there will be file
#  permission errors when the Whoosh index is rebuilt on-the-fly.
class UserIndex(RealTimeSearchIndex):
	text = CharField(document=True, use_template=True)
	name = CharField(model_attr='name')
	imei = CharField(model_attr='imei')
	group = CharField(use_template=True)
	group_apps = CharField(use_template=True)
	user_apps = CharField(use_template=True)
	
	phone_tags = CharField()
	manual_tags = CharField()
	
	def prepare_phone_tags(self, object):
		parsed = '\n'
		loaded_tags = simplejson.loads(object.phone_tags)
		for tag in loaded_tags:
			parsed += '\n' + tag['key'] + '\n'
			parsed += '\n' + tag['value'] + '\n'
		return parsed + '\n\n'
		
	def prepare_manual_tags(self, object):
		parsed = '\n'
		loaded_tags = simplejson.loads(object.manual_tags)
		for tag in loaded_tags:
			parsed += '\n' + tag['key'] + '\n'
			parsed += '\n' + tag['value'] + '\n'
		return parsed + '\n\n'
	
site.register(User, UserIndex)