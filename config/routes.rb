Snake::Application.routes.draw do
  root :to => "home#index"
  resources :home, :only => [:index, :show]
end
