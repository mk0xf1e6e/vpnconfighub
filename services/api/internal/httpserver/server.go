package httpserver

import (
	"encoding/json"
	"errors"
	"net/http"
	"os"
	"time"

	"github.com/mk0xf1e6e/vpnconfighub/services/api/internal/auth"
	"github.com/mk0xf1e6e/vpnconfighub/services/api/internal/store"
)

func New() http.Handler {
	database, _ := store.New(os.Getenv("DATABASE_URL"))
	return NewWithStore(database)
}

func NewWithStore(database *store.Store) http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("/health", healthHandler)
	mux.HandleFunc("/api/auth/telegram", telegramAuthHandler(database))
	mux.HandleFunc("/api/demo/dashboard", demoDashboardHandler)
	mux.HandleFunc("/api/demo/usage", demoUsageHandler)
	mux.HandleFunc("/api/demo/catalog", demoCatalogHandler)

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

func telegramAuthHandler(database *store.Store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
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
		if database == nil {
			http.Error(w, "database not configured", http.StatusServiceUnavailable)
			return
		}
		if err := database.EnsureSchema(r.Context()); err != nil {
			http.Error(w, "database unavailable", http.StatusServiceUnavailable)
			return
		}

		user, err := database.UpsertTelegramUser(r.Context(), validated.User)
		if err != nil {
			http.Error(w, "could not load user", http.StatusInternalServerError)
			return
		}

		sessionToken, sessionExpiresAt, err := database.CreateSession(r.Context(), user.ID, 24*time.Hour)
		if err != nil {
			http.Error(w, "could not create session", http.StatusInternalServerError)
			return
		}
		http.SetCookie(w, &http.Cookie{
			Name:     "vpn_session",
			Value:    sessionToken,
			Expires:  sessionExpiresAt,
			MaxAge:   int((24 * time.Hour).Seconds()),
			HttpOnly: true,
			Secure:   os.Getenv("NODE_ENV") == "production",
			SameSite: http.SameSiteLaxMode,
			Path:     "/",
		})

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)

		_ = json.NewEncoder(w).Encode(map[string]any{
			"authenticated": true,
			"user":          user,
		})
	}
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
		w.Header().Set("Access-Control-Allow-Credentials", "true")
	}
}
