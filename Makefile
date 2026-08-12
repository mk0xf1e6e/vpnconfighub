.PHONY: web check-web api check-api

web:
	./scripts/dev/web.sh

check-web:
	./scripts/test/frontend.sh

api:
	./scripts/dev/api.sh

check-api:
	./scripts/test/backend.sh
