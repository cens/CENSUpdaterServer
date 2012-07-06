/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
Ext.define('Updater.view.Viewer', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.viewer',
    
    requires: ['Updater.view.client.Show',
			   'Updater.view.group.Show',
			   'Updater.view.application.Show'],
    
    activeItem: 0,
    margins: '5 5 5 5',
    
    cls: 'preview',
    
    initComponent: function() {
		var loginURL = "http://updater.mobilizingcs.org/uproject/uapp/login/";
		var checkLoggedInURL = "http://updater.mobilizingcs.org/uproject/uapp/listAppNames/";
		// Check to make sure we are logged-in
		//  If we are not logged in, redirect to the login page
		Ext.Ajax.request({
			url: checkLoggedInURL,
			success: function (response, options) {
				if (response.responseText.substring(0,22) == "<!-- NOT_LOGGED_IN -->") {
					window.location = loginURL;
				}
			}
		});
		
		
		Ext.override(Ext.LoadMask, {
		     onHide: function() {
		          this.callParent();
		     }
		});
		
        this.items = [{
            xtype: 'clientshow',
            title: 'Clients',
			//id: 'clientsTab'
        },{
	        xtype: 'groupshow',
	        title: 'Groups',
			hidden: true,
	    },{
		        xtype: 'applicationshow',
		        title: 'Applications',
				hidden: true,
		}];
        
        this.callParent(arguments);
    }
});
