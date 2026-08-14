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

func TestOpenAPIRoutes(t *testing.T) {
	for _, path := range []string{"/openapi.json", "/swagger"} {
		recorder := httptest.NewRecorder()
		New().ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, path, nil))
		if recorder.Code != http.StatusOK {
			t.Fatalf("%s: expected 200, got %d", path, recorder.Code)
		}
	}
}

func TestPlansEndpoint(t *testing.T) {
	recorder := httptest.NewRecorder()
	New().ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, "/api/plans", nil))
	if recorder.Code != http.StatusOK || recorder.Header().Get("Cache-Control") != "no-store" {
		t.Fatalf("expected cache-free 200, got %d %q", recorder.Code, recorder.Header().Get("Cache-Control"))
	}
	var body struct {
		Plans []struct {
			ID           string `json:"id"`
			Entitlements struct {
				TrafficBytes     *int64 `json:"trafficBytes"`
				TrafficUnlimited bool   `json:"trafficUnlimited"`
				SpeedMbps        *int   `json:"speedMbps"`
				SpeedUncapped    bool   `json:"speedUncapped"`
			} `json:"entitlements"`
		} `json:"plans"`
	}
	if err := json.Unmarshal(recorder.Body.Bytes(), &body); err != nil || len(body.Plans) != 4 {
		t.Fatalf("unexpected plans response: %v", err)
	}
	last := body.Plans[len(body.Plans)-1]
	if last.Entitlements.TrafficBytes != nil || !last.Entitlements.TrafficUnlimited || last.Entitlements.SpeedMbps != nil || !last.Entitlements.SpeedUncapped {
		t.Fatalf("unlimited plan flags invalid: %+v", last.Entitlements)
	}
}

func TestPlansRejectsNonGet(t *testing.T) {
	recorder := httptest.NewRecorder()
	New().ServeHTTP(recorder, httptest.NewRequest(http.MethodPost, "/api/plans", nil))
	if recorder.Code != http.StatusMethodNotAllowed {
		t.Fatalf("expected 405, got %d", recorder.Code)
	}
}

func TestDemoPurchase(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/api/demo/purchase", strings.NewReader(`{"productFamily":"mtproto","protocol":"MTProto"}`))
	recorder := httptest.NewRecorder()
	demoPurchaseHandler(recorder, req)
	if recorder.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d: %s", recorder.Code, recorder.Body.String())
	}
	var body map[string]any
	if err := json.Unmarshal(recorder.Body.Bytes(), &body); err != nil || body["demo"] != true {
		t.Fatalf("invalid demo purchase response: %v", err)
	}
}

func TestOpenAPISpecContainsDemoPaths(t *testing.T) {
	recorder := httptest.NewRecorder()
	New().ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, "/openapi.json", nil))
	body := recorder.Body.String()
	for _, path := range []string{"/health", "/api/demo/dashboard", "/api/demo/usage", "/api/demo/catalog"} {
		if !strings.Contains(body, path) {
			t.Fatalf("OpenAPI spec missing %s", path)
		}
	}
	if !strings.Contains(body, "/api/plans") {
		t.Fatal("OpenAPI spec missing /api/plans")
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
