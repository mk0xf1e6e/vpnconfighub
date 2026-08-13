package httpserver

import (
	"encoding/json"
	"errors"
	"net/http"
	"os"

	"github.com/mk0xf1e6e/vpnconfighub/services/api/internal/auth"
)

func New() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("/health", healthHandler)
	mux.HandleFunc("/api/auth/telegram", telegramAuthHandler)

	return mux
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	_ = json.NewEncoder(w).Encode(map[string]string{
		"status": "ok",
	})
}

type telegramAuthRequest struct {
	InitData string `json:"initData"`
}

func telegramAuthHandler(w http.ResponseWriter, r *http.Request) {
	setCORSHeaders(w, r)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	r.Body = http.MaxBytesReader(w, r.Body, 64*1024)
	var req telegramAuthRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.InitData == "" {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}

	validated, err := auth.ValidateInitData(req.InitData, os.Getenv("TELEGRAM_BOT_TOKEN"))
	if err != nil {
		status := http.StatusUnauthorized
		if errors.Is(err, auth.ErrMissingBotToken) {
			status = http.StatusInternalServerError
		}
		http.Error(w, err.Error(), status)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	_ = json.NewEncoder(w).Encode(map[string]any{
		"user": map[string]any{
			"id":         validated.User.ID,
			"first_name": validated.User.FirstName,
			"last_name":  validated.User.LastName,
			"username":   validated.User.Username,
			"photo_url":  validated.User.PhotoURL,
		},
		"auth_date":     validated.AuthDate,
		"expires_at":    validated.ExpiresAt,
		"hash_verified": validated.HashVerified,
	})
}

func setCORSHeaders(w http.ResponseWriter, r *http.Request) {
	origin := r.Header.Get("Origin")
	allowedOrigin := os.Getenv("WEB_ORIGIN")
	if allowedOrigin == "" {
		allowedOrigin = "http://localhost:3000"
	}
	if origin == allowedOrigin {
		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Vary", "Origin")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	}
}
