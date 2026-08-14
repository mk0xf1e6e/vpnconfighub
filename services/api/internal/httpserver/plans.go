package httpserver

import "net/http"

type planAvailability struct {
	Status      string `json:"status"`
	Purchasable bool   `json:"purchasable"`
	Reason      string `json:"reason,omitempty"`
}

type planPricing struct {
	Currency string `json:"currency"`
	Amount   *int   `json:"amount"`
	Draft    bool   `json:"draft"`
}

type planEntitlements struct {
	TrafficBytes         *int64         `json:"trafficBytes"`
	TrafficUnlimited     bool           `json:"trafficUnlimited"`
	SpeedMbps            *int           `json:"speedMbps"`
	SpeedUncapped        bool           `json:"speedUncapped"`
	ActiveUsers          *int           `json:"activeUsers"`
	MaxDevices           *int           `json:"maxDevices"`
	MaxConnections       *int           `json:"maxConnections"`
	ConnectionsUnlimited bool           `json:"connectionsUnlimited"`
	DurationDays         int            `json:"durationDays"`
	Limits               map[string]any `json:"limits"`
}

type plan struct {
	ID            string           `json:"id"`
	ProductFamily string           `json:"productFamily"`
	Name          string           `json:"name"`
	Description   string           `json:"description"`
	Protocols     []string         `json:"protocols"`
	Availability  planAvailability `json:"availability"`
	Pricing       planPricing      `json:"pricing"`
	Entitlements  planEntitlements `json:"entitlements"`
}

var plansFixture = []plan{
	newPlan("mtproto-10gb-30d", "mtproto", "MTProto 10 GB", "Telegram MTProto proxy access.", []string{"MTProto"}, 10, 50, 2),
	newPlan("socks5-25gb-30d", "socks5", "SOCKS5 25 GB", "General-purpose SOCKS5 proxy access.", []string{"SOCKS5"}, 25, 100, 3),
	newPlan("http-https-50gb-30d", "http", "HTTP/HTTPS 50 GB", "HTTP proxy access for supported clients.", []string{"HTTP", "HTTPS"}, 50, 100, 5),
	newPlan("v2ray-unlimited-30d", "v2ray", "V2Ray/Xray Unlimited", "V2Ray/Xray client configuration entitlement.", []string{"VLESS + Reality", "VMess", "Shadowsocks", "Trojan", "Hysteria2", "TUIC"}, 0, 0, 2),
}

func newPlan(id, family, name, description string, protocols []string, quotaGB, speedMbps, devices int) plan {
	quota := int64(quotaGB) * 1024 * 1024 * 1024
	speed := speedMbps
	maxDevices := devices
	activeUsers := 1
	connections := 10
	var quotaPtr *int64
	if quotaGB > 0 {
		quotaPtr = &quota
	}
	var speedPtr *int
	if speedMbps > 0 {
		speedPtr = &speed
	}
	return plan{
		ID: id, ProductFamily: family, Name: name, Description: description, Protocols: protocols,
		Availability: planAvailability{Status: "coming_soon", Purchasable: false, Reason: "Provisioning is not connected."},
		Pricing:      planPricing{Currency: "XTR", Amount: nil, Draft: true},
		Entitlements: planEntitlements{
			TrafficBytes: quotaPtr, TrafficUnlimited: quotaGB == 0,
			SpeedMbps: speedPtr, SpeedUncapped: speedMbps == 0,
			ActiveUsers: &activeUsers, MaxDevices: &maxDevices, MaxConnections: &connections,
			ConnectionsUnlimited: false, DurationDays: 30, Limits: map[string]any{},
		},
	}
}

func plansHandler(w http.ResponseWriter, r *http.Request) {
	setCORSHeaders(w, r)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	if r.Method != http.MethodGet {
		writeJSONError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	writeJSON(w, r, http.StatusOK, map[string]any{"plans": plansFixture})
}
