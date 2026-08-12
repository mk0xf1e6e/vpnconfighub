package main

import (
	"log"
	"net/http"

	"github.com/mk0xf1e6e/vpnconfighub/services/api/internal/config"
	"github.com/mk0xf1e6e/vpnconfighub/services/api/internal/httpserver"
)

func main() {
	cfg := config.Load()

	handler := httpserver.New()

	addr := ":" + cfg.HTTPPort

	log.Printf("API listening on %s", addr)

	if err := http.ListenAndServe(addr, handler); err != nil {
		log.Fatal(err)
	}
}
