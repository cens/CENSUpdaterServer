Ext.define('Updater.controller.Applications', {
    extend: 'Ext.app.Controller',
	requires: ['Updater.view.application.Show',
				'Ext.data.Connection', 'Ext.button.Button'],
    stores: ['Applications', 'Groups'],

    models: ['Application', 'Group'],
	
    views: ['application.Window'],

    refs: [{
    	ref: 'viewer',
    	selector: 'viewer'
    },{
		ref: 'sectionList',
		selector: 'sectionlist'
	},{
		ref: 'appComboBox',
		selector: 'applicationwindow > form > fieldset > container > combobox[fieldLabel="Name"]'
	},{
		ref: 'releaseComboBox',
		selector: 'applicationwindow > form > fieldset > container > combobox[fieldLabel="Release"]'
		
	},{
		ref: 'versionComboBox',
		selector: 'applicationwindow > form > fieldset > container > combobox[fieldLabel="Version"]'

	},{
		ref: 'appProperties',
		selector: 'applicationwindow > form > fieldset[title="Edit Application Properties"]'
	}],

    init: function() {
		//alert('wtf');
        this.control({
			'#modifyGroupCombo': {
				//select: this.selectGroup
			},'applicationwindow > form > fieldset > container > combobox[fieldLabel="Name"]':{
				select: this.selectApp
			},'applicationwindow > form > fieldset > container > combobox[fieldLabel="Release"]': {
				select: this.selectRelease
			},'applicationwindow > form > fieldset > container > combobox[fieldLabel="Version"]': {
				select: this.selectVersion
			},'#appDeleteButton': {
				click: this.deleteRelease
			},'#appSaveButton': {
				click: this.saveRelease
			},'#addAppButton': {
				click: this.addApp
			},'#addReleaseButton': {
				click: this.addRelease
			},'#addVersionButton': {
				click: this.addVersion
			}
			
        });
    },
	addApp: function () {
		var appStore = this.getAppComboBox().getStore();
		var pane = this.getAppProperties();
		
		Ext.Msg.prompt('New Application', 'Please enter application name:',
			Ext.bind(function(btn, text) {
			    if (btn == 'ok') {
					// Check to see if the app already exists
					if (appStore.find('name', text) == -1) {
						
						// Add the app to the Applications store
						appStore.add({'name':text});
						this.getAppComboBox().setValue(text);
						
						// Show loading status
						//Ext.getCmp('applicationWindow').setLoading(true);
						this.getAppProperties().setDisabled(true);
						Ext.getCmp('appDeleteButton').setDisabled(true);
						Ext.getCmp('appSaveButton').setDisabled(true);
						Ext.getCmp('releaseContainer').setDisabled(false);
						Ext.getCmp('versionContainer').setDisabled(true);
						
						// Clear the existing fields
						this.getReleaseComboBox().getStore().removeAll();
						this.getVersionComboBox().getStore().removeAll();
						
						this.getReleaseComboBox().setValue('');
						this.getVersionComboBox().setValue('');
						
						//pane.down('textfield[fieldLabel="Version"]').setRawValue('');
						pane.down('textfield[fieldLabel="Package"]').setRawValue('');
						pane.down('textfield[fieldLabel="URL"]').setRawValue('');
						pane.down('combobox[fieldLabel="Action"]').setRawValue('');

						Ext.getCmp('secondGroupGrid').getStore().removeAll();
						//this.selectGroup(Ext.getCmp('modifyGroupCombo'), this.getGroupsStore().find('name',text), true);
						
					} else {
						
						// If the group already exists in the database
						Ext.Msg.alert('Error', 'This application already exists. Please choose a different application name.');
					}
					
			        
					//var idx = this.getGroupsStore().find('name',text);
					//Ext.getCmp('modifyGroupCombo').select(this.getGroupsStore().data.items[idx]);
				}
			}, this));
	},
	addVersion: function () {
		var versionStore = this.getVersionComboBox().getStore();
		var pane = this.getAppProperties();
		
		Ext.Msg.prompt('New Version', 'Please enter version number:',
			Ext.bind(function(btn, text) {
			    if (btn == 'ok') {
					// Check to see if the release already exists
					if (versionStore.find('version', text) == -1) {
						
						// Add the release to the release store
						versionStore.add({'version':text});
						this.getVersionComboBox().setValue(text);

						// Show loading status
						Ext.getCmp('applicationWindow').setLoading(true);
						this.getAppProperties().setDisabled(true);
						Ext.getCmp('appDeleteButton').setDisabled(true);
						Ext.getCmp('appSaveButton').setDisabled(true);
						
						// Clear the existing fields
						//pane.down('textfield[fieldLabel="Package"]').setRawValue('');
						pane.down('textfield[fieldLabel="URL"]').setRawValue('');
						pane.down('combobox[fieldLabel="Action"]').setRawValue('');

						// Commented out to leave the selection
						/* Ext.getCmp('secondGroupGrid').getStore().removeAll();
						
						
						var firstStore = Ext.getCmp('firstGroupGrid').getStore();

						firstStore.addListener('load', function () {
							Ext.getCmp('applicationWindow').setLoading(false);
							this.getAppProperties().setDisabled(false);
							//Ext.getCmp('appDeleteButton').setDisabled(false);
							Ext.getCmp('appSaveButton').setDisabled(false);

						}, this, {'single': true});

						firstStore.load(); */
						
						pane.down('statusbar[name="secondBar"]').setText('Automatically selected groups from last version.');
						
						
						Ext.getCmp('applicationWindow').setLoading(false);
						this.getAppProperties().setDisabled(false);
						Ext.getCmp('appSaveButton').setDisabled(false);
						
					} else {
						
						// If the release already exists in the database
						Ext.Msg.alert('Error', 'This version already exists. Please choose a different version number.');
					}
				}
			}, this));
		
	},
	addRelease: function () {
		var releaseStore = this.getReleaseComboBox().getStore();
		var pane = this.getAppProperties();
		
		Ext.Msg.prompt('New Release', 'Please enter release name:',
			Ext.bind(function(btn, text) {
			    if (btn == 'ok') {
					// Check to see if the release already exists
					if (releaseStore.find('release', text) == -1) {
						
						// Add the release to the release store
						releaseStore.add({'release':text});
						this.getReleaseComboBox().setValue(text);

						// Show loading status
						//Ext.getCmp('applicationWindow').setLoading(true);
						this.getAppProperties().setDisabled(true);
						Ext.getCmp('appDeleteButton').setDisabled(true);
						Ext.getCmp('appSaveButton').setDisabled(true);
						
						// Clear the existing fields
						//pane.down('textfield[fieldLabel="Version"]').setRawValue('');
						pane.down('textfield[fieldLabel="Package"]').setRawValue('');
						pane.down('textfield[fieldLabel="URL"]').setRawValue('');
						pane.down('combobox[fieldLabel="Action"]').setRawValue('');

						Ext.getCmp('secondGroupGrid').getStore().removeAll();
						Ext.getCmp('versionContainer').setDisabled(false);
						
						this.getVersionComboBox().getStore().removeAll();
						this.getVersionComboBox().setRawValue('');
						
						
						
					} else {
						
						// If the release already exists in the database
						Ext.Msg.alert('Error', 'This release already exists. Please choose a different release name.');
					}
				}
			}, this));
	},
	resetApplicationSection: function () {
		var pane = this.getAppProperties();
		
		// Show loading status
		
		this.getAppProperties().setDisabled(true);
		Ext.getCmp('appDeleteButton').setDisabled(true);
		Ext.getCmp('appSaveButton').setDisabled(true);

		// Clear the existing fields
		pane.down('textfield[fieldLabel="Package"]').setRawValue('');
		pane.down('textfield[fieldLabel="URL"]').setRawValue('');
		pane.down('combobox[fieldLabel="Action"]').setRawValue('');

		Ext.getCmp('firstGroupGrid').getStore().removeAll();
		Ext.getCmp('secondGroupGrid').getStore().removeAll();
		Ext.getCmp('versionContainer').setDisabled(false);

		this.getAppComboBox().getStore().load();
		this.getAppComboBox().setRawValue('');
		this.getReleaseComboBox().getStore().removeAll();
		this.getReleaseComboBox().setRawValue('');
		this.getVersionComboBox().getStore().removeAll();
		this.getVersionComboBox().setRawValue('');
			
		// Enable the Release combobox
		Ext.getCmp('releaseContainer').setDisabled(true);
		// Disable the Version combobox
		Ext.getCmp('versionContainer').setDisabled(true);
	},
	deleteRelease: function () {
		var appName = this.getAppComboBox().getRawValue();
		var releaseName = this.getReleaseComboBox().getRawValue();
		var pane = this.getAppProperties();
		
		var appVersion = this.getVersionComboBox().getRawValue();
		/*var appPackage = pane.down('textfield[fieldLabel="Package"]').getRawValue();
		var appURL = pane.down('textfield[fieldLabel="URL"]').getRawValue();
		var appAction = pane.down('combobox[fieldLabel="Action"]').getRawValue();*/
		
		var promptString = 'Are you sure you want to delete the application \'' +
							appName + '(' + releaseName + ':' + appVersion + ')' +
							'\'?';

		Ext.Msg.show({
			title: 'Delete Version?',
			msg: promptString,
			buttons: Ext.Msg.YESNO,
			icon: Ext.Msg.WARNING,
			fn: function(btn, text) {
				if (btn == 'yes') {
					// Grab the POST values
					postParams = {
						'app_name' : appName,
						'app_ver'  : appVersion,
						'app_release' : releaseName
					};

					// Make the HTTP POST request
			        var conn = new Ext.data.Connection();
					conn.request({
						method: 'POST',
						url: '/uproject/uapp/delete_app_version/',
						params: postParams,
						success: Ext.bind(function() {
						
							Ext.Msg.alert('Success', 'Version Deleted Successfully.');
		
							this.resetApplicationSection();
							
							
						}, this),
						failure: function() { Ext.Msg.alert('Failure', 'Error while deleting version. Please retry.'); }
					})
				}
			},
			scope: this
		})	
	},
	saveRelease: function () {
		Ext.getCmp('applicationWindow').setLoading(true);
		
		var appName = this.getAppComboBox().getRawValue();
		var releaseName = this.getReleaseComboBox().getRawValue();
		var pane = this.getAppProperties();
		
		var appVersion = this.getVersionComboBox().getRawValue();
		var appPackage = pane.down('textfield[fieldLabel="Package"]').getRawValue();
		var appURL = pane.down('textfield[fieldLabel="URL"]').getRawValue();
		var appAction = pane.down('combobox[fieldLabel="Action"]').getRawValue();
		
		var secondStore = Ext.getCmp('secondGroupGrid').getStore();
		
		// Generate the POST parameters
		postParams = {
			'app_name' : appName,
			'app_ver'  : appVersion,
			'app_release' : releaseName,
			'app_package' : appPackage,
			'app_url' : appURL,
			'action' : appAction
		};
		
		var addGroups = function (record) {
			postParams[record.get('name')] = 'on'
		};
		
		secondStore.each(addGroups, this);
				
		var conn = new Ext.data.Connection();
		conn.request({
			method: 'POST',
			url: '/uproject/uapp/add_app/',
			params: postParams,
			success: Ext.bind(function(conn, response) {
				if (conn.responseText == 'Error: Attempting to re-use package name that is already taken by another application.') {
					Ext.Msg.alert('Status', conn.responseText);
				} else {
					Ext.Msg.alert('Status', 'Application saved successfully.');
				}
				
				Ext.getCmp('appDeleteButton').setDisabled(true);
				Ext.getCmp('appSaveButton').setDisabled(true);
				this.selectVersion(this.getVersionComboBox(), null, null);
				pane.down('statusbar[name="secondBar"]').setText('');

			}, this),
			failure: function() { Ext.Msg.alert('Status', 'Error while connecting to database. Please retry.'); }
		});
		
	},
	removeIntersection: function (first, second) {
		var removeFunc = function (record) {
			var index = first.findExact('name', record.get('name'));
			var selectedRecord = first.getAt(index);
			if (selectedRecord.get('desc') == record.get('desc')) {
				first.removeAt(index);
			}
		};
		
		second.each(removeFunc, this);
	},
	selectVersion: function(combo, records, opts) {
		
		Ext.getCmp('applicationWindow').setLoading(true);
		
		var appName = this.getAppComboBox().getRawValue();
		var releaseName = this.getReleaseComboBox().getRawValue();
		var versionNumber = this.getVersionComboBox().getRawValue();
		
		var pane = this.getAppProperties();
		
		// Get the selected application's details from the server
		var conn = new Ext.data.Connection();
		conn.request({
			method: 'POST',
			url: '/uproject/uapp/getAppDetails/',
			params: { 'name' : appName, 'release' : releaseName, 'version': versionNumber },
			success: Ext.bind(function(conn, response) {
				
				var details = Ext.JSON.decode(conn.responseText);
				
				//pane.down('textfield[fieldLabel="Version"]').setRawValue(details['version']);
				pane.down('textfield[fieldLabel="Package"]').setRawValue(details['package']);
				pane.down('textfield[fieldLabel="URL"]').setRawValue(details['url']);
				pane.down('combobox[fieldLabel="Action"]').setRawValue(details['action']);
				
				var firstStore = Ext.getCmp('firstGroupGrid').getStore();
				var secondStore = Ext.getCmp('secondGroupGrid').getStore();
				
				firstStore.addListener('load', function () {
					secondStore.proxy.url = '/uproject/uapp/getAppGroups/' + appName + '/' + releaseName + '/' + versionNumber;
					
					secondStore.addListener('load', function () {
						// Remove intersection of two stores
						this.removeIntersection(firstStore, secondStore);
						
						// Remove loading mask...
						Ext.getCmp('applicationWindow').setLoading(false);
						this.getAppProperties().setDisabled(false);
						Ext.getCmp('appDeleteButton').setDisabled(false);
						Ext.getCmp('appSaveButton').setDisabled(false);
						
					}, this, {'single':true});
					
					secondStore.load();
				}, this, {'single': true});
				
				firstStore.load();		

			}, this),
			failure: function() { Ext.Msg.alert('Status', 'Error while loading details from database. Please retry.'); }
		});
		
	},
	selectRelease: function(combo, records, opts) {
		
		// Disable the "Edit Application Properties" container, in the case that it was
		// previously enabled
		this.getAppProperties().setDisabled(true);
		
		var appurl = '/uproject/uapp/getReleaseVersions/'+ this.getAppComboBox().getRawValue() + '/' + combo.getRawValue();
		this.getVersionComboBox().getStore().proxy.url = appurl;
		this.getVersionComboBox().getStore().load();
		Ext.getCmp('versionContainer').setDisabled(false);

		
	},
	selectApp: function(combo, records, opts) {

				
		// Disable the "Edit Application Properties" container, in the case that it was
		// previously enabled
		this.getAppProperties().setDisabled(true);
		
		this.getReleaseComboBox().getStore().removeAll();
		this.getReleaseComboBox().setRawValue('');
		var appurl = '/uproject/uapp/getAppReleases/'+ combo.getRawValue();
		this.getReleaseComboBox().getStore().proxy.url = appurl;
		this.getReleaseComboBox().getStore().load();
		
		this.getVersionComboBox().getStore().removeAll();
		this.getVersionComboBox().setRawValue('');
		
		// Enable the Release combobox
		Ext.getCmp('releaseContainer').setDisabled(false);
		
		// Disable the Version combobox
		Ext.getCmp('versionContainer').setDisabled(true);
		
	}

});