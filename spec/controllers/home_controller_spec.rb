require 'spec_helper'

describe HomeController do
  render_views

  it "should generate a test fixture", :js_fixture => true do


    get :index
    create_fixture("snake_page.html")

  end

end