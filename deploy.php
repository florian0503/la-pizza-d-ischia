<?php

namespace Deployer;

require 'recipe/common.php';

set('application', 'la-pizza-d-ischia');
set('repository', 'https://github.com/florian0503/la-pizza-d-ischia.git');
set('git_tty', false);
set('keep_releases', 3);
set('ssh_multiplexing', false);

set('shared_files', ['app/.env.local']);
set('shared_dirs', ['app/var/log', 'app/var/sessions']);
set('writable_dirs', ['app/var', 'app/var/cache', 'app/var/log', 'app/var/sessions']);
set('writable_mode', 'chmod');

host('production')
    ->setHostname('__DEPLOY_HOST__')
    ->setRemoteUser('__DEPLOY_USER__')
    ->setPort(__DEPLOY_PORT__)
    ->set('deploy_path', '~/domains/lightslategrey-manatee-691472.hostingersite.com/storage');

task('deploy:vendors', static function () {
    run('cd {{release_path}}/app && APP_ENV=prod composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist');
});

task('deploy:cache', static function () {
    run('cd {{release_path}}/app && APP_ENV=prod php bin/console cache:clear --no-warmup');
    run('cd {{release_path}}/app && APP_ENV=prod php bin/console cache:warmup');
});

task('deploy:assets', static function () {
    run('cd {{release_path}}/app && APP_ENV=prod php bin/console asset-map:compile');
});

task('deploy:link_webroot', static function () {
    run('rm -rf ~/domains/lightslategrey-manatee-691472.hostingersite.com/public_html');
    run('ln -sfn {{deploy_path}}/current/app/public ~/domains/lightslategrey-manatee-691472.hostingersite.com/public_html');
});

task('deploy:post_cache', static function () {
    run('cd {{deploy_path}}/current/app && APP_ENV=prod php bin/console cache:clear --no-warmup');
    run('cd {{deploy_path}}/current/app && APP_ENV=prod php bin/console cache:warmup');
});

task('deploy', [
    'deploy:info',
    'deploy:setup',
    'deploy:lock',
    'deploy:release',
    'deploy:update_code',
    'deploy:shared',
    'deploy:writable',
    'deploy:vendors',
    'deploy:cache',
    'deploy:assets',
    'deploy:symlink',
    'deploy:link_webroot',
    'deploy:post_cache',
    'deploy:unlock',
    'deploy:cleanup',
    'deploy:success',
]);

after('deploy:failed', 'deploy:unlock');
