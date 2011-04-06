# Create your views here.

from django.template import Context, loader
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User

from django.http import HttpResponse, HttpResponseRedirect
from updater.models import App, User, Group, Logs
import simplejson
import datetime
from pytz import timezone


main_page = 'https://systemsens.cens.ucla.edu/updates/updater/'

class UserData:
    def __init__(self, user):
        self.imei = user.imei
        self.user_apps = list()

        for app in user.apps.all():
            self.user_apps.append(app.name + "(" + str(app.release) + ")") 

        if len(user.group.all()) > 0:
            self.group = user.group.all()[0].name



class AppData:
    def __init__(self, app, checked):
        self.package = app.package
        self.name = app.name
        self.ver = app.ver
        self.release = app.release
        self.checked = checked


class LoggedApp:
    def __init__(self, package, version):
        self.package = package
        self.ver = version



class GroupData:
    def __init__(self, group, count, checked):
        self.name = group.name
        self.checked = checked
        self.users = count


class LogRecord:
    def __init__(self, imei, dt, count):
        self.imei = imei
        self.time = dt
        self.count = count

def local_time_str(naive_t):
    utc_t = naive_t.replace(tzinfo = timezone('UTC'))
    local_t = utc_t.astimezone(timezone('US/Pacific'))
    return str(local_t)

 

def addAppToGroup(group, app):
    app.groups.add(group)
    user_q = User.objects.filter(group__exact = group)

    for user in user_q.all():
        user.apps.add(app)

def removeAppFromGroup(group, app):
    app.groups.remove(group)
    user_q = User.objects.filter(group__exact = group)

    for user in user_q.all():
        user.apps.remove(app)





def getAppData(app):
    obj = {}
    obj['package'] = app.package
    obj['release'] = app.release
    obj['ver'] = app.ver
    obj['url'] = app.url
    obj['name'] = app.name
    obj['action'] = app.action

    return obj


def findGroup(group_name, user):
    group_q = Group.objects.filter(name__exact = group_name)
    if len(group_q) > 0:
        group = group_q.all()[0]
    else:
        group = Group()
        group.name = group_name
        group.save()

    # User is being added to an existing group. Add all the 
    # apps that point to this group to this user's app list
    app_q = App.objects.filter(groups__exact = group)
    for a in app_q.all():
        user.apps.add(a)


    return group



def get(request, imei):

    unmanaged_str = 'managed=0, '
    managed_str = 'managed=1, '

    user_q = User.objects.filter(imei__exact = imei)

    #mydebug = open('/tmp/updaterdebug.txt', 'a')
    #mydebug.close()


    log = Logs()
    log.imei = imei
    log.access = datetime.datetime.now()

    if request.method == 'GET':
        try:
            log.packages =  request.GET['packages'] 
        except (KeyError):
            log.packages = "{'error':'could not parse from get request'}"
            
    log.save()

    if len(user_q) == 0:
        response = HttpResponse(unmanaged_str)
        managed = False
    else:
        managed = True
        response = HttpResponse(managed_str)
        myuser = user_q.all()[0]


    applist = []

    if managed:
        for a in myuser.apps.all():
            applist.append(getAppData(a))
    else:
        for a in App.objects.all():
            applist.append(getAppData(a))



    response.write(simplejson.dumps(applist))

    return response


@login_required
def index(request):

    appslist = list()
    for a in App.objects.all():
        appslist.append(a)


    userslist = list()
    for u in User.objects.all():
        userslist.append(UserData(u))



    t = loader.get_template('main.html')
    c = Context({'apps': appslist,
                 'users': userslist 
        })


    return HttpResponse(t.render(c))


