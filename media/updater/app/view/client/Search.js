Ext.define('Updater.view.client.Search', {
	extend: 'Ext.window.Window',
	alias: 'widget.clientsearch',
	requires: ['Updater.view.client.AppSelector',
				'Ext.form.Panel',
				'Ext.form.FieldSet',
				'Ext.form.TextField',
				'Ext.data.Connection',
				'Ext.grid.Panel'],
	height: 185,
	width: 400,
	resizable: false,
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	doSearch: undefined,
	//minimizable: true,
    /*requires: [
        'Updater.view.client.Grid'
    ],*/

	//closable: false,
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	defaults: {
		xtype: 'textfield',
		labelWidth: 90,
		margins: '10 5 0 5'
		//flex: 1
	},
	initComponent: function() {
		var searchItems = [{
			fieldLabel: 'Group',
			emptyText: 'Example: Unmanaged'
		},{
			fieldLabel: 'Client Apps',
			emptyText: 'Example: Systemlog_stable_1, Updater_noreg_20'
		},{
			fieldLabel: 'Inherited Apps',
			emptyText: 'Example: ohmage_alpha_531'
		},{
			xtype: 'button',
			text: 'Search',
			handler: Ext.bind(this.doSearch, this)
		}];
		
		Ext.apply(this, {
			items: searchItems
		});

		this.callParent(arguments);
	}
});