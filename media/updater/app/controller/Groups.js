/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
Ext.define('Updater.controller.Groups', {
    extend: 'Ext.app.Controller',
	requires: ['Updater.view.group.Show',
				'Ext.data.Connection', 'Ext.button.Button'],
    stores: ['Applications', 'Groups'],

    models: ['Application', 'Group'],
	
    views: ['group.Window'],

    refs: [{
    	ref: 'viewer',
    	selector: 'viewer'
    }, {
		ref: 'selectedAppGrid',
		selector: '#selectedAppGrid'
	},{
		ref: 'availableAppGrid',
		selector: '#availableAppGrid'
	},{
		ref: 'editAppField',
		selector: '#editAppField'
	},{
		ref: 'groupSaveButton',
		selector: '#groupSaveButton'
	},{
		ref: 'groupDeleteButton',
		selector: '#groupDeleteButton'
	}],

    init: function() {
		//alert('wtf');
        this.control({
			'#modifyGroupCombo': {
				select: this.selectGroup
			},'#groupSaveButton': {
				click: this.saveGroup
			},'#addGroupButton': {
				click: this.addGroup
			},'#groupDeleteButton': {
				click: this.deleteGroup
			}
        });
    },
	deleteGroup: function () {
		var groupName = Ext.getCmp('modifyGroupCombo').getRawValue();
		
		var promptString = 'Are you sure you want to delete group \'' +
							groupName +
							'\'? All users in this group will be moved to group \'Unmanaged\'.';

		Ext.Msg.show({
			title: 'Delete Group?',
			msg: promptString,
			buttons: Ext.Msg.YESNO,
			icon: Ext.Msg.WARNING,
			fn: function(btn, text) {
				if (btn == 'yes') {
					// Grab the POST values
					postParams = {
						'group'  : groupName
					};

					// Make the HTTP POST request
			        var conn = new Ext.data.Connection();
					conn.request({
						method: 'POST',
						url: '/uproject/uapp/delete_group/',
						params: postParams,
						success: Ext.bind(function() {
						
							Ext.Msg.alert('Success', 'Group Deleted Successfully.');
		
							// Remove the group from the store
							var idx = this.getGroupsStore().find('name', groupName);
							this.getGroupsStore().removeAt(idx);
							Ext.getCmp('modifyGroupCombo').setValue('Unmanaged');
							
							// Refresh the view
							this.selectGroup(Ext.getCmp('modifyGroupCombo'), this.getGroupsStore().find('name','Unmanaged'));
							
						}, this),
						failure: function() { Ext.Msg.alert('Failure', 'Error while deleting group. Please retry.'); }
					})
				}
			},
			scope: this
		})
	
	},
	addGroup: function () {
		Ext.Msg.prompt('New Group', 'Please enter group name:',
			Ext.bind(function(btn, text) {
			    if (btn == 'ok') {
					// Check to see if the group already exists
					if (this.getGroupsStore().find('name', text) == -1) {
						
						// Add the group to the Groups store
						this.getGroupsStore().add({'name':text});
						Ext.getCmp('modifyGroupCombo').setValue(text);
						this.selectGroup(Ext.getCmp('modifyGroupCombo'), this.getGroupsStore().find('name',text), true);
						
					} else {
						
						// If the group already exists in the database
						Ext.Msg.alert('Error', 'This group already exists. Please choose a different group name.');
					}
					
			        
					//var idx = this.getGroupsStore().find('name',text);
					//Ext.getCmp('modifyGroupCombo').select(this.getGroupsStore().data.items[idx]);
				}
			}, this));
	},
	saveGroup: function () {
		
		// Grab the POST values
		postParams = {
			'group'  : Ext.getCmp('modifyGroupCombo').getRawValue(),
			'desc'   : Ext.getCmp('groupDesc').getRawValue()
		};
		
		this.selectedAppStore.each(function(record) {
			postParams[record.get('package')+'('+record.get('release')+','+record.get('version')+')'] = 'on';
			/*postParams['package'] = record.get('package');
			postParams['release'] = record.get('release');
			postParams['version'] = record.get('version');*/
		}, this);

		// Make the HTTP POST request
        var conn = new Ext.data.Connection();
		conn.request({
			method: 'POST',
			url: '/uproject/uapp/add_group/',
			params: postParams,
			success: Ext.bind(function() {
				
				Ext.Msg.alert('Success', 'Group Saved Successfully.');
				var combo = Ext.getCmp('modifyGroupCombo');
				//this.getSelectedAppGrid().reconfigure(undefined);
				//this.getAvailableAppGrid().reconfigure(undefined);
				
				// Refresh the view
				/*this.getGroupsStore().addListener('load', function () {
					this.getGroupsStore().clearListeners();
					this.selectGroup(combo, this.getGroupsStore().find('name',combo.getRawValue()));
				}, this);
				this.getGroupsStore().load();*/
				
				this.getGroupsStore().findRecord('name', combo.getRawValue()).set('desc', Ext.getCmp('groupDesc').getRawValue());
				
				this.selectGroup(combo, this.getGroupsStore().find('name',combo.getRawValue()));
				
			}, this),
			failure: function() { Ext.Msg.alert('Failure', 'Error while saving changes. Please retry.'); }
		})
			
	},
	selectGroup: function (combo, records, opts) {
		var loadGroupDetails = Ext.bind(function() {
			
			//console.log(this.getApplicationsStore());
			
			this.getApplicationsStore().clearListeners();
			
			// Pull the selected Group Name from the drop-down
			var selectedGroup = combo.getRawValue();
			//console.log(this.getGroupSaveButton())
			
			// If this group is being created for the first time
			if (opts === true) {
				this.getGroupSaveButton().setText("Create Group '" + selectedGroup + "'");
			} else {
				this.getGroupSaveButton().setText("Save Group '" + selectedGroup + "'");
				this.getGroupDeleteButton().setText("Delete Group '" + selectedGroup + "'");
				this.getGroupDeleteButton().setDisabled(false);
			}
			
			// We don't want to allow deletion of the Unmanaged group
			if (selectedGroup == 'Unmanaged') {
				this.getGroupDeleteButton().setDisabled(true);
			}
			
			this.getGroupSaveButton().setDisabled(false);
			
			
			
			var updateGrids = Ext.bind(function() {
				
				this.selectedAppStore.clearListeners();
				
				// Remove the group's selected apps from the available apps store
				var removeIntersection = function (record) {
					//alert('test');
					var index = this.getApplicationsStore().findExact('name', record.get('name'));
					var selectedRecord = this.getApplicationsStore().getAt(index);
					if (selectedRecord.get('release') == record.get('release')) {
						this.getApplicationsStore().removeAt(index);
					}
				};
				
				//console.log(this.selectedAppStore);
				//console.log(this.getApplicationsStore());
				this.selectedAppStore.each(removeIntersection, this);
				this.getSelectedAppGrid().reconfigure(this.selectedAppStore);
				this.getAvailableAppGrid().reconfigure(this.getApplicationsStore());
				
				this.getEditAppField().setLoading(false);
				
			}, this);
		
			// Load the selected applications for the selected group
			this.selectedAppStore = Ext.create('Ext.data.Store', {
				model: 'Updater.model.Application',
				proxy: {
					type: 'ajax',
					url: '/uproject/uapp/getGroupApps/' + selectedGroup,
					reader: {
						type: 'json'
						//,record: 'item'
					}
				},
				autoLoad: true,
				listeners: {
					load: updateGrids
				}
			});
		}, this);
		
		// Load the available applications		
		Ext.getCmp('groupDesc').setRawValue(this.getGroupsStore().findRecord('name', combo.getRawValue()).get('desc'));
		
		this.getApplicationsStore().addListener('load', loadGroupDetails, this);
		this.getEditAppField().setLoading(true);
		this.getEditAppField().setDisabled(false);
		
		this.getApplicationsStore().load();

	}

});

