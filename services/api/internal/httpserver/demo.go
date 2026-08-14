package httpserver

import (
	"encoding/json"
	"net/http"
)

type demoDailyUsage struct {
	Date  string `json:"date"`
	Bytes int64  `json:"bytes"`
}

type demoSubscription struct {
	Name          string `json:"name"`
	Status        string `json:"status"`
	QuotaBytes    int64  `json:"quotaBytes"`
	UsedBytes     int64  `json:"usedBytes"`
	DurationDays  int    `json:"durationDays"`
	DaysRemaining int    `json:"daysRemaining"`
	SpeedMbps     int    `json:"speedMbps"`
	Devices       int    `json:"devices"`
}

type demoUsage struct {
	Demo       bool             `json:"demo"`
	TotalBytes int64            `json:"totalBytes"`
	Daily      []demoDailyUsage `json:"daily"`
}

type demoDashboard struct {
	Demo          bool             `json:"demo"`
	Subscription  demoSubscription `json:"subscription"`
	Usage         demoUsage        `json:"usage"`
	Configuration any              `json:"configuration"`
	Nodes         []any            `json:"nodes"`
}

type demoCatalogItem struct {
	ID           string         `json:"id"`
	Name         string         `json:"name"`
	Description  string         `json:"description"`
	Availability string         `json:"availability"`
	Protocols    []string       `json:"protocols"`
	DraftPricing bool           `json:"draftPricing"`
	Prices       map[string]any `json:"prices"`
}

var demoDaily = []demoDailyUsage{
	{Date: "2026-08-08", Bytes: 2147483648},
	{Date: "2026-08-09", Bytes: 3221225472},
	{Date: "2026-08-10", Bytes: 1610612736},
	{Date: "2026-08-11", Bytes: 4294967296},
	{Date: "2026-08-12", Bytes: 2684354560},
	{Date: "2026-08-13", Bytes: 3758096384},
	{Date: "2026-08-14", Bytes: 1073741824},
}

func demoUsageFixture() demoUsage {
	return demoUsage{Demo: true, TotalBytes: 19797114880, Daily: demoDaily}
}

func demoDashboardHandler(w http.ResponseWriter, r *http.Request) {
	writeDemo(w, r, demoDashboard{
		Demo:         true,
		Subscription: demoSubscription{Name: "Demo subscription", Status: "demo", QuotaBytes: 53687091200, UsedBytes: 19797114880, DurationDays: 30, DaysRemaining: 22, SpeedMbps: 100, Devices: 2},
		Usage:        demoUsageFixture(), Configuration: nil, Nodes: []any{},
	})
}

func demoUsageHandler(w http.ResponseWriter, r *http.Request) { writeDemo(w, r, demoUsageFixture()) }

func demoCatalogHandler(w http.ResponseWriter, r *http.Request) {
	items := []demoCatalogItem{
		{ID: "mtproto", Name: "MTProto Proxy", Description: "Telegram-focused proxy access.", Availability: "planned", Protocols: []string{"MTProto"}, DraftPricing: true, Prices: draftPrices()},
		{ID: "socks5", Name: "SOCKS5 Proxy", Description: "General-purpose proxy endpoint.", Availability: "planned", Protocols: []string{"SOCKS5"}, DraftPricing: true, Prices: draftPrices()},
		{ID: "http", Name: "HTTP / HTTPS Proxy", Description: "HTTP proxy access for supported clients.", Availability: "planned", Protocols: []string{"HTTP", "HTTPS"}, DraftPricing: true, Prices: draftPrices()},
		{ID: "v2ray", Name: "V2Ray / Xray Config", Description: "Choose a client protocol for a future generated config.", Availability: "planned", Protocols: []string{"VLESS + Reality", "VMess", "Shadowsocks", "Trojan", "Hysteria2", "TUIC"}, DraftPricing: true, Prices: draftPrices()},
	}
	writeDemo(w, r, map[string]any{"demo": true, "items": items})
}

func draftPrices() map[string]any { return map[string]any{"7": nil, "30": nil, "90": nil, "365": nil} }

func writeDemo(w http.ResponseWriter, r *http.Request, value any) {
	if r.Method != http.MethodGet {
		writeJSONError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	w.Header().Set("Cache-Control", "no-store")
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(value)
}

func writeJSONError(w http.ResponseWriter, status int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(map[string]string{"error": message})
}
