/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
		
Ext.define('Updater.view.group.Window', {
	extend: 'Ext.Panel',
	alias: 'widget.groupwindow',
	id : 'groupWindow',
	bodyStyle: 'background-color:#dfe8f5;',
//	cls: 'feed-grid',

    requires: ['Ext.ux.PreviewPlugin', 'Ext.toolbar.Toolbar',
				'Ext.toolbar.TextItem',
	        	'Ext.form.field.Checkbox',
	        	'Ext.form.field.Text',
	        	'Ext.ux.statusbar.StatusBar',
				'Ext.ux.RowExpander',
				'Ext.ux.grid.FiltersFeature'],
    
    //border: true,
	//frame:true,
	layout       : {
        type: 'vbox',
        align: 'stretch'
    },
	//layout: 'fit',
	//features: [],
	initComponent: function() {
		var filters = {
			ftype: 'filters',
			encode: true,
			local: true,
			filters: [{
				type: 'string',
				dataIndex: 'name'
			}]
		}
		
		var columns = [{
			header: 'Name',
			flex: 1,
			dataIndex: 'name'
		},{
			header: 'Release', flex: 1, dataIndex: 'release'
		},{
			header: 'Version', flex: 1, dataIndex: 'version'
		}];
		
		// declare the source Grid
	    var firstGrid = Ext.create('Ext.grid.Panel', {
	        multiSelect: true,
			id: 'availableAppGrid',
			features: [filters],
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
	        store            : undefined,
	        columns          : columns,
	        stripeRows       : true,
	        title            : 'Available Applications',
	        margins          : '0 2 0 0'
	    });

	    // create the destination Grid
	    var secondGrid = Ext.create('Ext.grid.Panel', {
			multiSelect: true,
			id: 'selectedAppGrid',
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
	        store            : undefined,
	        columns          : columns,
	        stripeRows       : true,
	        title            : 'Default Applications',
	        margins          : '0 0 0 3'
	    });

	    //Simple 'border layout' panel to house both grids
	    var displayPanel = Ext.create('Ext.Panel', {
			//height: 240,
			bodyStyle: 'background-color:#dfe8f5;',
			flex: 1,
			id: 'appDisplayPanel',
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
				firstGrid,
				secondGrid
			],
			margin: '0 0 14 0'
	    });
	
		var details = Ext.create('Ext.form.Panel', {
		        frame:true,
		        bodyStyle:'padding:5px 5px 0',
		        flex: 1,
				layout       : {
		            type: 'vbox',
		            align: 'stretch'
		        },
		        fieldDefaults: {
		            msgTarget: 'side',
		            labelWidth: 40
		        },
		        /*defaults: {
		            anchor: '100%'
		        },*/
				bodyStyle: 'background-color:#dfe8f5;',
		        items: [{
		            xtype:'fieldset',
					//flex: 1,
					height: 64,
		            title: 'Choose a Group to Modify',
		            collapsible: false,
		            defaultType: 'textfield',
					layout: {
						type: 'hbox',
						align: 'stretch'
					},
		           /* defaults: {
		                anchor: '30%'
		            },*/
		            items :[{
							xtype: 'combobox',
			                fieldLabel: 'Group',
							forceSelection: true,
							id: 'modifyGroupCombo',
							//width: 10,
							editable: false,
							store: 'Groups',
							queryMode: 'local',
							displayField: 'name',
							valueField: 'name',
							padding: '10 0 10 0',
							flex: 1
		        	},{
							xtype: 'button',
							id: 'addGroupButton',
							text: '<b>+</b>',
							width: 20,
							padding: '0 0 0 0',
							margin: '5 0 15 2'
					}]
				},{
			            xtype:'fieldset',
						//height: 200,
						flex: 1,
						disabled: true,
						id: 'editAppField',
			            title: 'Edit Application Properties',
			            collapsible: false,
						layout: {
							type: 'vbox',
							align: 'stretch'
						},
			            items :[{
							xtype: 'textarea',
							fieldLabel: 'Description',
							id: 'groupDesc',
							msgTarget: 'side',
				            labelWidth: 70,
							height: 40,
							margin: '5 0 5 0'
						}, displayPanel]
				}],
				buttons: [{
					text: 'Delete',
					id: 'groupDeleteButton',
					disabled: true
				},{
				    text: 'Save',
				    id: 'groupSaveButton',
					disabled: true
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

