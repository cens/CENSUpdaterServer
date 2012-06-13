Ext.define('Updater.model.Log', {
    extend: 'Ext.data.Model',
    
    fields: [
        {name: 'time',  type: 'string'},
        {name: 'package', type: 'string'},
		{name: 'version', type: 'string'}
    ]
});
