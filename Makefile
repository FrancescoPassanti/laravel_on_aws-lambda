build-and-deploy-staging:
	@make build-staging
	@make deploy-staging

build-staging:
	@echo "Build lambda [STAGING]"
	@cd laravel && composer install -q --no-ansi --no-interaction --no-scripts --no-suggest --no-progress --prefer-dist
	@rm -rf cdk/build/laravel && mkdir -p cdk/build/laravel
	@cp -R laravel/app laravel/bootstrap laravel/config laravel/public laravel/resources laravel/routes laravel/storage laravel/vendor laravel/artisan laravel/artisan-for-lambda.php laravel/composer.json laravel/composer.lock cdk/build/laravel 

deploy-staging:
	@echo "Deploy lambda [STAGING]"
	@cd cdk && npm ci && npm run deploy:staging -- --require-approval never
