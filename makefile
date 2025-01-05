start:
	docker-compose up -d --build

stop:
	docker-compose down

rebuild:
	docker-compose up -d --build

build:
	docker-compose build

migrate:
	docker-compose exec app yarn migrate up
