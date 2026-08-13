package httpserver

import (
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"
)

func TestTelegramAuthHandlerRequiresBotToken(t *testing.T) {
	t.Setenv("TELEGRAM_BOT_TOKEN", "")

	req := httptest.NewRequest(http.MethodPost, "/api/auth/telegram", strings.NewReader(`{"initData":"test"}`))
	recorder := httptest.NewRecorder()

	New().ServeHTTP(recorder, req)

	if recorder.Code != http.StatusInternalServerError {
		t.Fatalf("expected 500, got %d", recorder.Code)
	}
}

func TestTelegramAuthHandlerRejectsInvalidMethod(t *testing.T) {
	_ = os.Unsetenv("TELEGRAM_BOT_TOKEN")
	req := httptest.NewRequest(http.MethodGet, "/api/auth/telegram", nil)
	recorder := httptest.NewRecorder()

	New().ServeHTTP(recorder, req)

	if recorder.Code != http.StatusMethodNotAllowed {
		t.Fatalf("expected 405, got %d", recorder.Code)
	}
}
