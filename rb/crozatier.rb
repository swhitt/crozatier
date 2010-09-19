require 'rubygems'
require 'bundler'
Bundler.setup
require 'google_spreadsheet'
require 'yaml'
require 'ruby-debug'
require 'json'
Debugger.start

class CrozatierConverter
  attr_accessor :session, :spreadsheet, :ws, :table
  
  def initialize
    connect
    delete_table
    create_table
    create_table_json
    write_json_to_file
  end
  
  private 
  
  def connect
    puts 'Connecting to Google.'
    credentials = YAML.load_file('authentication.yml')
    @session = GoogleSpreadsheet.login(credentials['username'], credentials['password'])
    @spreadsheet = @session.spreadsheet_by_key(credentials['spreadsheet_key'])
    @ws = @spreadsheet.worksheets[0]
  end
  
  def delete_table
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
  
  def create_table_json
    recs = @table.records
    processed_recs = []
    recs.each do |rec|
      processed_rec = {}
      rec.each {|key,val| processed_rec[downcase_niceify(key)] = val}
      processed_recs << processed_rec
    end
    puts "#{recs.length} records processed."
    @json = JSON.pretty_generate(processed_recs)
  end
  
  def write_json_to_file
    print "Writing output to JSON... "
    string = "Crozatier = {}; Crozatier.stuff = #{@json};"
    File.open('../html/js/stuff-data.js', 'w') { |f| f.write(string) }
    puts "Done."
  end
  
  def downcase_niceify(str)
    str.downcase.gsub(' ','_')
  end
  
  def detect_table
   @ws.tables.detect {|t| t.title == downcase_niceify(@ws.title)}
  end
end

CrozatierConverter.new


