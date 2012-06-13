Ext.define('Updater.model.Application', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'package',  type: 'string'},
		{name: 'version',  type: 'string'},
		{name: 'url',  type: 'string'},
		{name: 'action',  type: 'string'},
		{name: 'release',  type: 'string'},
        {name: 'name', type: 'string'},
		{name: 'groups'}
    ]
});
