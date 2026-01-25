.PHONY: help install dev build start lint format docker-up docker-down docker-logs docker-clean

help:
	@make -qp | awk -F':' '/^[a-zA-Z0-9_-]+:$$/ {print $$1}' | sort

# Local Development
install:
	npm install

dev:
	npm run dev

build:
	npm run build

start:
	npm run start

lint:
	npm run lint

format:
	npx prettier --write .

tree:
	tree -I "node_modules|.nuxt|.git"

# Docker Commands
docker-up:
	docker-compose up -d --build

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

docker-clean:
	docker-compose down --volumes --rmi all