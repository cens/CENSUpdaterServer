/*
        Filename: Clients.js
          Author: William Wu
            Date: April 2012
     Description: This class serves as the controller for the client views.
				  It handles all the logic behind the main Clients section
				  of Updater. It populates the Clients grid, handles click
				  events when editing client details, dynamically loads
				  client data, shows the "Edit Client Details" window,
				  and more.
*/
Ext.define('Updater.controller.Clients', {
    extend: 'Ext.app.Controller',
	requires: ['Updater.view.client.Details',
				'Updater.view.client.Edit',
				'Updater.view.client.Search',
				'Ext.grid.plugin.CellEditing',
			   'Updater.view.group.Show',
				'Ext.data.Connection',
				'Ext.button.Button'],
    stores: ['Clients', 'Applications', 'Groups'],
    models: ['Client', 'Application', 'Group', 'Tag', 'Log', 'Conflict'],
    views: ['client.Grid'],
    refs: [{
        ref: 'clientShow',
        selector: 'clientshow'
    }, {
    	ref: 'viewer',
    	selector: 'viewer'
    }, {
    	ref: 'clientPreview',
    	selector: 'clientpreview'
    }, {
		ref: 'clientGrid',
		selector: 'clientgrid'
	}],
    init: function() {
        this.control({
            'clientgrid > tableview': {
                itemdblclick: this.showClientDetails,
            },
			'#addClient': {
				click: this.showAddClient
			},
			'#deleteSelected': {
				click: this.deleteSelectedClients
			},
			'#editSelected': {
				click: this.editSelectedClients
			},
			'#basicSearchButton': {
				click: this.performBasicSearch
			},
			'#basicSearchQuery': {
				// Listens for when the return key is pressed
				// after the user inputs text into the basic
				// search field.
				specialkey: Ext.bind(function(f,e) {
					if (e.getKey() == e.ENTER) {
						this.performBasicSearch();
					}
				}, this)
			},
			'#doAdvancedSearch': {
				click: this.performAdvancedSearch
			}
        });
    },
	performAdvancedSearch: function () {
		// Get references to all of the advanced search fields
		var groupField = Ext.ComponentQuery.query('#advancedSearchButton > textfield[fieldLabel="Group"]')[0];
		var clientAppField = Ext.ComponentQuery.query('#advancedSearchButton > textfield[fieldLabel="Client Apps"]')[0];
		var inheritedAppField = Ext.ComponentQuery.query('#advancedSearchButton > textfield[fieldLabel="Inherited Apps"]')[0];
		var primaryTagsField = Ext.ComponentQuery.query('#advancedSearchButton > textfield[fieldLabel="Phone Tags"]')[0];
		var secondaryTagsField = Ext.ComponentQuery.query('#advancedSearchButton > textfield[fieldLabel="Manual Tags"]')[0];
		
		// Split up the comma-separated search queries
		var clientAppParam = clientAppField.getValue().split(', ');
		var inheritedAppParam = inheritedAppField.getValue().split(', ');
		var primaryTagsParam = primaryTagsField.getValue().split(', ');
		var secondaryTagsParam = secondaryTagsField.getValue().split(', ');
	
		// Construct the HTTP POST parameters
		var postParams = {};
	
		if (groupField.isDirty()) {
			postParams['group'] = groupField.getValue();
		}
		if (clientAppField.isDirty()) {
			postParams['user_apps'] = Ext.JSON.encode(clientAppParam);
		}
		if (inheritedAppField.isDirty()) {
			postParams['group_apps'] = Ext.JSON.encode(inheritedAppParam);
		}
		if (primaryTagsField.isDirty()) {
			postParams['phone_tags'] = Ext.JSON.encode(primaryTagsParam);
		}
		if (secondaryTagsField.isDirty()) {
			postParams['manual_tags'] = Ext.JSON.encode(secondaryTagsParam);
		}
	
		// Perform the advanced search and store the results in an ExtJS
		// data store
		var advancedSearchStore = Ext.create('Ext.data.Store', {
		    model: 'Updater.model.Client',
			proxy: {
				type: 'ajax',
				groupParam: undefined,
				extraParams: postParams,
				actionMethods: {
					create: 'POST',
					read: 'POST',
					update: 'POST',
					destroy: 'POST'
				},
				url: '/uproject/uapp/listClients/',
				reader: {
					type: 'json'
				}
			},
			autoLoad: true,
			groupField: 'group',
			listeners: {
				load: Ext.bind(function () {
					var clientStore = Ext.data.StoreManager.lookup('Clients');
					clientStore.removeAll();
					var recs = advancedSearchStore.getRange();
				
					advancedSearchStore.removeAll();
					clientStore.add(recs);
					clientGrid.view.setLoading(false);
					Ext.ComponentQuery.query('#advancedSearchButton')[0].hideMenu();
				}, this)
			}
		});

		var clientGrid = Ext.ComponentQuery.query('clientgrid')[0];
		clientGrid.view.setLoading(true);

	},
	performBasicSearch: function () {
		
		var params = Ext.getCmp('basicSearchQuery').getValue().split(', ');
	
		var basicSearchStore = Ext.create('Ext.data.Store', {
		    model: 'Updater.model.Client',
			proxy: {
				type: 'ajax',
				groupParam: undefined,
				extraParams: {
					basic: Ext.JSON.encode(params)
				},
				actionMethods: {
					create: 'POST',
					read: 'POST',
					update: 'POST',
					destroy: 'POST'
				},
				url: '/uproject/uapp/listClients/',
				reader: {
					type: 'json'
				}
			},
			autoLoad: true,
			groupField: 'group',
			listeners: {
				load: Ext.bind(function () {
					
					this.getClientsStore().removeAll();
					var recs = basicSearchStore.getRange();
					basicSearchStore.removeAll();
					this.getClientsStore().add(recs);
					this.getClientGrid().view.setLoading(false);
				}, this)
			}
		});

		this.getClientGrid().view.setLoading(true);
	},
	editSelectedClients: function () {
		console.log('Editing the selected clients.');
		
		// Get the IMEIs of the selected clients in the table
		var selectedRecords = Ext.getCmp('clientGrid').getSelectionModel().getSelection();
		
		switch (selectedRecords.length) {
			case 0:
				
				// Error if no clients were selected
				Ext.Msg.show({
					title: 'Error',
					msg: 'No client(s) selected for edit.',
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.WARNING
				});
				
				break;
				
			case 1:
			
				// If only a single client is selected for edit, show the standard
				// client details window
				this.showClientDetails(null, selectedRecords[0], null);
				break;
				
			default:
			
				// If multiple clients selected, show the batch edit window
				var editClientsWindow = Ext.create('Updater.view.client.Edit', {
					selectedRecords: selectedRecords,
					//height: this.getClientShow().getHeight()-50,
					clientstore: this.getClientsStore(),
					clientshow: this.getClientShow(),
					/*addAppsStore1: Ext.create('Ext.data.Store', {
						    model: 'Updater.model.Application',
							proxy: {
								type: 'ajax',
								url: '/uproject/uapp/listApps',
								reader: {
									type: 'json'
								}
							},
							autoLoad: true
						}),
					addAppsStore2: Ext.create('Ext.data.Store', {
						    model: 'Updater.model.Application'
						}),
					removeAppsStore1: Ext.create('Ext.data.Store', {
						    model: 'Updater.model.Application'
						}),
					removeAppsStore2: Ext.create('Ext.data.Store', {
						    model: 'Updater.model.Application',
							proxy: {
								type: 'ajax',
								url: '/uproject/uapp/listApps',
								reader: {
									type: 'json'
								}
							},
							autoLoad: true
						}),*/
					groupStore: Ext.create('Ext.data.Store', {
							model: 'Updater.model.Group',
							proxy: {
								type: 'ajax',
								url: '/uproject/uapp/listGroups',
								reader: {
									type: 'json'
								}
							},
							autoLoad: true
						}),
					onSave: function () {
						
						var groupField = this.down('fieldset[title="Change Group"]');
						var groupName = groupField.down('combobox').getRawValue();
						var postParams = {};
						
						if (groupName != '') {
							postParams['group'] = groupName;
						}
						
						var selectedClients = [];
						
						for (var i = 0; i < this.selectedRecords.length; i++) {
							selectedClients.push(this.selectedRecords[i].get('imei'));
						}
						
						postParams['clients'] = Ext.JSON.encode(selectedClients);
						
						// Make the HTTP POST request
				        var conn = new Ext.data.Connection();
						conn.request({
							method: 'POST',
							url: '/uproject/uapp/batchEditClients/false',
							params: postParams,
							success: Ext.bind(function(conn, request) {
								// Close the client details window
								this.close();

								this.clientstore.addListener('load', function () {
																
									// Make a temporary client store to show the results
									/*var tempStore = Ext.create('Ext.data.Store', {
										    model: 'Updater.model.Client',
									});
										
									// Get the updated records
									for (var i = 0; i < this.selectedRecords.length; i++) {
										var record = this.clientstore.findRecord('imei', this.selectedRecords[i].get('imei'));
										tempStore.add(record.copy());
									}*/
									
									var tempStore = Ext.create('Ext.data.Store', {
										model: 'Updater.model.Conflict',
									});
									
									var decoded = Ext.JSON.decode(conn.responseText);
									
									if (decoded.length > 0) {
										for (var i = 0; i < decoded.length; i++) {
											var conflict = decoded[i];
											var model = Ext.create('Updater.model.Conflict', {
												imei: conflict.imei,
												application: conflict.application
											});
											tempStore.add(model);
										}

										var clientStore = this.clientstore;

										var resultsWindow = Ext.create('Ext.window.Window', {
											height: 400,
											width: 800,
											title: 'Proceed?',
											layout: 'fit',
											items: [{
												xtype: 'form',
												frame: true,
												layout: {
													type: 'vbox',
													align: 'stretch'
												},
												items: [{
												    xtype: 'displayfield',
												    margin: '10 5 20 5',
													fieldStyle: 'color: red',
												    value: '<b>WARNING!</b> Some conflicts were detected when attempting to change the group for the selected clients. Please review and approve the conflicts listed below. The listed user applications will be REMOVED from the clients.'
												},
												{
												    xtype: 'grid',
													disableSelection: true,
												    title: 'Detected User Application Conflicts',
												    store: tempStore,
												    columns: [{
												        text: 'IMEI',
												        dataIndex: 'imei',
												        width: 200
												    },
												    {
												        text: 'Conflicting User Application',
												        dataIndex: 'application',
												        flex: 1,
												        tdCls: 'wrap-text'
												    }],
												    flex: 1
												}],

												buttons: [{
													text: 'Proceed',
													handler: function() {
														var conn = new Ext.data.Connection();
														conn.request({
															method: 'POST',
															url: '/uproject/uapp/batchEditClients/true',
															params: postParams,
															success: Ext.bind(function(conn, request) {
																resultsWindow.close();
																clientStore.load();
															}),
															failure: function() { Ext.Msg.alert('Status', 'Error while saving changes. Please retry.'); }
														});

													}
												},{
													text: 'Cancel',
													handler: function() {
														resultsWindow.close();
													}
												}]
											}]
										});

										// Show a window with the results
										resultsWindow.show();
										resultsWindow.alignTo(this.clientshow, 'c', [-resultsWindow.width/2, -resultsWindow.height/2]);
									
									} else {	// If there are no conflicts between user applications and group applications
										
										var connx = new Ext.data.Connection();
										connx.request({
											method: 'POST',
											url: '/uproject/uapp/batchEditClients/true',
											params: postParams,
											success: Ext.bind(function(connx, request) {
												//resultsWindow.close();
												this.clientstore.load();
											}, this),
											failure: function() { Ext.Msg.alert('Status', 'Error while saving changes. Please retry.'); }
										});
									}
									

								}, this, {'single': true});
								
								Ext.getCmp('clientGrid').getStore().load();

							}, this),
							failure: function() { Ext.Msg.alert('Status', 'Error while saving changes. Please retry.'); }
						});
					}
				});
						
				editClientsWindow.title = "Edit Selected Client(s)";
				editClientsWindow.show();
				editClientsWindow.alignTo(this.getClientShow(), 'c', [-editClientsWindow.width/2, -editClientsWindow.height/2]);
					
						/**********************************************************************
						/* Commented out because this implementation can be used in the future
						/* to implement Batch Edit Clients for adding applications and
						/* removing applications. The Updater.view.client.Edit view must be
						/* modifed accordingly to support this code.
						/*********************************************************************/
						/* var groupField = this.down('fieldset[title="Change Group"]');
						var addField = this.down('fieldset[title="Add Applications"]');
						var removeField = this.down('fieldset[title="Remove Applications"]');
						
						postParams = {};
						
						if (groupField.checkboxCmp.getValue() ||
							addField.checkboxCmp.getValue() ||
							removeField.checkboxCmp.getValue()) {
								
								if (groupField.checkboxCmp.getValue()) {
									var groupName = groupField.down('combobox').getRawValue();
									if (groupName != '') {
										postParams['group'] = groupField.down('combobox').getRawValue();
									}
									
								}
								
								if (addField.checkboxCmp.getValue()) {
									var addAppsArray = [];
									this.addAppsStore2.each(function (record) {
										addAppsArray.push({'name': record.get('name'), 'release' : record.get('release')});
									}, this);
									if (addAppsArray.length > 0) {
										postParams['add_apps'] = Ext.JSON.encode(addAppsArray);
									}
								}
								
								if (removeField.checkboxCmp.getValue()) {
									var removeAppsArray = [];
									this.removeAppsStore1.each(function (record) {
										removeAppsArray.push({'name': record.get('name'), 'release' : record.get('release')});
									}, this);
									if (removeAppsArray.length > 0) {
										postParams['remove_apps'] = Ext.JSON.encode(removeAppsArray);
									}
								}
								
								var selectedClients = [];
								
								for (var i = 0; i < this.selectedRecords.length; i++) {
									selectedClients.push(this.selectedRecords[i].get('imei'));
								}
								
								postParams['clients'] = Ext.JSON.encode(selectedClients);
																
								// Make the HTTP POST request
						        var conn = new Ext.data.Connection();
								conn.request({
									method: 'POST',
									url: '/uproject/uapp/batchEditClients/',
									params: postParams,
									success: Ext.bind(function() {
										// Close the client details window
										this.close();

										this.clientstore.addListener('load', function () {
																		
											// Make a temporary client store to show the results
											var tempStore = Ext.create('Ext.data.Store', {
												    model: 'Updater.model.Client',
											});
												
											// Get the updated records
											for (var i = 0; i < this.selectedRecords.length; i++) {
												var record = this.clientstore.findRecord('imei', this.selectedRecords[i].get('imei'));
												tempStore.add(record.copy());
											}
											
											var resultsWindow = Ext.create('Ext.window.Window', {
												height: 400,
												width: 800,
												title: 'Transaction Successful',
												layout: 'fit',
												items: [{
													xtype: 'grid',
													title: 'Summary of Changes',
													store: tempStore,
													columns: [{
														text: 'IMEI',
														dataIndex: 'imei',
														width: 200
													}, {
														text: 'Applications',
														dataIndex: 'applications',
														flex: 1
													}, {
														text: 'Group',
														dataIndex: 'group',
														width: 150
													}],
													flex: 1
												}]
											});
											
											// Show a window with the results
											resultsWindow.show();
											resultsWindow.alignTo(this.clientshow, 'c', [-resultsWindow.width/2, -resultsWindow.height/2]);

										}, this, {'single': true});
										
										Ext.getCmp('clientGrid').getStore().load();

									}, this),
									failure: function() { Ext.Msg.alert('Status', 'Error while saving changes. Please retry.'); }
								});
							}
					}
				});

				editClientsWindow.title = "Edit Selected Client(s)";
				editClientsWindow.show();
				editClientsWindow.alignTo(this.getClientShow(), 'c', [-editClientsWindow.width/2, -editClientsWindow.height/2]);*/				
				break;
		}
		
		
	},
	deleteSelectedClients: function () {
		// Get the IMEIs of the selected clients in the table
		var selectedRecords = Ext.getCmp('clientGrid').getSelectionModel().getSelection();
		
		if (selectedRecords.length == 0) {
			Ext.Msg.show({
				title: 'Error',
				msg: 'No client(s) selected for deletion.',
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.WARNING
			});
		} else {
			var selectedIMEIs = [];
			var msgPrompt = 'The following clients will be deleted:<br /><br />';
			for (var i = 0; i < selectedRecords.length; i++) {
				selectedIMEIs.push(selectedRecords[i].get('imei'));
				msgPrompt += selectedRecords[i].get('imei') + '<br />';
			}
		
		
			Ext.Msg.show({
				title: 'Confirm Deletion',
				msg: msgPrompt,
				buttons: Ext.Msg.OKCANCEL,
				icon: Ext.Msg.WARNING,
				fn: function(btn, text) {
					if (btn == 'ok') {
						postParams = {
							'clients' : Ext.encode(selectedIMEIs)
						};

						// Post the data to the server
				        var conn = new Ext.data.Connection();
						conn.request({
							method: 'POST',
							url: '/uproject/uapp/deleteClients/',
							params: postParams,
							success: Ext.bind(function() {

								// Refresh the Clients section to show the update
								this.getClientsStore().load();
							
								Ext.getCmp('clientGrid').invalidateScroller();

							}, this),
							failure: function() { Ext.Msg.alert('Status', 'Error while deleting clients. Please retry.'); }
						})
					}
				},
				scope: this
			});
		}
	},
	showAddClient: function() {
		this.loadWindow = Ext.bind(function () {
			appStore.clearListeners();
			
			this.clientDataHandler = Ext.bind(function() {
				clientStore.clearListeners();
						
				var inheritedStore = Ext.create('Ext.data.Store', {
							model: 'Updater.model.Application',
							proxy: {
								type: 'ajax',
								url: '/uproject/uapp/getGroupApps/Unmanaged',
								reader: {
									type: 'json'
								}
							},
							autoLoad: true,
							listeners: {
								load: Ext.bind(function () {
									
									inheritedStore.clearListeners();
									
									var detailsWindow = Ext.create('Updater.view.client.Details', {
							    		imei: '',
									    group: '',
										appstore: appStore,
										groupstore: this.getGroupsStore(),
										selectedapps: clientStore,
										inheritedapps: inheritedStore,
										clientstore: this.getClientsStore(),
										readOnlyIMEI: false,
										onGroupChange: function () {
											var inheritedGrid = this.down('gridpanel[title="Group Applications"]');
											var firstGrid = this.down('gridpanel[title="Available User Applications"]');
											var secondGrid = this.down('gridpanel[title="Selected User Applications"]');

											var selectedGroup = this.down('combobox').getRawValue();
											var panel = this.down('panel[flex=2]');

											panel.setLoading(true);
											this.appstore.addListener('load', function () {

												// Load the selected apps for the newly selected group
												this.inheritedapps.proxy.url = '/uproject/uapp/getGroupApps/' + selectedGroup;

												this.inheritedapps.addListener('load', function () {
													
													this.removeInheritedApps();
													this.removeIntersection();
													firstGrid.reconfigure(this.appstore);
													secondGrid.reconfigure(this.selectedapps);
													panel.setLoading(false);
													
												}, this, {'single': true});

												this.inheritedapps.load();
												this.selectedapps.removeAll();
												
											}, this, {'single': true});

											this.appstore.load();

										}
									});

									detailsWindow.title = "Add Client";
									detailsWindow.down('combobox').setRawValue('Unmanaged');

									detailsWindow.show();
									detailsWindow.alignTo(this.getClientShow(), 'c', [-detailsWindow.width/2, -detailsWindow.height/2]);
									
								}, this)
							}
				});
									
				inheritedStore.load();
				
			}, this);
			
			// Initialize the client data store to grab client details from server
			var clientStore = Ext.create('Ext.data.Store', {
				model: 'Updater.model.Application'
			});
			
			this.clientDataHandler();
			
		}, this);
		
		var appStore = Ext.create('Ext.data.Store', {
		    model: 'Updater.model.Application',
			proxy: {
				type: 'ajax',
				url: '/uproject/uapp/listApps',
				reader: {
					type: 'json'
				}
			},
			autoLoad: false
		});
				
		appStore.addListener('load', this.loadWindow, this);
		appStore.load();
	},
    showClientDetails: function(view, client, preventAdd) {
		this.loadWindow = Ext.bind(function () {
			appStore.clearListeners();
			
			this.clientDataHandler = Ext.bind(function() {
				clientStore.clearListeners();
				var clientLogs = Ext.create('Ext.data.Store', {
					model: 'Updater.model.Log',
					proxy: {
						type: 'ajax',
						url: '/uproject/uapp/getClientLogs/' + client.get('imei'),
						reader: {
							type: 'json'
							//,record: 'item'
						}
					},
					autoLoad: false
				
				});
				
				var inheritedStore = Ext.create('Ext.data.Store', {
							model: 'Updater.model.Application',
							proxy: {
								type: 'ajax',
								url: '/uproject/uapp/getGroupApps/' + client.get('group'),
								reader: {
									type: 'json'
								}
							},
							autoLoad: true,
							listeners: {
								load: Ext.bind(function () {
									inheritedStore.clearListeners();
									var detailsWindow = Ext.create('Updater.view.client.Details', {
							    		imei: client.get('imei'),
									    group: client.get('group'),
										assettag: client.get('asset_tag'),
										phone: client.get('phone'),
										simid: client.get('sim_id'),
										locked_inventory: client.get('locked_inventory') == 'True' ? true : false,
										height: this.getClientShow().getHeight()-50,
										appstore: appStore,
										groupstore: this.getGroupsStore(),
										selectedapps: clientStore,
										inheritedapps: inheritedStore,
										clientstore: this.getClientsStore(),
										readOnlyIMEI: true,
										clientlogs: clientLogs,
										phone_tags: client.get('phone_tags'),
										onGroupChange: function () {
											var inheritedGrid = this.down('gridpanel[title="Group Applications"]');
											var firstGrid = this.down('gridpanel[title="Available User Applications"]');
											var secondGrid = this.down('gridpanel[title="Selected User Applications"]');
											
											var selectedGroup = this.down('combobox').getRawValue();
											var panel = this.down('panel[flex=2]');

											panel.setLoading(true);
											this.appstore.addListener('load', function () {
												
												this.selectedapps.proxy.url = '/uproject/uapp/getClientApps/' + client.get('imei');

												this.selectedapps.addListener('load', function () {
													
													this.inheritedapps.proxy.url = '/uproject/uapp/getGroupApps/' + selectedGroup;
													
													this.inheritedapps.addListener('load', function () {
														
														this.removeInheritedApps();
														this.removeIntersection();
														inheritedGrid.reconfigure(this.inheritedapps);
														firstGrid.reconfigure(this.appstore);
														secondGrid.reconfigure(this.selectedapps);
														panel.setLoading(false);
														
													}, this, {'single': true});
													
													this.inheritedapps.load();
													
												}, this, {'single': true})

												this.selectedapps.load();

											}, this, {'single': true});

											this.appstore.load();

										}
									});
									
									clientLogs.addListener('load', function () {
										var rec = clientLogs.first();
										if (rec != undefined) {

											var grid = detailsWindow.down('gridpanel[title="Logged Applications"]');
											grid.setTitle('Logged Applications from ' + rec.get('time'));
										}
									}, this, {'single': true});

									clientLogs.load();
										
									detailsWindow.title = "Client";
									detailsWindow.down('combobox').setRawValue(client.get('group'));

									detailsWindow.show();
									detailsWindow.alignTo(this.getClientShow(), 'c', [-detailsWindow.width/2, -detailsWindow.height/2]);
								}, this)
							}
				});	

			}, this);

			// Initialize the client data store to grab client details from server
			var clientStore = Ext.create('Ext.data.Store', {
				model: 'Updater.model.Application',
				proxy: {
					type: 'ajax',
					url: '/uproject/uapp/getClientApps/' + client.get('imei'),
					reader: {
						type: 'json'
						//,record: 'item'
					}
				},
				autoLoad: true,
				listeners: {
					load: this.clientDataHandler 
				}
			});
			
		}, this);
		
		var appStore = Ext.create('Ext.data.Store', {
		    model: 'Updater.model.Application',
			proxy: {
				type: 'ajax',
				url: '/uproject/uapp/listApps',
				reader: {
					type: 'json'
				}
			},
			autoLoad: false
		});
		
		appStore.addListener('load', this.loadWindow, this, {'single': true});
		appStore.load();	
    }
});

