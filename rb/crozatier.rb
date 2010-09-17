require 'rubygems'
require 'bundler'
Bundler.setup
require 'google_spreadsheet'
require 'yaml'
require 'ruby-debug'
Debugger.start

credentials = YAML.load_file('authentication.yml')

session = GoogleSpreadsheet.login(credentials['username'], credentials['password'])
spreadsheet = session.spreadsheet_by_key(credentials['spreadsheet_key'])
ws = spreadsheet.worksheets[0]
cols = {}
(1..ws.num_cols).each do |i|
  index = ('A'..'Z').to_a[i-1]
  name = ws[1,i]
  cols[index] = name.downcase.gsub(' ','_')
end

ws.add_table(ws.title.downcase.gsub(' ','_'), ws.title, cols)
