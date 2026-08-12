.PHONY: web check-web

web:
	./scripts/dev/web.sh

check-web:
	./scripts/test/frontend.sh