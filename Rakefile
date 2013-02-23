#!/usr/bin/env rake
# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require File.expand_path('../config/application', __FILE__)

Snake::Application.load_tasks

def alias_task(name, old_name)
  t = Rake::Task[old_name]
  desc t.full_comment if t.full_comment
  task name, *t.arg_names do |_, args|
    # values_at is broken on Rake::TaskArguments
    args = t.arg_names.map { |a| args[a] }
    t.invoke(args)
  end
end

alias_task("jasmine:server:standard", "jasmine:server")
alias_task("jasmine:ci:standard", "jasmine:ci")

namespace :jasmine do
  task :server => ["spec:fixtures"] do
    Rake::Task["jasmine:server:standard"].execute
  end

  task :ci => ["spec:fixtures"] do
      Rake::Task["jasmine:ci:standard"].execute
  end
end

if defined?(RSpec)
  require "rspec"
  require "rspec/core/rake_task"

  task(:spec).clear
  RSpec::Core::RakeTask.new(:spec) do |t|
    t.verbose = false
  end

  namespace :spec do
    task :ci => ["spec:no_fixtures"] do
      system("bundle exec rake jasmine:ci")
      system("rm log/test.log")
    end

    RSpec::Core::RakeTask.new :fixtures => [:environment] do |t|
      t.spec_opts = ["--tag js_fixture"]
      t.verbose = false
    end


    RSpec::Core::RakeTask.new :no_fixtures => [:environment] do |t|
      t.spec_opts = ["--tag ~js_fixture"]
      t.verbose = false
    end
  end
end
