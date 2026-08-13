package auth

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"net/url"
	"sort"
	"strconv"
	"strings"
	"testing"
	"time"
)

const testBotToken = "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"

func buildValidInitData(t *testing.T, botToken string, authDate int64, userObj TelegramUser) string {
	t.Helper()

	userJSON, err := json.Marshal(userObj)
	if err != nil {
		t.Fatalf("marshal user: %v", err)
	}

	params := url.Values{}
	params.Set("user", string(userJSON))
	params.Set("auth_date", strconv.FormatInt(authDate, 10))
	params.Set("query_id", "AAH1234")

	keys := make([]string, 0, len(params))
	for k := range params {
		keys = append(keys, k)
	}
	sort.Strings(keys)

	var pairs []string
	for _, k := range keys {
		pairs = append(pairs, k+"="+params.Get(k))
	}
	dataCheckString := strings.Join(pairs, "\n")

	secretKeyHash := hmac.New(sha256.New, []byte("WebAppData"))
	secretKeyHash.Write([]byte(botToken))
	secretKey := secretKeyHash.Sum(nil)

	calculated := hmac.New(sha256.New, secretKey)
	calculated.Write([]byte(dataCheckString))
	hashHex := hex.EncodeToString(calculated.Sum(nil))

	params.Set("hash", hashHex)
	return params.Encode()
}

func TestValidateInitData_Success(t *testing.T) {
	user := TelegramUser{ID: 42, FirstName: "Alice", Username: "alice"}
	now := time.Now().Unix()
	initData := buildValidInitData(t, testBotToken, now, user)

	res, err := ValidateInitData(initData, testBotToken)
	if err != nil {
		t.Fatalf("expected success, got error: %v", err)
	}
	if !res.HashVerified {
		t.Error("HashVerified should be true")
	}
	if res.User.ID != 42 {
		t.Errorf("expected user ID 42, got %d", res.User.ID)
	}
	if res.User.FirstName != "Alice" {
		t.Errorf("expected first name Alice, got %s", res.User.FirstName)
	}
}

func TestValidateInitData_BadHash(t *testing.T) {
	user := TelegramUser{ID: 42, FirstName: "Alice"}
	now := time.Now().Unix()
	initData := buildValidInitData(t, testBotToken, now, user)

	parsed, _ := url.ParseQuery(initData)
	parsed.Set("hash", "deadbeef")
	res, err := ValidateInitData(parsed.Encode(), testBotToken)
	if err == nil {
		t.Fatalf("expected error, got result: %+v", res)
	}
	if err != ErrHashMismatch {
		t.Errorf("expected ErrHashMismatch, got: %v", err)
	}
}

func TestValidateInitData_WrongSecret(t *testing.T) {
	user := TelegramUser{ID: 42, FirstName: "Alice"}
	now := time.Now().Unix()
	initData := buildValidInitData(t, testBotToken, now, user)

	res, err := ValidateInitData(initData, "wrong-token")
	if err == nil {
		t.Fatalf("expected error, got result: %+v", res)
	}
	if err != ErrHashMismatch {
		t.Errorf("expected ErrHashMismatch, got: %v", err)
	}
}

func TestValidateInitData_Expired(t *testing.T) {
	user := TelegramUser{ID: 42, FirstName: "Alice"}
	expired := time.Now().Add(-10 * time.Minute).Unix()
	initData := buildValidInitData(t, testBotToken, expired, user)

	res, err := ValidateInitData(initData, testBotToken)
	if err == nil {
		t.Fatalf("expected error, got result: %+v", res)
	}
	if err != ErrInitDataExpired {
		t.Errorf("expected ErrInitDataExpired, got: %v", err)
	}
}

func TestValidateInitData_Future(t *testing.T) {
	user := TelegramUser{ID: 42, FirstName: "Alice"}
	future := time.Now().Add(2 * time.Minute).Unix()
	initData := buildValidInitData(t, testBotToken, future, user)

	res, err := ValidateInitData(initData, testBotToken)
	if err != ErrInitDataExpired {
		t.Fatalf("expected ErrInitDataExpired, got: %v / %+v", err, res)
	}
}

func TestValidateInitData_MissingUser(t *testing.T) {
	now := time.Now().Unix()
	initData := buildValidInitData(t, testBotToken, now, TelegramUser{})

	res, err := ValidateInitData(initData, testBotToken)
	if err != ErrMissingUser {
		t.Fatalf("expected ErrMissingUser, got: %v / %+v", err, res)
	}
}

func TestValidateInitData_EmptyBotToken(t *testing.T) {
	user := TelegramUser{ID: 42, FirstName: "Alice"}
	now := time.Now().Unix()
	initData := buildValidInitData(t, testBotToken, now, user)

	res, err := ValidateInitData(initData, "")
	if err != ErrMissingBotToken {
		t.Fatalf("expected ErrMissingBotToken, got: %v / %+v", err, res)
	}
}

func TestValidateInitData_MissingHash(t *testing.T) {
	user := TelegramUser{ID: 42, FirstName: "Alice"}
	now := time.Now().Unix()
	initData := buildValidInitData(t, testBotToken, now, user)

	parsed, _ := url.ParseQuery(initData)
	parsed.Del("hash")
	res, err := ValidateInitData(parsed.Encode(), testBotToken)
	if err != ErrMissingHash {
		t.Fatalf("expected ErrMissingHash, got: %v / %+v", err, res)
	}
}

func TestValidateInitData_EmptyInitData(t *testing.T) {
	res, err := ValidateInitData("", testBotToken)
	if err != ErrInvalidInitData {
		t.Fatalf("expected ErrInvalidInitData, got: %v / %+v", err, res)
	}
}
