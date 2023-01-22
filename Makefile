build-and-deploy-staging:
	@make build-staging
	@make deploy-staging

build-staging:
	@echo "Build Stack [STAGING]"
	@cd laravel && composer install -q --no-ansi --no-interaction --no-scripts --no-suggest --no-progress --prefer-dist
	@rm -rf cdk/build/laravel && mkdir -p cdk/build/laravel
	@cp -R laravel/app laravel/bootstrap laravel/config laravel/public laravel/resources laravel/routes laravel/storage laravel/vendor laravel/artisan laravel/artisan-for-lambda.php laravel/composer.json laravel/composer.lock cdk/build/laravel 

deploy-staging:
	@echo "Deploy Stack [STAGING]"
	@cd cdk && npm ci && npm run deploy:staging -- --require-approval never

destroy-staging:
	@echo "Destroy Stack [STAGING]"
	@cd cdk && npm ci && npm run destroy:staging -- --require-approval never	
