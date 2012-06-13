/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
Ext.define('Updater.view.client.Show', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.clientshow',

    requires: [
        'Updater.view.client.Grid',
		'Ext.grid.feature.Grouping'
    ],

	closable: false,
	layout: {
		type: 'vbox',
		align: 'stretch'
	},

	initComponent: function() {
		Ext.apply(this, {
			items: [{
				xtype: 'clientgrid',
				flex: 1
			}]
		});

		this.callParent(arguments);
	}
});

