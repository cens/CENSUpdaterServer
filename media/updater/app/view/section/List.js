/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
Ext.define('Updater.view.section.List', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.sectionlist',

	title: 'Navigation',
	collapsible: true,
	animCollapse: true,
	margins: '5 0 5 5',
	layout: 'fit',

	initComponent: function() {
		Ext.apply(this, {
			items: [{
				xtype: 'dataview',
				trackOver: true,
				store: this.store,
				cls: 'feed-list',
				itemSelector: '.section-list-item',
				//itemSelector: new Ext.Template(".section-list-item"),
				overItemCls: 'feed-list-item-hover',
				//tpl: '<tpl for="."><div class="section-list-item">{name}</div></tpl>',
				tpl: '<tpl for="."><div class="section-list-item"><div class="{section_css}">{name}</div></div></tpl>',
				listeners: {
				    selectionchange: this.onSelectionChange,
				    scope: this
				}
			}]
		});

		this.callParent(arguments);
	},
	
	onSelectionChange: function(selmodel, selection) {
        var selected = selection[0];
            //var button = this.down('dataview');
        if (selected) {
            //button.enable();
        }
        else {
            //button.disable();
        }
	}
});

