package store

import (
	"context"
	"os"
	"testing"

	"github.com/mk0xf1e6e/vpnconfighub/services/api/internal/auth"
)

func TestUpsertTelegramUserDoesNotDuplicate(t *testing.T) {
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		t.Skip("DATABASE_URL not configured")
	}

	database, err := New(databaseURL)
	if err != nil {
		t.Fatal(err)
	}
	defer database.Close()

	ctx := context.Background()
	if err := database.EnsureSchema(ctx); err != nil {
		t.Skipf("database unavailable: %v", err)
	}

	telegramUser := auth.TelegramUser{ID: 987654321, FirstName: "Test", Username: "test_user"}
	first, err := database.UpsertTelegramUser(ctx, telegramUser)
	if err != nil {
		t.Fatal(err)
	}
	second, err := database.UpsertTelegramUser(ctx, telegramUser)
	if err != nil {
		t.Fatal(err)
	}

	if first.ID != second.ID {
		t.Fatalf("expected repeated authentication to reuse user ID, got %d and %d", first.ID, second.ID)
	}

	if _, _, err := database.CreateSession(ctx, second.ID, 0); err != nil {
		t.Fatal(err)
	}
}