@login_required
def add_user(request, imei):

    t = loader.get_template('user.html')

    appslist = list()
    userapps = list()

    debug_str = ""

    if request.method == 'POST':
        if 'cancel' in request.POST:
            return HttpResponseRedirect(main_page)

        debug_str = str(request.POST)
        imei = request.POST['user_imei']
        group_name = request.POST['user_group']
        myuser = User()

        if len(imei) > 0:
            user_q = User.objects.filter(imei__exact = imei)
            if len(user_q) > 0:
                myuser = user_q.all()[0]
                if 'delete' in request.POST:
                    myuser.delete()
                    return HttpResponseRedirect(main_page)
            else:
                myuser.imei = imei
                myuser.save()


            if len(group_name) > 0:
                if len(myuser.group.all()) > 0:
                    myuser.group.clear()
                myuser.group.add(findGroup(group_name, myuser))



            for a in App.objects.all():
                app_str = str(a.package) + "(" + str(a.release) + ")"
                try: 
                    app_status = request.POST[app_str]
                    if app_status == 'on':
                        myuser.apps.add(a)

                except (KeyError):
                    if a in myuser.apps.all():
                        myuser.apps.remove(a)

            myuser.save()
            userapps = myuser.apps.all()
            message = "Saved user information."
            new_user = False

        else:
            message = "IMEI cannot be empty."
            new_user = True

                  


    else:
        if len(imei) > 0:
            user_q = User.objects.filter(imei__exact = imei)
            if len(user_q) > 0:
                myuser = user_q.all()[0]
                message = "Update user."
                userapps = myuser.apps.all()
                usergroup = myuser.group.all()
                if len(usergroup) > 0:
                    group_name = usergroup.all()[0].name
                else:
                    group_name = ""
                new_user = False
            else:
                message = "Add new user"
                new_user = True
        else:
            message = "Add new user."
            new_user = True


    for a in App.objects.all():
        if a in userapps:
            appslist.append(AppData(a, True))
        else:
            appslist.append(AppData(a, False))



    c = Context({'apps': appslist,
                 'message': message,
                 'debug' : debug_str,
        })

    if not new_user:
        log_q = Logs.objects.filter(imei__exact = imei)
        log_q = log_q.order_by('access')
        count = log_q.count()
        loggedapps1 = list()
        loggedapps2 = list()
        if count > 0:
            access1 =  local_time_str( log_q.all()[count - 1].access )
            packages_str = str(log_q.all()[count - 1].packages)
            packages = simplejson.loads(packages_str)
            for package in packages.keys():
                loggedapps1.append(LoggedApp(package, packages[package]))

        if count > 1:
            access2 =  local_time_str( log_q.all()[count - 2].access )

            access2 = str(log_q.all()[count - 2].access)
            packages_str = str(log_q.all()[count - 2].packages)
            packages = simplejson.loads(packages_str)
            for package in packages.keys():
                loggedapps2.append(LoggedApp(package, packages[package]))


        else:
            access1 = 'No record'
            access2 = 'No record'

    
        c.update({'user': myuser,
                  'group': group_name,
                  'logdate1': access1,
                  'loggedapps1' : loggedapps1,
                  'logdate2': access2,
                  'loggedapps2' : loggedapps2,

                  })



    return HttpResponse(t.render(c))

@login_required
def add_app(request, app_str):


    t = loader.get_template('app.html')


    debug_str = ""

    appgroups = list()
    grouplist = list()

    if request.method == 'POST':
        if 'cancel' in request.POST:
            return HttpResponseRedirect(main_page)

        debug_str = str(request.POST)
        name = request.POST['app_name']
        ver = request.POST['app_ver']
        release = request.POST['app_release']
        package = request.POST['app_package']
        url = request.POST['app_url']
        action = request.POST['action']


        myapp = App()

        if len(name) == 0 or len(ver) == 0 or len(url) == 0 or len(package) == 0 or len(release) == 0:
            message = "Please specify all values"
            new_app = True
        else:
            app_q = App.objects.filter(name__exact = name)
            app_q = app_q.filter(release__exact = release)
            if len(app_q) == 1:
                myapp = app_q.all()[0]
                if 'delete' in request.POST:
                    myapp.delete()
                    return HttpResponseRedirect(main_page)

            elif len(app_q) > 1:
                message = "There is a problem. Contact Hossein."
                
                
            myapp.name = name
            myapp.package = package
            myapp.ver = eval(ver)
            myapp.release = release
            myapp.url = url
            myapp.action = action
            myapp.save()

            for g in Group.objects.all():
                try: 
                    grp_status = request.POST[g.name]
                    if grp_status == 'on':
                        addAppToGroup(g, myapp)

                except (KeyError):
                    if g in myapp.groups.all():
                        removeAppFromGroup(g, myapp)


            appgroups = myapp.groups.all()
            message = "Saved application information."


            new_app = False
                  


    else:
        if len(app_str) > 0:
            (name, release) = app_str.rsplit("__")
            if len(name) > 0 and len(release):
                app_q = App.objects.filter(name__exact = name)
                app_q = app_q.filter(release__exact = release)


                if len(app_q) == 1:
                    myapp = app_q.all()[0]
                    appgroups = myapp.groups.all()
                    message = "Update application information."
                    new_app = False
                else:
                    message = "Add new application."
                    new_app = True
        else:
            message = "Add new application."
            new_app = True


    for g in Group.objects.all():
        user_count = User.objects.filter(group__exact = g).count() 
        if user_count == 0:
            g.delete()
        else:
            if g in appgroups:
                grouplist.append(GroupData(g, user_count, True))
            else:
                grouplist.append(GroupData(g, user_count, False))

        


    actions = ['Update', 'Clean']

    c = Context({ 'message': message,
                 'debug' : debug_str,
                 'groups' : grouplist,
                 'actions' : actions,
        })

    if not new_app:
        cur_action = myapp.action
        c.update({'app': myapp,
                 'action' : cur_action

            })


    return HttpResponse(t.render(c))



@login_required
def logs(request):
    t = loader.get_template('logs.html')

    logs = list()

    for u in User.objects.all():
        log_q = Logs.objects.filter(imei__exact = u.imei)
        log_q = log_q.order_by('access')
        count = log_q.count()
        if count > 0:
            access =  local_time_str(log_q.all()[count - 1].access)
        else:
            access = 'No record'
        
        logs.append(LogRecord(u.imei, access , count))

    c = Context({'logs' : logs,
                 'message' : 'Client access log'
                 })
    
    return HttpResponse(t.render(c))
