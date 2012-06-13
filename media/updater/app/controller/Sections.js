/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
Ext.define('Updater.controller.Sections', {
    extend: 'Ext.app.Controller',

    stores: ['Sections', 'Clients'],
    models: ['Section'],
    
    refs: [
        {ref: 'sectionList', selector: 'sectionlist'},
        {ref: 'sectionData', selector: 'sectionlist dataview'},
        {ref: 'clientShow', selector: 'clientshow'},
        {ref: 'sectionForm', selector: 'sectionwindow form'},
        {ref: 'sectionCombo', selector: 'sectionwindow combobox'},
        {ref: 'clientGrid', selector: 'clientgrid'},
		{ref: 'sectionViewer', selector: 'viewer'},
		{
			ref: 'appComboBox',
			selector: 'applicationwindow > form > fieldset > container > combobox[fieldLabel="Name"]'
		},
        {
            ref: 'sectionWindow', 
            selector: 'sectionwindow', 
            autoCreate: true,
            xtype: 'sectionwindow'
        }
    ],

    // At this point things haven't rendered yet since init gets called on controllers before the launch function
    // is executed on the Application
    init: function() {
        this.control({
            'sectionlist dataview': {
                selectionchange: this.loadSection
            }
        });
    },
    
    onLaunch: function() {
		var viewer = this.getSectionViewer();
		
		// Hack to force background render of other sections (for quick loading upon section change)
		viewer.getComponent(1).show();
		viewer.getComponent(1).hide();
		viewer.getComponent(2).show();
		viewer.getComponent(2).hide();
		
        var dataview = this.getSectionData();
        var store = this.getSectionsStore();
            
        dataview.bindStore(store);
        dataview.getSelectionModel().select(store.getAt(0));
    },
    
    /**
     * Loads the given section into the viewer
     * @param {FV.model.feed} feed The feed to load
     */
    loadSection: function(selModel, selected) {
		var viewer = this.getSectionViewer();
	
		//console.log(viewer.activeTab);
		/*viewer.activeTab.setVisible(false);
		viewer.activeTab.doLayout();
		viewer.doLayout();*/
		section = selected[0];
		if (section) {
			var sectionName = section.get('name');
			if (sectionName == 'Clients') {
				viewer.activeTab.tab.hide();
				viewer.getComponent(0).tab.show();
				viewer.setActiveTab(0);
				this.getClientsStore().load();
				
				//viewer.remove(viewer.activeTab, false);
				
				//viewer.add(Ext.create('Updater.view.client.Show'));
			
				//viewer.getActiveTab().setTitle(sectionName);
				//this.getClientGrid().enable();
				//this.getClientsStore().load();
				
			} else if (sectionName == 'Groups') {
				//viewer.getActiveTab().hide();
				//viewer.remove(viewer.activeTab, false);
				//viewer.activeTab.hide();
				//viewer.getComponent(1).show();
				
			//	viewer.remove(viewer.activeTab)
				viewer.activeTab.tab.hide();
				//viewer.doLayout();
			
				viewer.getComponent(1).tab.show();
				viewer.setActiveTab(1);
				
				//Ext.getCmp('groupsTab').show();
				//viewer.add(Ext.create('Updater.view.group.Show'));
				
				//viewer.getActiveTab().setTitle(sectionName);
				
			} else if (sectionName == 'Applications') {
				viewer.activeTab.tab.hide();
				//viewer.doLayout();
			
				viewer.getComponent(2).tab.show();
				viewer.setActiveTab(2);
				this.getAppComboBox().getStore().load();			
				
			}
			
		}
	//	viewer.add(Ext.create('Updater.view.group.Show'));
        /*var grid = this.getClientGrid(),
            store = this.getClientsStore(),
            section = selected[0];

        if (section) {
            this.getSectionShow().setTitle(section.get('name'));
            grid.enable();
            store.load({
                params: {
                    feed: section.get('icon')
                }
            });            
        }*/
    }

});
