Ext.define('Updater.view.application.Window', {
	extend: 'Ext.Panel',
	alias: 'widget.applicationwindow',
	id : 'applicationWindow',
	bodyStyle: 'background-color:#dfe8f5;',
    requires: ['Ext.ux.PreviewPlugin', 'Ext.toolbar.Toolbar',
				'Ext.toolbar.TextItem',
	        	'Ext.form.field.Checkbox',
	        	'Ext.form.field.Text',
	        	'Ext.ux.statusbar.StatusBar',
				'Ext.ux.RowExpander',
				'Ext.grid.feature.RowWrap',
				'Ext.ux.statusbar.StatusBar'],
	layout       : {
        type: 'vbox',
        align: 'stretch'
    },
	
	initComponent: function() {
		
		var selectApp = {
            xtype:'fieldset',
			//flex: 1,
			height: 125,
            title: 'Select an Application to Modify',
            collapsible: false,
            defaultType: 'textfield',
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
            items :[{
					xtype: 'container',
					layout: {
						type: 'hbox',
						align: 'stretch'
					},
					height: 22,
					items: [{
									xtype: 'combobox',
					                fieldLabel: 'Name',
									forceSelection: true,
									//id: 'modifyGroupCombo',
									//width: 10,
									editable: false,
									store: Ext.create('Ext.data.Store', {
									    		model: 'Updater.model.Application',
												proxy: {
													type: 'ajax',
													url: '/uproject/uapp/listAppNames',
													reader: {
														type: 'json'
													}
												},
												autoLoad: false
									}),
									queryMode: 'local',
									displayField: 'name',
									valueField: 'name',
									flex: 1,
									listConfig: {
										loadMask: false
									}
				        	},{
									xtype: 'button',
									id: 'addAppButton',
									text: '<b>+</b>',
									width: 20,
									padding: '0 0 0 0',
									margin: '0 0 0 2'
							}],
					margin: '5 0 5 0'
			},{
					xtype: 'container',
					id: 'releaseContainer',
					layout: {
						type: 'hbox',
						align: 'stretch'
					},
					height: 22,
					disabled: true,
					//flex: 1,
					items: [{
									xtype: 'combobox',
					                fieldLabel: 'Release',
									forceSelection: true,
									//id: 'modifyGroupCombo',
									//width: 10,
									editable: false,
									store: Ext.create('Ext.data.Store', {
									    		//model: 'Updater.model.Application',
												fields: [{name: 'release', type: 'string'}],
												proxy: {
													type: 'ajax',
													url: '',
													reader: {
														type: 'json'
													}
												},
												autoLoad: false
									}),
									queryMode: 'local',
									displayField: 'release',
									valueField: 'release',
								//	padding: '10 0 10 0',
									flex: 1
				        	},{
									xtype: 'button',
									id: 'addReleaseButton',
									text: '<b>+</b>',
									width: 20,
									padding: '0 0 0 0',
									margin: '0 0 0 2'
							}],
							margin: '0 0 5 0'
			},{
					xtype: 'container',
					id: 'versionContainer',
					layout: {
						type: 'hbox',
						align: 'stretch'
					},
					height: 22,
					disabled: true,
					//flex: 1,
					items: [{
									xtype: 'combobox',
					                fieldLabel: 'Version',
									forceSelection: true,
									//id: 'modifyGroupCombo',
									//width: 10,
									editable: false,
									store: Ext.create('Ext.data.Store', {
									    		//model: 'Updater.model.Application',
												fields: [{name: 'version', type: 'string'}],
												proxy: {
													type: 'ajax',
													url: '',
													reader: {
														type: 'json'
													}
												},
												autoLoad: false
									}),
									queryMode: 'local',
									displayField: 'version',
									valueField: 'version',
								//	padding: '10 0 10 0',
									flex: 1
				        	},{
									xtype: 'button',
									id: 'addVersionButton',
									text: '<b>+</b>',
									width: 20,
									padding: '0 0 0 0',
									margin: '0 0 0 2'
							}],
							margin: '0 0 5 0'
			}]
		};
		
		var columns = [{
			header: 'Name', flex: 1, dataIndex: 'name'
		},{
			header: 'Description', flex: 2, dataIndex: 'desc', tdCls:'wrap-text'
		}];
		
		// declare the source Grid
	    var firstGrid = Ext.create('Ext.grid.Panel', {
	        multiSelect: true,
			id: 'firstGroupGrid',
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
	        store            : Ext.create('Ext.data.Store', {
									model: 'Updater.model.Group',
									proxy: {
										type: 'ajax',
										url: '/uproject/uapp/listGroups',
										reader: {
											type: 'json'
										}
									},
									autoLoad: false
			}),
	        columns          : columns,
	        stripeRows       : true,
	        title            : 'Available Groups',
	        margins          : '0 2 0 0',
			bbar: Ext.create('Ext.ux.StatusBar', {
			    defaultText: ''
			})
	    });

	    // create the destination Grid
	    var secondGrid = Ext.create('Ext.grid.Panel', {
			multiSelect: true,
			id: 'secondGroupGrid',
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
	        store            : Ext.create('Ext.data.Store', {
									model: 'Updater.model.Group',
									proxy: {
										type: 'ajax',
										url: '/uproject/uapp/getAppGroups/',
										reader: {
											type: 'json'
										}
									},
									autoLoad: false
			}),
	        columns          : columns,
	        stripeRows       : true,
	        title            : 'Selected Groups',
	        margins          : '0 0 0 3',
			bbar: Ext.create('Ext.ux.StatusBar', {
			    defaultText: '',
				name: 'secondBar'
			})
	    });

	    //Simple 'border layout' panel to house both grids
	    var displayPanel = Ext.create('Ext.Panel', {
			//height: 240,
			bodyStyle: 'background-color:#dfe8f5;',
			flex: 1,
			//id: 'appDisplayPanel',
			//frame: true,
			//disabled: true,
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
			margin: '0 0 14 0'
	    });
	
		var appProperties = {
            xtype:'fieldset',
			flex: 1,
			disabled: true,
            title: 'Edit Application Properties',
            collapsible: false,
            defaultType: 'textfield',
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
           /* defaults: {
                anchor: '30%'
            },*/
            items :[/*{
					xtype: 'container',
					layout: {
						type: 'hbox',
						align: 'stretch'
					},
					height: 28,
					items: [{
									xtype: 'textfield',
									fieldLabel: 'Name',
									disabled: true,
									flex: 1
				        	},{
									xtype: 'container',
									width: 20
							},{
									xtype: 'textfield',
									fieldLabel: 'Release',
									flex: 1
				        	}],
					margin: '5 0 5 0'
			},*/{
					xtype: 'container',
					layout: {
						type: 'hbox',
						align: 'stretch'
					},
					height: 28,
					items: [/*{
									xtype: 'textfield',
									fieldLabel: 'Version',
									flex: 1
				        	},{
									xtype: 'container',
									width: 20
							},*/{
									xtype: 'textfield',
									fieldLabel: 'Package',
									flex: 1
				        	}],
					margin: '5 0 0 0'
			},{
					xtype: 'container',
					layout: {
						type: 'hbox',
						align: 'stretch'
					},
					height: 28,
					items: [/*{
									xtype: 'fileuploadfield',
									id: 'apkUpload',
									fieldLabel: 'APK',
									buttonText: 'Select File...',
									flex: 1
				        	}*/{
									xtype: 'textfield',
									fieldLabel: 'URL',
									flex: 1
								}],
					margin: '5 0 5 0'
			},{
					xtype: 'container',
					layout: {
						type: 'hbox',
						align: 'stretch'
					},
					height: 22,
					//flex: 1,
					items: [{
									xtype: 'combobox',
					                fieldLabel: 'Action',
									forceSelection: true,
									//id: 'modifyGroupCombo',
									//width: 10,
									editable: false,
									store: Ext.create('Ext.data.Store', {
										    fields: [{name: 'action', type: 'string'}],
											data: [{'action': 'Update'}, {'action': 'Clean'}]
										}),
									queryMode: 'local',
									displayField: 'action',
									valueField: 'action',
								//	padding: '10 0 10 0',
									flex: 1
				        	},{
									xtype: 'container',
									width: 20
							},{
									xtype: 'container',
									flex: 1,
									items: [{
											xtype: 'checkboxfield',
											boxLabel: 'Active',
											checked: true,
											disabled: true
									}]
							}],
							margin: '0 0 8 0'
			}, displayPanel]
		};
		
		var details = Ext.create('Ext.form.Panel', {
		        frame: true,
		        bodyStyle:'padding:5px 5px 0',
		        flex: 1,
				layout       : {
		            type: 'vbox',
		            align: 'stretch'
		        },
		        fieldDefaults: {
		            msgTarget: 'side',
		            labelWidth: 65
		        },
		        /*defaults: {
		            anchor: '100%'
		        },*/
				bodyStyle: 'background-color:#dfe8f5;',
		        items: [selectApp, appProperties],
				buttons: [{
					text: 'Delete Version',
					id: 'appDeleteButton',
					disabled: true
				},{
				    text: 'Save Version',
					id: 'appSaveButton',
					disabled: true
				}]
		});
		
		Ext.apply(this, {
			items: [details]
		});

		this.callParent(arguments);
	}
});

