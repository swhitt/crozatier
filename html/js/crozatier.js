function getParameterByName(name) {
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}


Crozatier.lang = (getParameterByName('lang') == 'fr') ? 'fr' : 'en';

jQuery(document).ready(function($) {
  
  
  var reader = new Ext.data.JsonReader({
    root: 'stuff',
    idProperty: 'slug',
    fields: [
    'slug', 'category', 'french_category', 'name', 'french_name', 'brand', 'model', 'details', 'french_details', 
    'rest_localized', 'docs', 'purchase_date', 'original_cost', 'asking_cost', 'delta', 'percent_discount']
  });
  var store = new Ext.data.GroupingStore({
    autoDestroy: true,
    reader: reader,
    data: Crozatier,
    storeId: 'crozatierStore',
    groupField: (Crozatier.lang == 'en') ? 'category' : 'french_category'
  });
  var cols;
  if(Crozatier.lang == 'en') {
    cols = [
      {header: 'Category', dataIndex: 'category', width: 100},
      {header: 'Description', dataIndex: 'name', width: 110},
      {header: 'Brand', dataIndex: 'brand', width: 75},
      {header: 'Model', dataIndex: 'model', width: 100},
      {header: 'Cost', dataIndex: 'asking_cost', width: 50, align: 'right'}
    ]
  } else {
    cols = [
      {header: 'Catégorie', dataIndex: 'french_category', width: 100},
      {header: 'Description', dataIndex: 'french_name', width: 110},
      {header: 'Marque', dataIndex: 'brand', width: 75},
      {header: 'Modèle', dataIndex: 'model', width: 100},
      {header: 'Coût', dataIndex: 'asking_cost', width: 50, align: 'right'}
    ]
  }
  
  var grid = new Ext.grid.GridPanel({
    id: 'itemListGrid',
    store: store,
    columns : cols,
    sm: new Ext.grid.RowSelectionModel({singleSelect: true}),
    region: 'west',
    title: (Crozatier.lang == 'en') ? 'Item List' : 'Liste des articles',
    collapsible: true,
    titleCollapse: true,
    floatable: false,
    split: true,
    width: 360,
    minWidth: 100,
    stripeRows: true,
    view: new Ext.grid.GroupingView({
        forceFit:true,
        enableGroupingMenu: false,
      	hideGroupedColumn: true,
      	showGroupName: false,
        groupTextTpl: '{text} ({[values.rs.length]})'
    })
  });
  
  grid.getSelectionModel().on('rowselect', function(sm, rowIdx, r) {
    var tabName = r.data.slug + '-tab';
    if(Ext.getCmp(tabName)) {
      Ext.getCmp(tabName).show();
    } else {

      var stuffTplMarkup;
      
      if(Crozatier.lang == 'en') {
        stuffTplMarkup = [
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
          '<div class ="rest-desc" id="{slug}-rest"></div>'
        ];
      } else {
        stuffTplMarkup = [
          '<h1>{french_name}</h1>',
          '<p>{french_details}</p>',
          '<table class="sell-figs">',
          '<tr class="even"><td>Marque</td><td>{brand}</td></tr>',
          '<tr class="odd"><td>Modèle</td><td>{model}</td></tr>',
          '<tr class="even"><td>Documentation?</td><td>{docs}</td></tr>',
          '<tr class="odd"><td>Date d\'achat</td><td>{purchase_date}</td></tr>',
          '<tr class="even"><td>Le coût initial</td><td>{original_cost}</td></tr>',
          '<tr class="odd"><td>Coût</td><td>{asking_cost}</td></tr>',
          '</table>',
          '<div class ="rest-desc" id="{slug}-rest"></div>'
        ];
      }

      var stuffTpl = new Ext.Template(stuffTplMarkup);

      Ext.getCmp('crozatier-tabs').add({
        title: Crozatier.lang == 'en' ? r.data.name : r.data.french_name,
        html: stuffTpl.apply(r.data),
        closable:true,
        id: tabName,
        xtype: 'panel',
        autoScroll: true
        
        }).show();
      };
      
      var restEl = $('#'+r.data.slug+'-rest');
      var restUrl = (r.data.rest_localized == 'yes') ? 'details/'+r.data.slug+'-'+Crozatier.lang+'.html' : 'details/'+r.data.slug+'.html';
      
      $.ajax({
        url: restUrl,
        dataType: 'html',
        success: function(data) {
          restEl.html(data);
        },
        beforeSend: function() {
          restEl.html(Crozatier.lang == 'en' ? '<p>Loading... </p>' : '<p>Chargement... </p>');
        },
        error: function() {
          var text;
          if (Crozatier.lang == 'en') {
            text = "<p>There is no extra information about the "+ r.data.name +" yet. If you're interested, send me an email for more information.";
          } else {
            text = "<p>Il n'y a pas d'informations supplémentaires sur "+r.data.french_name+" pour le moment. Si vous êtes intéressés, envoyez moi un email pour plus d'informations.</p>";
          }
          restEl.html(text);
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
      contentEl: 'information-text-'+Crozatier.lang,
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
        title: (Crozatier.lang == 'en') ? 'Key Information' : 'Informations Clés',
        contentEl: 'key-information-'+Crozatier.lang,
        id: 'key-information-tab',
        xtype: 'panel',
        autoScroll: true
      }
    }]
  });
  
  if(Crozatier.lang == 'en') {
    $('.french').hide();
  } else {
    $('.english').hide();
  }

});

  // Ext.getCmp('crozatier-tabs').add({
    //     title: 'New Tab Super lIc',
    //     html: 'Tab Body <br/><br/>',
    //     closable:true
    // }).show();