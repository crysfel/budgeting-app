require 'mina/rails'
require 'mina/git'
# require 'mina/rbenv'  # for rbenv support. (https://rbenv.org)
# require 'mina/rvm'    # for rvm support. (https://rvm.io)

# Basic settings:
#   domain       - The hostname to SSH to.
#   deploy_to    - Path to deploy into.
#   repository   - Git repo to clone from. (needed by mina/git)
#   branch       - Branch name to deploy. (needed by mina/git)

set :application_name, 'budgetapp'
set :domain, 'budget.bleext.com'
set :repository, 'git@bitbucket.org:crysfel/budgetapp.git'

stage = ENV['to']
case stage
when 'production'
  set :deploy_to, '/var/www/budget.bleext.com/production'
  set :branch, 'develop'
else
  set :domain, 'budget-qa.bleext.com'
  set :deploy_to, '/var/www/budget.bleext.com/test'
  set :branch, 'develop'
end

# Optional settings:
set :user, 'crysfel'          # Username in the server to SSH to.
# set :port, '22'           # SSH port number.
set :forward_agent, true     # SSH forward_agent.
set :execution_mode, :system

# shared dirs and files will be symlinked into the app-folder by the 'deploy:link_shared_paths' step.
# set :shared_dirs, fetch(:shared_dirs, []).push('somedir')
# set :shared_files, fetch(:shared_files, []).push('config/database.yml', 'config/secrets.yml')

# This task is the environment that is loaded for all remote run commands, such as
# `mina deploy` or `mina rake`.
task :environment do
  # If you're using rbenv, use this to load the rbenv environment.
  # Be sure to commit your .ruby-version or .rbenv-version to your repository.
  # invoke :'rbenv:load'

  # For those using RVM, use this to load an RVM version@gemset.
  # invoke :'rvm:use', 'ruby-1.9.3-p125@default'

  invoke :'nvm:load'


  comment "source #{fetch(:deploy_to)}/.node_env"
  command %{source #{fetch(:deploy_to)}/.node_env}
end

namespace :nvm do
  task :load do
    command 'echo "-----> Loading nvm"'
    command %[
      source ~/.nvm/nvm.sh
    ]
    command 'echo "-----> Now using nvm v.`nvm --version`"'
  end
end

# Restart the php fpm server to get
# the new updates
task :restart do
  command 'sudo systemctl restart php7.1-fpm'
end

# Put any custom commands you need to run at setup
# All paths in `shared_dirs` and `shared_paths` will be created on their own.
task :setup do
  # command %{rbenv install 2.3.0}
  command %[mkdir -p "#{fetch(:shared_path)}/storage/app/public"]
  command %[mkdir -p "#{fetch(:shared_path)}/storage/framework/cache"]
  command %[mkdir -p "#{fetch(:shared_path)}/storage/framework/sessions"]
  command %[mkdir -p "#{fetch(:shared_path)}/storage/framework/testing"]
  command %[mkdir -p "#{fetch(:shared_path)}/storage/framework/views"]
  command %[mkdir -p "#{fetch(:shared_path)}/storage/locations"]
  command %[mkdir -p "#{fetch(:shared_path)}/storage/logs"]

  command %[chgrp -R www-data "#{fetch(:shared_path)}/storage"]
  command %[chmod -R ug+rwx "#{fetch(:shared_path)}/storage"]
end

desc "Deploys the current version to the server."
task :deploy do
  # uncomment this line to make sure you pushed your local branch to the remote origin
  # invoke :'git:ensure_pushed'
  deploy do
    comment "Deploying #{fetch(:application_name)} to #{fetch(:domain)}:#{fetch(:deploy_to)}"

    command "pwd"
    # Put things that will set up an empty directory into a fully set-up
    # instance of your project.
    invoke :'git:clone'
    
    # Install dependencies
    command "composer install --no-dev --optimize-autoloader"
    

    comment "Removing seed folder on shared storage";
    command %[rm -rf "#{fetch(:shared_path)}/storage/seed"]

    # comment "Moving seed to shared storage"
    # command %[mv ./storage/seed "#{fetch(:shared_path)}/storage"]

    comment "Removing the local storage folder"
    command %[rm -rf ./storage]

    comment "Creating a link to the shared storage folder"
    comment "ln -s #{fetch(:shared_path)}/storage ./storage"
    command %[ln -s "#{fetch(:shared_path)}/storage" ./storage]

    comment "Creating a link to the public storage folder"
    comment "ln -s #{fetch(:shared_path)}/storage/app/public ./public/storage"
    command %[ln -s "#{fetch(:shared_path)}/storage/app/public" ./public/storage]

    # comment "Moving documentation to shared folder"
    # comment "cp -R docs #{fetch(:shared_path)}/storage/app/public"
    # command %[rm -rf "#{fetch(:shared_path)}/storage/app/public/docs"]
    # command %[cp -R docs "#{fetch(:shared_path)}/storage/app/public"]
    
    comment "Update cache write access to the web server"
    command %[chgrp -R www-data bootstrap/cache]
    command %[chmod -R ug+rwx bootstrap/cache]
    
    comment "Download the geoip database"
    command "php artisan geoip:update"

    comment "Migrate the database if new migrations"
    comment "cp #{fetch(:deploy_to)}/.env .env"
    command %[cp "#{fetch(:deploy_to)}/.env" .env]
    command %[cp "#{fetch(:deploy_to)}/.env" spa/.env]
    comment "cp #{fetch(:deploy_to)}/.node_env .node_env"
    command %[cp "#{fetch(:deploy_to)}/.node_env" spa/.node_env]
    command "php artisan migrate"

    comment "Installing the client app"
    command %{source ~/.nvm/nvm.sh}
    comment "source #{fetch(:deploy_to)}/.node_env"
    command %{source #{fetch(:deploy_to)}/.node_env}
    command %{cd spa}
    command %{nvm use 10.15.0}
    command %{yarn install}
    command %{yarn build}
    command %{mv build ../public/app}
    
    invoke :'deploy:cleanup'

    # command %[chgrp -R www-data "./public/app"]
    # command %[chmod -R ug+rwx "./public/app"]

    on :launch do
      in_path(fetch(:current_path)) do
        command %{mkdir -p tmp/}
        command %{touch tmp/restart.txt}
      end

      invoke :restart
    end
  end

  # you can use `run :local` to run tasks on local machine before of after the deploy scripts
  # run(:local){ say 'done' }
end

# For help in making your deploy script, see the Mina documentation:
#
#  - https://github.com/mina-deploy/mina/tree/master/docs