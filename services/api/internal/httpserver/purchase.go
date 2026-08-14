package httpserver

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"net/http"
)

type demoPurchaseRequest struct {
	ProductFamily string `json:"productFamily"`
	Protocol      string `json:"protocol"`
	Quota         any    `json:"quota"`
	Speed         any    `json:"speed"`
	DurationDays  int    `json:"durationDays"`
	Devices       int    `json:"devices"`
}

func demoPurchaseHandler(w http.ResponseWriter, r *http.Request) {
	setCORSHeaders(w, r)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	if r.Method != http.MethodPost {
		writeJSONError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	var request demoPurchaseRequest
	if err := json.NewDecoder(http.MaxBytesReader(w, r.Body, 16*1024)).Decode(&request); err != nil || request.ProductFamily == "" || request.Protocol == "" {
		writeJSONError(w, http.StatusBadRequest, "product family and protocol are required")
		return
	}
	token, err := randomToken(12)
	if err != nil {
		writeJSONError(w, 500, "could not generate demo proxy")
		return
	}
	secret, err := randomToken(18)
	if err != nil {
		writeJSONError(w, 500, "could not generate demo proxy")
		return
	}
	writeJSON(w, r, http.StatusOK, map[string]any{
		"demo":    true,
		"payment": map[string]any{"demo": true, "status": "paid", "provider": "demo", "paymentId": "demo_payment_" + token},
		"proxy":   map[string]any{"demo": true, "status": "active", "protocol": request.Protocol, "address": "demo-proxy.vpnconfighub.local", "port": 443, "username": "demo_" + token, "password": secret, "note": "Demo credentials only. This proxy is not connected to a live server."},
	})
}

func randomToken(size int) (string, error) {
	b := make([]byte, size)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}
