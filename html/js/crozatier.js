jQuery(document).ready(function($) {
  new Ext.Viewport({
    id: 'crozatier-viewport',
    layout: 'border',
    items: [ {
      region: 'north',
      title: 'Moving Sale - Vente de Déménagement',
      collapsible: true,
      floatable: false,
      titleCollapse: true,
      contentEl: 'information-text',
      id: 'information-panel',
      split: true
    }, {
      region: 'west',
      collapsible: true,
      titleCollapse: true,
      floatable: false,
      title: 'Item List',
      split: true,
      width: 300,
      minWidth: 100
      // the west region might typically utilize a TreePanel or a Panel with Accordion layout
    }, {
      region: 'center',
      xtype: 'tabpanel',
      id: 'crozatier-tabs',
      activeTab: 0,
      items: {
        title: 'Key Information - Informations clés',
        contentEl: 'key-information' 
      }
    }]
  });
  
});
  
