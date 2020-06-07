install:
	npm install

lint:
	npx eslint .

develop:
	npx webpack-dev-server

build:
	rm -rf dist
	NODE_ENV=production npx webpack
	cp -r xml dist/xml

buildserver:
	npx babel ./src/server --out-dir ./src/buildserver
