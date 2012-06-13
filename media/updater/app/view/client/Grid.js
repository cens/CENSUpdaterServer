/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/

Ext.require(['Ext.grid.*']);

Ext.define('Updater.view.client.Grid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.clientgrid',
	id : 'clientGrid',
	selModel: Ext.create('Ext.selection.CheckboxModel'),
	cls: 'feed-grid',
	//invalidateScrollerOnRefresh: false,
	disabled: false,

    requires: ['Ext.ux.PreviewPlugin', 'Ext.toolbar.Toolbar',
				'Ext.toolbar.TextItem',
	        	'Ext.form.field.Checkbox',
	        	'Ext.form.field.Text',
	        	'Ext.ux.statusbar.StatusBar',
				'Ext.ux.RowExpander',
				'Ext.grid.feature.Grouping',
				'Ext.selection.CheckboxModel',
				'Ext.ux.grid.FiltersFeature',
				'Ext.selection.CellModel',
				'Ext.grid.plugin.CellEditing',
				'Ext.container.ButtonGroup',
				'Ext.layout.container.Table'],
    
    border: false,
	//multiSelect: true,
	features: [Ext.create('Ext.grid.feature.Grouping', {
	        	groupHeaderTpl: 'Group: {name} ({rows.length} Client{[values.rows.length > 1 ? "s" : ""]})',
				id : 'gridGrouper'
			}),	{
			ftype: 'filters',
			encode: true,
			local: true,
			filters: [{
				type: 'string',
				dataIndex: 'imei'
			},{
				type: 'string',
				dataIndex: 'user_applications'
			},{
				type: 'string',
				dataIndex: 'group_applications'
			},{
				type: 'list',
				dataIndex: 'group',
				options: [{store: 'Groups'}]
			}]
		}],
	plugins: [{
	            ptype: 'rowexpander',
				expandOnDblClick: false,
	            rowBodyTpl : new Ext.XTemplate(
	                '<div style="margin-left: 30px"><p><b>Phone Tags:</b> {[this.parse(values.phone_tags)]}</p><p><b>Manual Tags:</b> {[this.parse(values.manual_tags)]}</p></div>',
					{
						/*parsePrimary : function(json) {
							var decoded = Ext.JSON.decode(json);
							var retString = '';
							
							for (var i = 0; i < decoded.length; i++) {
								for (var j in decoded[i]) {
									var app = j;
									for (var k in decoded[i][j]) {
										var key = k
										var value = decoded[i][j][k];
										retString += '[<i>' + app + '</i> -> '+ key + ' : ' + value + ']';
									}
								}
								if (i != decoded.length-1) {
									retString += ', '
								}
							}
							
							return retString;
						},*/
						parse : function(json) {
							var decoded = Ext.JSON.decode(json);
							var retString = '';
							
							for (var i = 0; i < decoded.length; i++) {
								for (var j in decoded[i]) {
									var key = j;
									var value = decoded[i][j];
									if (key == "key") {
										retString += '[' + value + ' : ';
									} else if (key == "value") {
										retString += value + ']';
									}
								}
								if (i != decoded.length-1) {
									retString += ', '
								}
							}
							
							return retString;
						}
					}
	            )
	        }],
	initComponent: function() {
		var me = this;
me.tbar = [
{
    xtype: 'buttongroup',
    title: 'Search',
    flex: 1,
    columns: 1,
    layout: 'fit',
    items: [{
        xtype: 'container',
        flex: 1,
        layout: {
            type: 'hbox',
        },
        items: [{
            xtype: 'textfield',
            hideLabel: true,
            id: 'basicSearchQuery',
            flex: 1,
            emptyText: 'Basic Search...',
            margins: '0 0 -10 0'
        },
        {
            xtype: 'button',
            text: 'Go',
            tooltip: 'Enter search queries separated by commas, i.e. "Unmanaged, ohmage_alpha_1"',
            margins: '0 0 0 2',
            id: 'basicSearchButton'
        },
        {
            xtype: 'button',
            text: 'Advanced Search...',
            iconCls: 'ui-icon-search',
            id: 'advancedSearchButton',
            menu: Ext.create('Ext.menu.Menu', {
                width: 400,
                height: 185,
                floating: true,
                layout: 'fit',
                plain: true,
                defaults: {
                    xtype: 'textfield',
                    labelWidth: 90,
                    width: 385,
                    margins: '5 5 0 5'
                },
                items: [{
                    fieldLabel: 'Group',
                    emptyText: 'Example: Unmanaged'
                },
                {
                    fieldLabel: 'Client Apps',
                    emptyText: 'Example: Systemlog_stable_1, Updater_noreg_20'
                },
                {
                    fieldLabel: 'Inherited Apps',
                    emptyText: 'Example: ohmage_alpha_531'
                },
				{
                    fieldLabel: 'Phone Tags',
                    emptyText: 'Example: keyword1, keyword2'
                },
				{
                    fieldLabel: 'Manual Tags',
                    emptyText: 'Example: keyword1, keyword2'
                },
                {
                    xtype: 'button',
                    text: 'Search',
                    id: 'doAdvancedSearch'
                }]
            })
            //}]
        }]
    }]
},
{
    xtype: 'buttongroup',
    title: 'Client Operations',
    columns: 3,
    defaults: {
        scale: 'small'
    },
    items: [{
        //xtype: 'splitbutton',
        text: 'New Client',
        tooltip: 'Add a new client to the Updater database',
        id: 'addClient',
        iconCls: 'ui-icon-add-user',
        //handler: function() {},
        scope: this
        //menu: [{text: 'Menu Item 1'}]
    },
    {
        text: 'Delete Selected',
        tooltip: 'Remove the selected client(s) from the Updater database',
        id: 'deleteSelected',
        iconCls: 'ui-icon-delete-user',
        //handler: function() { Ext.Msg.alert('Warning', 'The following client(s) will be removed:'); },
        scope: this
    },
    {
        text: 'Edit Selected',
        tooltip: 'Edit the details of the selected client(s)',
        id: 'editSelected',
        iconCls: 'ui-icon-edit-user',
        scope: this
    }]
},
{
    xtype: 'buttongroup',
    title: 'Selection',
    columns: 2,
    defaults: {
        scale: 'small'
    },
    items: [{
        text: 'Select All',
        tooltip: 'Add a new client to the Updater database',
        iconCls: 'ui-icon-select-all',
        handler: function() {
            Ext.getCmp('clientGrid').getSelectionModel().selectAll();
        },
        scope: this
    },
    {
        text: 'Deselect All',
        tooltip: 'Remove the selected client(s) from the Updater database',
        iconCls: 'ui-icon-deselect-all',
        handler: function() {
            Ext.getCmp('clientGrid').getSelectionModel().deselectAll();
        },
        scope: this
    }]
}];

		me.bbar = {
			xtype: 'toolbar',
			items: ['->',{
				xtype: 'button',
				text: 'Reset Grid',
				iconCls: 'ui-icon-grid-reset',
				handler: Ext.bind(function() {
					this.store.load();
					Ext.getCmp('basicSearchQuery').setRawValue('');
				}, this)
				//width: 100
			}]
		}

		Ext.apply(this, {
		    store: 'Clients',

			viewConfig: {
				plugins: [{
					pluginId: 'preview',
					ptype: 'preview',
					bodyField: 'description',
					previewExpanded: true
				}]
			},

			columns: [{
				text: 'IMEI',
				dataIndex: 'imei',
				/*filterable: true,
				filter: {type: 'numeric'},*/
				width: 200
			}, {
				text: 'User Applications',
				dataIndex: 'user_applications',
				flex: 1,
				tdCls:'wrap-text'
			}, {
				text: 'Group Applications',
				dataIndex: 'group_applications',
				flex: 1,
				tdCls:'wrap-text'
			}, {
				text: 'Group',
				dataIndex: 'group',
				width: 150
			}, {
				text: 'Asset Tag',
				dataIndex: 'asset_tag',
				hidden: true
			}, {
				text: 'Phone #',
				dataIndex: 'phone',
				hidden: true
			}, {
				text: 'SIM ID',
				dataIndex: 'sim_id',
				hidden: true
			}],
		});

		this.callParent(arguments);
	}
});

