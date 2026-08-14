package httpserver

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"
)

func TestDemoEndpoints(t *testing.T) {
	for _, path := range []string{"/api/demo/dashboard", "/api/demo/usage", "/api/demo/catalog"} {
		recorder := httptest.NewRecorder()
		New().ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, path, nil))
		if recorder.Code != http.StatusOK || recorder.Header().Get("Cache-Control") != "no-store" {
			t.Fatalf("%s: status/cache: %d/%q", path, recorder.Code, recorder.Header().Get("Cache-Control"))
		}
		var body map[string]any
		if err := json.Unmarshal(recorder.Body.Bytes(), &body); err != nil || body["demo"] != true {
			t.Fatalf("%s: invalid demo response: %v", path, err)
		}
	}
}

func TestDemoEndpointsRejectNonGet(t *testing.T) {
	recorder := httptest.NewRecorder()
	New().ServeHTTP(recorder, httptest.NewRequest(http.MethodPost, "/api/demo/usage", nil))
	if recorder.Code != http.StatusMethodNotAllowed || !strings.Contains(recorder.Header().Get("Content-Type"), "application/json") {
		t.Fatalf("expected JSON 405, got %d %q", recorder.Code, recorder.Header().Get("Content-Type"))
	}
}

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
