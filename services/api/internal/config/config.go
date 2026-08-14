package config

import (
	"os"
)

type Config struct {
	HTTPPort string
}

func Load() Config {
	port := os.Getenv("API_PORT")
	if port == "" {
		port = os.Getenv("HTTP_PORT")
	}

	if port == "" {
		port = "4000"
	}

	return Config{
		HTTPPort: port,
	}
}
