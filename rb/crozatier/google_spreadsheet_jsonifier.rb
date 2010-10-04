require 'google_spreadsheet'
require 'yaml'
require 'json'

# 
# 
# Author:: Steve Whittaker
# Website:: http://github.com/swhitt/crozatier/blob/master/rb/crozatier/google_spreadsheet_jsonifier.rb

class GoogleSpreadsheetJsonifier
  attr_accessor :session, :spreadsheet, :ws, :table, :processed_recs
  
  def initialize(session_filename)
    @session_filename = session_filename
    connect
  end
  
  def process(regen_table=true)
    if(regen_table)
      delete_table_if_exists
      create_table
    end
    create_table_json(regen_table)
  end
  
  def write_to_file(filename)
    write_json_to_file(filename)
  end
  
  private 
  
  def connect
    puts 'Connecting to Google.'
    options = YAML.load_file('options.yml')
    @session = GoogleSpreadsheet.saved_session(@session_filename)
    @spreadsheet = @session.spreadsheet_by_key(options['spreadsheet_key'])
    @ws = @spreadsheet.worksheets[0]
  end
  
  def delete_table_if_exists
    table = detect_table
    puts 'Found existing records table; deleting it.' if table
    table.delete if table
  end
  
  def create_table
    cols = {}
    alpha = ('A'..'Z').to_a
    (1..@ws.num_cols).each do |i|
      name = @ws[1,i]
      cols[alpha[i-1]] = name
    end
    puts 'Creating records table.'
    @table = @ws.add_table(@ws.title.downcase.gsub(' ','_'), @ws.title, cols, :num_rows => (@ws.num_rows - 2))
  end
  
  def create_table_json(table_regenned)
    recs = (table_regenned ? @table : detect_table).records
    @processed_recs = []
    recs.each do |rec|
      processed_rec = {}
      rec.each {|key,val| processed_rec[downcase_niceify(key)] = val}
      @processed_recs << processed_rec
    end
    puts "#{recs.length} records processed."
    @json = JSON.pretty_generate(@processed_recs)
  end
  
  def write_json_to_file(filename)
    print "Writing output to JSON at #{filename}... "
    string = "Crozatier = {}; Crozatier.stuff = #{@json};"
    File.open(filename, 'w') { |f| f.write(string) }
    puts "Done."
  end
  
  def downcase_niceify(str)
    str.downcase.gsub(' ','_')
  end
  
  def detect_table
   @ws.tables.detect {|t| t.title == downcase_niceify(@ws.title)}
  end
end
