jQuery(document).ready(function($) {
  var store = new Ext.data.JsonStore({
    autoDestroy: true,
    data: Crozatier,
    storeId: 'crozatierStore',
    root: 'stuff',
    idProperty: 'slug',
    fields: ['slug', 'name', 'brand', 'model', 'details', 'docs', 'purchase_date', 'original_cost', 'asking_cost', 'delta', 'percent_discount']
  });
  var grid = new Ext.grid.GridPanel({
    store: store,
    columns : [
      {header: 'Name', dataIndex: 'name', width: 110},
      {header: 'Brand', dataIndex: 'brand', width: 75},
      {header: 'Model', dataIndex: 'model', width: 100},
      {header: 'Cost', dataIndex: 'asking_cost', width: 50, align: 'right'}
    ],
    sm: new Ext.grid.RowSelectionModel({singleSelect: true}),
    region: 'west',
    title: 'Item List',
    collapsible: true,
    titleCollapse: true,
    floatable: false,
    split: true,
    width: 360,
    minWidth: 100,
    stripeRows: true
  });

  grid.getSelectionModel().on('rowselect', function(sm, rowIdx, r) {
    var tabName = r.data.slug + '-tab';
    if(Ext.getCmp(tabName)) {
      Ext.getCmp(tabName).show();
    } else {

      var stuffTplMarkup = [
        '<h1>{name}</h1>',
        '<p>{details}</p>',
        '<table class="sell-figs">',
        '<tr class="even"><td>Brand</td><td>{brand}</td></tr>',
        '<tr class="odd"><td>Model</td><td>{model}</td></tr>',
        '<tr class="even"><td>Have docs?</td><td>{docs}</td></tr>',
        '<tr class="odd"><td>Purchase Date</td><td>{purchase_date}</td></tr>',
        '<tr class="even"><td>Original Cost</td><td>{original_cost}</td></tr>',
        '<tr class="odd"><td>Asking Cost</td><td>{asking_cost}</td></tr>',
        '</table>',
        '<div id="{slug}-rest"></div>'
      ];

      var stuffTpl = new Ext.Template(stuffTplMarkup);

      Ext.getCmp('crozatier-tabs').add({
        title: r.data.name,
        html: stuffTpl.apply(r.data),
        closable:true,
        id: tabName
        }).show();
      };
      
      var restEl = $('#'+r.data.slug+'-rest');
      $.ajax({
        url: 'details/'+r.data.slug+'.html',
        dataType: 'html',
        success: function(data) {
          restEl.html(data);
        },
        beforeSend: function() {
          restEl.html('<p>Loading... </p>');
        },
        error: function() {
          restEl.html("<p>There is no extra information about the "+ r.data.name +" yet. If you're interested, send me an email for more information.");
        }
      });
  });


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
    }, 
    grid, 
    {
      region: 'center',
      xtype: 'tabpanel',
      id: 'crozatier-tabs',
      activeTab: 0,
      enableTabScroll:true,
      items: {
        title: 'Key Information',
        contentEl: 'key-information',
        id: 'key-information-tab'
      }
    }]
  });

});

  // Ext.getCmp('crozatier-tabs').add({
    //     title: 'New Tab Super lIc',
    //     html: 'Tab Body <br/><br/>',
    //     closable:true
    // }).show();