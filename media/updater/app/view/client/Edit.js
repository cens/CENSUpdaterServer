Ext.define('Updater.view.client.Edit', {
	extend: 'Ext.window.Window',
	alias: 'widget.clientedit',
	selectedRecords: undefined,
	requires: ['Updater.view.client.AppSelector',
				'Ext.form.Panel',
				'Ext.form.FieldSet',
				'Ext.form.TextField',
				'Ext.data.Connection',
				'Ext.grid.Panel'],
	height: 130,
	width: 400,
	groupStore: undefined,
	addAppsStore1: undefined,
	addAppsStore2: undefined,
	removeAppsStore1: undefined,
	removeAppsStore2: undefined,
	clientstore: undefined,
	clientshow: undefined,
	onSave: undefined,
	//autoScroll: true,
	resizable: false,
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
	initComponent: function() {
		
		var columns = [{
			header: 'Name', flex: 1, dataIndex: 'name'
		},{
			header: 'Release', flex: 1, dataIndex: 'release'
		},{
			header: 'Version', flex: 1, dataIndex: 'version'
		}];
		
		// declare the source Grid
	    var firstAddAppGrid = Ext.create('Ext.grid.Panel', {
	        multiSelect: true,
	        viewConfig: {
				/*getRowClass: function(record) {
				    if (record.get('deleted')) {
				        return 'strike-through-row';
				    }
				},*/
	            plugins: {
	                ptype: 'gridviewdragdrop',
	                dragGroup: 'firstAddGridDDGroup',
	                dropGroup: 'secondAddGridDDGroup'
	            },
				loadMask: false
	        },
	        store            : this.addAppsStore1,
	        columns          : columns,
	        stripeRows       : true,
	        title            : 'Available Applications',
	        margins          : '0 2 0 0'
	    });

	    // create the destination Grid
	    var secondAddAppGrid = Ext.create('Ext.grid.Panel', {
			multiSelect: true,
	        viewConfig: {
	            plugins: {
	                ptype: 'gridviewdragdrop',
	                dragGroup: 'secondAddGridDDGroup',
	                dropGroup: 'firstAddGridDDGroup'
	            },
				loadMask: false
	        },
	        store            : this.addAppsStore2,
	        columns          : columns,
	        stripeRows       : true,
	        title            : 'Applications to Add',
	        margins          : '0 0 0 3'
	    });

	    //Simple 'border layout' panel to house both grids
	    var addAppsPanel = Ext.create('Ext.Panel', {
			//height: 240,
			bodyStyle: 'background-color:#dfe8f5;',
			flex: 1,
			//height: 500
			//id: 'appDisplayPanel',
			//frame: true,
			disabled: false,
	        border: false,
			layout: {
			    type: 'hbox',
			    align: 'stretch'
			},
			defaults: {
			    flex: 1
			},
			//auto stretch
			items: [
				firstAddAppGrid,
				secondAddAppGrid
			],
			margin: '4 0 14 0'
	    });
	
		// declare the source Grid
	    var firstRemoveAppGrid = Ext.create('Ext.grid.Panel', {
	        multiSelect: true,
			//id: 'availableAppGrid',
	        viewConfig: {
	            plugins: {
	                ptype: 'gridviewdragdrop',
	                dragGroup: 'firstRemoveGridDDGroup',
	                dropGroup: 'secondRemoveGridDDGroup'
	            },
	            listeners: {
	                drop: function(node, data, dropRec, dropPosition) {
	                    //var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty view';
	                    //Ext.example.msg("Drag from right to left", 'Dropped ' + data.records[0].get('name') + dropOn);
	                }
	            },
				loadMask: false
	        },
	        store            : this.removeAppsStore1,
	        columns          : columns,
	        stripeRows       : true,
	        title            : 'Applications to Remove',
	        margins          : '0 2 0 0'
	    });

	    // create the destination Grid
	    var secondRemoveAppGrid = Ext.create('Ext.grid.Panel', {
			multiSelect: true,
			//id: 'selectedAppGrid',
	        viewConfig: {
	            plugins: {
	                ptype: 'gridviewdragdrop',
	                dragGroup: 'secondRemoveGridDDGroup',
	                dropGroup: 'firstRemoveGridDDGroup'
	            },
	            listeners: {
	                drop: function(node, data, dropRec, dropPosition) {
	                    //var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty view';
	                    //Ext.example.msg("Drag from left to right", 'Dropped ' + data.records[0].get('name') + dropOn);
	                }
	            },
				loadMask: false
	        },
	        store            : this.removeAppsStore2,
	        columns          : columns,
	        stripeRows       : true,
	        title            : 'Installed Applications',
	        margins          : '0 0 0 3'
	    });

	    //Simple 'border layout' panel to house both grids
	    var removeAppsPanel = Ext.create('Ext.Panel', {
			//height: 240,
			bodyStyle: 'background-color:#dfe8f5;',
			flex: 1,
			//id: 'appDisplayPanel',
			//frame: true,
			disabled: false,
	        border: false,
			layout: {
			    type: 'hbox',
			    align: 'stretch'
			},
			defaults: {
			    flex: 1
			},
			//auto stretch
			items: [
				firstRemoveAppGrid,
				secondRemoveAppGrid
			],
			margin: '4 0 14 0'
	    });
		
		var details = Ext.create('Ext.form.Panel', {
		        //url:'save-form.php',
		        frame:true,
		        bodyStyle:'padding:5px 5px 0',
		        flex: 1,
				//height: 700,
				//autoScroll: true,
		        fieldDefaults: {
		            msgTarget: 'side',
		            labelWidth: 100
		        },
		        layout       : {
		            type: 'vbox',
		            align: 'stretch'
		        },

		        items: [{
			            xtype:'fieldset',
						//checkboxToggle: true,
						collapsed: false,
			            title: 'Change Group',
			            collapsible: false,
			            defaultType: 'textfield',
						height: 47,
						layout       : {
				            type: 'vbox',
				            align: 'stretch'
				        },
			            items :[{
							xtype: 'combobox',
							forceSelection: true,
							editable: false,
							flex: 1,
							store: this.groupStore,
							queryMode: 'local',
							displayField: 'name',
							valueField: 'name',
			            }]
			}/*,{
		            xtype:'fieldset',
					checkboxToggle: true,
					collapsed: false,
		            title: 'Add Applications',
		            collapsible: false,
		            defaultType: 'textfield',
					flex: 1,
					layout       : {
			            type: 'vbox',
			            align: 'stretch'
			        },
		            items :[addAppsPanel]
		        },{
			            xtype:'fieldset',
						checkboxToggle: true,
						collapsed: false,
			            title: 'Remove Applications',
			            collapsible: false,
			            defaultType: 'textfield',
						flex: 1,
						layout       : {
				            type: 'vbox',
				            align: 'stretch'
				        },
			            items :[removeAppsPanel]
			        }*/],
				buttons: [{
				    text: 'Save',
				    handler: this.onSave,
					scope: this
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