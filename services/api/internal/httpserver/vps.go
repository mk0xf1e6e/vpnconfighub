package httpserver

import (
	"encoding/json"
	"net/http"
)

const demoWalletBalance = 1000
const demoVPSPrice = 50

func demoVPSPurchaseHandler(w http.ResponseWriter, r *http.Request) {
	setCORSHeaders(w, r)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	if r.Method != http.MethodPost {
		writeJSONError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	var request struct {
		Region string `json:"region"`
	}
	if err := json.NewDecoder(http.MaxBytesReader(w, r.Body, 4096)).Decode(&request); err != nil {
		writeJSONError(w, http.StatusBadRequest, "invalid request")
		return
	}
	if request.Region == "" {
		request.Region = "demo-europe"
	}
	token, err := randomToken(10)
	if err != nil {
		writeJSONError(w, http.StatusInternalServerError, "could not generate demo VPS")
		return
	}
	writeJSON(w, r, http.StatusOK, map[string]any{
		"demo":    true,
		"payment": map[string]any{"demo": true, "status": "paid", "provider": "demo_wallet", "paymentId": "demo_vps_payment_" + token, "amount": demoVPSPrice, "currency": "DEMO"},
		"wallet":  map[string]any{"demo": true, "balance": demoWalletBalance - demoVPSPrice, "currency": "DEMO"},
		"vps":     map[string]any{"demo": true, "status": "active", "plan": "Demo VPS", "region": request.Region, "address": "demo-vps-" + token + ".vpnconfighub.local", "username": "demo", "password": token, "note": "Demo VPS only. No real server was provisioned."},
	})
}

func demoWalletHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeJSONError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	writeJSON(w, r, http.StatusOK, map[string]any{"demo": true, "balance": demoWalletBalance, "currency": "DEMO"})
}
