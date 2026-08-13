package auth

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"net/url"
	"sort"
	"strconv"
	"strings"
	"time"
)

func decodeJSONField(data string, v interface{}) error {
	return json.Unmarshal([]byte(data), v)
}

type TelegramUser struct {
	ID        int64  `json:"id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name,omitempty"`
	Username  string `json:"username,omitempty"`
	PhotoURL  string `json:"photo_url,omitempty"`
}

type ValidatedInitData struct {
	User         TelegramUser `json:"user"`
	AuthDate     int64        `json:"auth_date"`
	ExpiresAt    int64        `json:"expires_at"`
	HashVerified bool         `json:"hash_verified"`
}

var (
	ErrMissingBotToken = errors.New("bot token not configured")
	ErrInvalidInitData = errors.New("invalid initData")
	ErrHashMismatch    = errors.New("initData hash mismatch")
	ErrInitDataExpired = errors.New("initData expired")
	ErrMissingHash     = errors.New("initData missing hash")
	ErrMissingUser     = errors.New("initData missing user")
)

const initDataTTL = 5 * time.Minute

func ValidateInitData(initData, botToken string) (*ValidatedInitData, error) {
	if botToken == "" {
		return nil, ErrMissingBotToken
	}

	if initData == "" {
		return nil, ErrInvalidInitData
	}

	parsed, err := url.ParseQuery(initData)
	if err != nil {
		return nil, ErrInvalidInitData
	}

	hash := parsed.Get("hash")
	if hash == "" {
		return nil, ErrMissingHash
	}

	authDateStr := parsed.Get("auth_date")
	authDate, err := strconv.ParseInt(authDateStr, 10, 64)
	if err != nil {
		return nil, ErrInvalidInitData
	}

	now := time.Now().Unix()
	if authDate > now || now-authDate > int64(initDataTTL.Seconds()) {
		return nil, ErrInitDataExpired
	}

	keys := make([]string, 0, len(parsed))
	for k := range parsed {
		if k == "hash" {
			continue
		}
		keys = append(keys, k)
	}
	sort.Strings(keys)

	var pairs []string
	for _, k := range keys {
		pairs = append(pairs, k+"="+parsed.Get(k))
	}
	dataCheckString := strings.Join(pairs, "\n")

	secretKeyHash := hmac.New(sha256.New, []byte("WebAppData"))
	secretKeyHash.Write([]byte(botToken))
	secretKey := secretKeyHash.Sum(nil)

	calculatedHash := hmac.New(sha256.New, secretKey)
	calculatedHash.Write([]byte(dataCheckString))
	calculatedBytes := calculatedHash.Sum(nil)

	providedHash, err := hex.DecodeString(hash)
	if err != nil {
		return nil, ErrInvalidInitData
	}

	if !hmac.Equal(calculatedBytes, providedHash) {
		return nil, ErrHashMismatch
	}

	user := TelegramUser{}
	if userJSON := parsed.Get("user"); userJSON != "" {
		if err := decodeJSONField(userJSON, &user); err != nil {
			return nil, ErrInvalidInitData
		}
	}
	if user.ID == 0 {
		return nil, ErrMissingUser
	}

	return &ValidatedInitData{
		User:         user,
		AuthDate:     authDate,
		ExpiresAt:    authDate + int64(initDataTTL.Seconds()),
		HashVerified: true,
	}, nil
}
