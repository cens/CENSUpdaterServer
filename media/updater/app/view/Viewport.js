/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
Ext.define('Updater.view.Viewport', {
    extend: 'Ext.container.Viewport',

    requires: [
        'Updater.view.Viewer',
        'Updater.view.section.List',
        'Ext.layout.container.Border',
		'Ext.grid.*'

    ],

	layout: 'border',

	items: [{
		region: 'north',
		xtype: 'panel',
		bodyStyle: 'background-color:#dfe8f5;',
		height: 20,
		border: false,
		layout: 'border',
		items: [{
			xtype: 'box',
			region: 'west',
			style: {
				color: '#888888'
			},
			html: '<b>MobilizeLabs Updater</b>',
			width: 200,
			margin: '3 3 3 6'
		},{
			xtype: 'box',
			region: 'center'
		},{
			xtype: 'box',
			html: '<a href="/uproject/uapp/logout">logout</a>',
			region: 'east',
			margin: '3 6 3 3'
		}]
		/*xtype: 'box',
		html: '<h1 class="x-panel-header">MobilizeLabs Updater</h1>',
        //autoHeight: true,
        border: false,
        margins: '0 0 0 0'*/
	},{
		region: 'center',
		xtype: 'viewer'
	},{
		region: 'west',
		width: 150,
		xtype: 'sectionlist'
	}]
});

