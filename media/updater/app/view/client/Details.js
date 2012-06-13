Ext.define('Updater.view.client.Details', {
	extend: 'Ext.window.Window',
	alias: 'widget.clientdetails',
	appstore: undefined,
	groupstore: undefined,
	imei: undefined,
	group: undefined,
	selectedapps: undefined,
	inheritedapps: undefined,
	tagStore: undefined,
	clientstore: undefined,
	readOnlyIMEI: true,
	onGroupChange: undefined,
	phone_tags: undefined,
	clientlogs: undefined,
	//beforeGroupChange: undefined,
	requires: ['Updater.view.client.AppSelector',
				'Ext.form.Panel',
				'Ext.form.FieldSet',
				'Ext.form.TextField',
				'Ext.data.Connection',
				'Ext.grid.Panel'
				],
	height: 500,
	width: 800,
	resizable: true,
	//layout: 'fit',
	//minimizable: true,
    /*requires: [
        'Updater.view.client.Grid'
    ],*/

	//closable: false,
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	removeInheritedApps: function () {
		var removeInherited = function (record) {
			var removeName = record.get('name');

			this.appstore.each(function(record) {
				if (record.get('name') == removeName) {
					//console.log('removing ' + removeName + ' from appStore');
					this.appstore.remove(record);
				}
			}, this);
			
			this.selectedapps.each(function(record) {
				if (record.get('name') == removeName) {
					//console.log('removing ' + removeName + ' from selectedApps');
					this.selectedapps.remove(record);
				}
			}, this);
		};
		
		this.inheritedapps.each(removeInherited, this);
	},
	removeIntersection: function () {
		var removeIntersection = function (record) {
			var index = this.appstore.findExact('name', record.get('name'));
			var selectedRecord = this.appstore.getAt(index);
			if (selectedRecord.get('release') == record.get('release')) {
				this.appstore.removeAt(index);
			}
		};
		
		this.selectedapps.each(removeIntersection, this);
	},
	initComponent: function() {

		var columns = [{
			header: 'Name', flex: 1, dataIndex: 'name'
		},{
			header: 'Release', flex: 1, dataIndex: 'release'
		},{
			header: 'Version', flex: 1, dataIndex: 'version'
		}];

		this.removeInheritedApps();
		
		this.removeIntersection();
		
		// declare the source Grid
	    var firstGrid = Ext.create('Ext.grid.Panel', {
	        multiSelect: true,
	        viewConfig: {
	            plugins: {
	                ptype: 'gridviewdragdrop',
	                dragGroup: 'firstGridDDGroup',
	                dropGroup: 'secondGridDDGroup'
	            },
	            listeners: {
	                drop: function(node, data, dropRec, dropPosition) {
	                    //var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty view';
	                    //Ext.example.msg("Drag from right to left", 'Dropped ' + data.records[0].get('name') + dropOn);
	                }
	            },
				loadMask: false
	        },
	        store            : this.appstore,
	        columns          : columns,
	        stripeRows       : true,
	        title            : 'Available User Applications',
	        margins          : '0 2 0 0'
	    });

	    // create the destination Grid
	    var secondGrid = Ext.create('Ext.grid.Panel', {
			multiSelect: true,
	        viewConfig: {
	            plugins: {
	                ptype: 'gridviewdragdrop',
	                dragGroup: 'secondGridDDGroup',
	                dropGroup: 'firstGridDDGroup'
	            },
	            listeners: {
	                drop: function(node, data, dropRec, dropPosition) {
	                    //var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty view';
	                    //Ext.example.msg("Drag from left to right", 'Dropped ' + data.records[0].get('name') + dropOn);
	                }
	            },
				loadMask: false
	        },
	        store            : this.selectedapps,
	        columns          : columns,
	        stripeRows       : true,
	        title            : 'Selected User Applications',
	        margins          : '0 0 0 3'
	    });

	    //Simple 'border layout' panel to house both grids
	    var displayPanel2 = Ext.create('Ext.Panel', {
			bodyStyle: 'background-color:#dfe8f5;',
			//height: 240,
			flex: 2,
			frame: false,
			border: false,
	        layout       : {
	            type: 'hbox',
	            align: 'stretch'
	        },
	        defaults     : { flex : 1 }, //auto stretch
	        items        : [
	            firstGrid,
	            secondGrid
	        ],
			margin: '4 0 0 0'
	    });
	
		var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit: 2
		});
		
		this.tagStore = Ext.create('Ext.data.Store', {
		    model: 'Updater.model.Tag',
			proxy: {
				type: 'ajax',
				/*noCache: false,
				extraParams: undefined,
				limitParam: undefined,
				pageParam: undefined,
				groupParam: undefined,
				sortParam: undefined,
				startParam: undefined,
				feedParam: undefined,*/
				/*actionMethods: {
					create: 'POST',
					read: 'POST',
					update: 'POST',
					destroy: 'POST'
				},*/
				url: '/uproject/uapp/getClientTags/'+this.imei,
				reader: {
					type: 'json'
					//,record: 'item'
				}
			},
			autoLoad: true
		});
		
		var columns2 = [{
			header: 'Key',
			dataIndex: 'key',
			flex: 1,
			editor: 'textfield'
		},{
			header: 'Value',
			dataIndex: 'value',
			flex: 1,
			editor: 'textfield'
		}];
		
		var displayPanel1 = Ext.create('Ext.Panel', {
			bodyStyle: 'background-color:#dfe8f5;',
			//height: 240,
			flex: 2,
			frame: false,
			border: false,
	        layout       : {
	            type: 'hbox',
	            align: 'stretch'
	        },
	        defaults     : { flex : 1 }, //auto stretch
	        items : [{
				xtype: 'gridpanel',
				flex: 1,
				columns: columns,
				disableSelection: true,
				store  : this.inheritedapps,
		        columns          : columns,
		        stripeRows       : true,
		        title            : 'Group Applications',
		       	margin: '0 0 0 0'
			},{
				xtype: 'gridpanel',
				title: 'Manual Tags',
				store: this.tagStore,
				columns: columns2,
				selModel:{
					selType: 'cellmodel'
				},
				plugins: [cellEditing],
				flex: 1,
				viewConfig: {
					loadMask: false	
				},
				margin: '0 0 0 3',
				bbar: ['->',{
					text: 'Add Tag',
					iconCls: 'ui-icon-add-user',
					handler: Ext.bind(function() {
					    // Create a record instance through the ModelManager
					    var r = Ext.ModelManager.create({
					        key: '',
					        value: '',
					    }, 'Updater.model.Tag');
					    this.tagStore.insert(0, r);
					    cellEditing.startEditByPosition({
					        row: 0,
					        column: 0
					    });
					}, this)
				},{
					text: 'Remove Tag',
					iconCls: 'ui-icon-delete-user',
					handler: Ext.bind(function() {
						var grid = this.down('gridpanel[title="Manual Tags"]');
						var row = grid.getSelectionModel().getCurrentPosition().row;
						
						grid.getStore().removeAt(row);
					}, this)
				}]
			}],
			margin: '0 0 0 0'
	    });
	
		var details = Ext.create('Ext.form.Panel', {
		        //url:'save-form.php',
		        frame: false,
				border: false,
		        bodyStyle:'padding:5px 5px 0; background-color:#dfe8f5;',
		        flex: 1,
		        fieldDefaults: {
		            msgTarget: 'side',
		            labelWidth: 75
		        },
				layout       : {
		            type: 'vbox',
		            align: 'stretch'
		        },

		        items: [{
		            xtype:'fieldset',
		            title: 'Details',
		            collapsible: false,
		            defaultType: 'textfield',
		            layout: 'anchor',
		            defaults: {
		                anchor: '100%',
						labelWidth: 80
		            },
		            items :[{
		                fieldLabel: 'IMEI',
						readOnly: this.readOnlyIMEI,
		                value: this.imei
		            },{
						xtype: 'combobox',
		                fieldLabel: 'Group',
						forceSelection: true,
						editable: false,
						store: this.groupstore,
						queryMode: 'local',
						displayField: 'name',
						valueField: 'name',
						listeners: {
							'select': this.onGroupChange,
							//'beforeselect': this.beforeGroupChange,
							scope: this
						}
		            },{
						xtype: 'displayfield',
						fieldLabel: 'Phone Tags',
						readOnly: true,
						value: this.phone_tags
					},{
						xtype: 'checkboxfield',
						boxLabel: 'Lock Inventory Information',
						checked: this.locked_inventory
					},{
						xtype: 'container',
						margin: '0 0 0 0',
						padding: '0 0 0 0',
						layout: {
							type: 'hbox',
							align: 'stretch'
						},
						defaults: {
							labelWidth: 80
						},
						height: 22,
						items: [{
							xtype: 'textfield',
							fieldLabel: 'SIM ID',
							value: this.simid,
							margin: '0 0 0 0',
							flex: 1
						},{
							xtype: 'textfield',
							fieldLabel: 'Phone #',
							value: this.phone,
							margin: '0 0 0 10',
							flex: 1
						},{
							xtype: 'textfield',
							fieldLabel: 'Asset Tag',
							value: this.assettag,
							margin: '0 0 0 10',
							flex: 1
						}]
					},{
						xtype: 'gridpanel',
						store: this.clientlogs,
						columns: [{
							header: 'Package',
							dataIndex: 'package',
							flex: 1,
							editor: 'textfield'
						},{
							header: 'Version',
							dataIndex: 'version',
							flex: 1,
							editor: 'textfield'
						}],
						title: 'Logged Applications',
						disableSelection: true,
						//collapsible: true,
						//collapsed: true,
						stripeRows: true,
						height: 134,
						margin: '5 0 5 0'
					}	/*{
							xtype: 'dataview',
							fieldLabel: 'Logged Apps',
							store: this.clientlogs,
							tpl: new Ext.XTemplate(
								'Logged Apps:',
								'<table>',
									'<tpl for=".">',
										'<tr>',
											'<td>{package}</td>',
											'<td>{version}</td>',
										'</tr>',
									'</tpl>',
								'</table'
							),
							itemSelector: 'div.logged-app',
							height: 100
						}*/]
		        },displayPanel1, displayPanel2],
				buttons: [{
				    text: 'Save',
				    handler: Ext.bind(function() {
					
						// Grab the POST values from the details window
						postParams = {
							'user_imei'  : this.down('textfield[fieldLabel="IMEI"]').value,
							'user_group' : this.down('combobox').getRawValue(),
							'sim_id' : this.down('textfield[fieldLabel="SIM ID"]').value,
							'phone' : this.down('textfield[fieldLabel="Phone #"]').value,
							'asset_tag' : this.down('textfield[fieldLabel="Asset Tag"]').value,
							'locked_inventory' : this.down('checkboxfield').getValue() ? 'True' : 'False'
						};
						
						this.selectedapps.each(function(record) {
							postParams[record.get('package')+'('+record.get('release')+','+record.get('version')+')'] = 'on';
						}, this);
						
						var tags = [];
						this.tagStore.each(function(record) {
							var key = record.get('key');
							var value = record.get('value');
							
							if (key != '' && value != '') {
								tags.push({
									key: key,
									value: value
								});
							}
						}, this);
						
						postParams['manual_tags'] = Ext.JSON.encode(tags);
						
						
						// Make the HTTP POST request
				        var conn = new Ext.data.Connection();
						conn.request({
							method: 'POST',
							url: '/uproject/uapp/add_user/',
							params: postParams,
							success: Ext.bind(function() {
								// Close the client details window
								this.close();
								
								//var scrollPos = Ext.getCmp('clientGrid').getEl().down('.x-grid-view').getScroll();
								//Ext.getCmp('clientGrid').invalidateScroller();
								// Refresh the Clients section to show the update
								
								//if (this.readOnlyIMEI == false) {
									//Ext.getCmp('clientGrid').determineScrollbars();
								//}
								this.clientstore.load();
								//Ext.getCmp('clientGrid').invalidateScroller();
								
								
								//Ext.getCmp('clientGrid').getEl().down('.x-grid-view').scrollTo('top', scroll)
							}, this),
							failure: function() { Ext.Msg.alert('Status', 'Error while saving changes. Please retry.'); }
						})
				    }, this)
				},{
				    text: 'Cancel',
				    handler: Ext.bind(function() { this.close(); }, this)
				}/*,{
				    text: 'Save',
				    handler: function() {
				        if (isForm.getForm().isValid()) {
				            Ext.Msg.alert('Submitted Values', 'The following will be sent to the server: <br />' +
				            isForm.getForm().getValues(true));
				        }
				    }
				}*/]
		});

		Ext.apply(this, {
			items: [details]
		});

		this.callParent(arguments);
	}
});