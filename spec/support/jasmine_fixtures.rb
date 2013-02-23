module JasmineFixtures
  # Saves the markup to a fixture file using the given name
  def create_fixture(name)

    puts "Render views is not enabled, no output will appear in fixture" unless example.example_group.render_views?
    response.should be_success

    directory =  File.join(Rails.root, 'spec/javascripts/fixtures')
    FileUtils.mkdir_p(directory)

    fixture = case name
                when /\.html$/
                  response.body.sub(/.*<body/im, '<div').sub(/<\/body>.*/im, "</div>")
                when /\.json$/
                  JSON.pretty_generate(JSON.load(response.body))
                else
                  response.body
              end

    File.open(File.join(directory, "rspec_#{name}"), 'w') { |file| file.write(fixture)}
  end
end

