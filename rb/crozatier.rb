require 'rubygems'
require 'bundler'
Bundler.setup
require 'ruby-debug'
Debugger.start

require File.dirname(__FILE__) + "/crozatier/google_spreadsheet_jsonifier"
require File.dirname(__FILE__) + "/crozatier/excel_generator"

cc = GoogleSpreadsheetJsonifier.new(File.dirname(__FILE__) + "/.crozatier_auth.token")
cc.process
cc.write_to_file(File.dirname(__FILE__) + "/../html/js/stuff-data.js")

english_cols =  [{:index => 'name', :header => 'Name', :width => 20},
                  {:index => 'sold', :header => 'Sold?', :width => 10},
                  {:index => 'brand', :header => 'Brand', :width => 18}, 
                  {:index => 'model', :header => 'Model', :width => 15},
                  {:index => 'original_cost', :header => 'Original Cost', :width => 15},
                  {:index => 'asking_cost', :header => 'Price', :width => 10},
                  {:index => 'purchase_date', :header => 'Purchase Date', :width => 20},
                  {:index => 'details', :header => 'Additional Details', :width => 100, :nuke_breaks => true}]
                  
french_cols =  [{:index => 'french_name', :header => 'Nom', :width => 20}, 
                {:index => 'sold', :header => 'Vendu?', :width => 10},
                {:index => 'brand', :header => 'Marque', :width => 18}, 
                {:index => 'model', :header => 'Modèle', :width => 15},
                {:index => 'original_cost', :header => 'Le coût initial', :width => 15},
                {:index => 'asking_cost', :header => 'Prix', :width => 10},
                {:index => 'purchase_date', :header => 'Date d\'achat', :width => 20},
                {:index => 'french_details', :header => 'Informations supplémentaires', :width => 100, :nuke_breaks => true}]                  

sg = ExcelGenerator.new(cc.processed_recs)
sg.create_spreadsheet(File.dirname(__FILE__) + "/../html/xls/sale-english.xls", english_cols)
sg.create_spreadsheet(File.dirname(__FILE__) + "/../html/xls/vente-francais.xls",  french_cols)

