require 'spec_helper'

describe HomeController do
  describe "fixture generate" do
  render_views

    it "should generate a test fixture", :js_fixture => true do
      get :index
      create_fixture("snake_page.html")

    end
  end

  it "should do something else" do
    get :index

  end

end