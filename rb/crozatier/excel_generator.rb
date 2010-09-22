require 'spreadsheet'

class ExcelGenerator
  def initialize(data)
    Spreadsheet.client_encoding = 'UTF-8'
    @data = data
  end
  
  def create_spreadsheet(filename, columns=[])
    puts "Generating spreadsheet."
    book = Spreadsheet::Workbook.new
    sheet1 = book.create_worksheet :name => 'Item List'
    
    sheet1.default_format = Spreadsheet::Format.new :text_wrap => true, :size => 12
    
    # set up column width
    columns.each_with_index do |col_def, i|
      if col_def[:width]
        sheet1.column(i).width = col_def[:width]
      end
    end
    
    #header
    sheet1.row(0).default_format = Spreadsheet::Format.new :weight => :bold, :size => 12, :bottom => true
    sheet1.row(0).concat(columns.map{|c| c[:header]})
    
    @data.each_with_index do |item, i|
      row_data = columns.map do |col_def| 
        d = item[col_def[:index]].to_s
        d.gsub!('<br/>',' - ') if col_def[:nuke_breaks] == true
        d
      end
      sheet1.row(i+1).concat(row_data)
    end
    book.write filename
    puts "Saved spreadsheet to #{filename}."
  end
end
