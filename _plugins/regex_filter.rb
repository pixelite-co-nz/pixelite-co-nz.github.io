# http://stackoverflow.com/questions/25802204/jekyll-filter-for-regex-substitution-in-content
module Jekyll
  module RegexFilter
    def replace_regex(input, reg_str, repl_str)
      re = Regexp.new reg_str

      # This will be returned
      input.gsub re, repl_str
    end

    def trim_double_slash(input)
      input.gsub(/\/\/$/, "/")
    end
  end
end

Liquid::Template.register_filter(Jekyll::RegexFilter)
