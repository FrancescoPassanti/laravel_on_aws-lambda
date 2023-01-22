build-and-deploy-staging:
	@make build-staging
	@make deploy-staging

build-staging:
	@echo "Build lambda [STAGING]"
	@composer install --working-dir=api -q --no-ansi --no-interaction --no-scripts --no-suggest --no-progress --prefer-dist
	@rm -rf cdk/build/laravel && mkdir -p cdk/build/laravel
	@cp -R api/app api/bootstrap api/config api/public api/resources api/routes api/storage api/vendor api/artisan api/artisan-for-lambda.php api/composer.json api/composer.lock cdk/build/laravel 

deploy-staging:
	@echo "Deploy lambda [STAGING]"
	@cd cdk && npm ci && npm run deploy:staging -- --require-approval never
