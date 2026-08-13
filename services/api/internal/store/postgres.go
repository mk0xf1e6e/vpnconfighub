package store

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"database/sql"
	"encoding/base64"
	"errors"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/mk0xf1e6e/vpnconfighub/services/api/internal/auth"
)

var ErrNotConfigured = errors.New("database not configured")

type User struct {
	ID         int64  `json:"id"`
	TelegramID int64  `json:"telegramId"`
	FirstName  string `json:"firstName"`
	LastName   string `json:"lastName,omitempty"`
	Username   string `json:"username,omitempty"`
	PhotoURL   string `json:"photoUrl,omitempty"`
}

type Store struct {
	db *sql.DB
}

func New(databaseURL string) (*Store, error) {
	if databaseURL == "" {
		return nil, ErrNotConfigured
	}

	db, err := sql.Open("pgx", databaseURL)
	if err != nil {
		return nil, err
	}

	return &Store{db: db}, nil
}

func (s *Store) Close() error {
	return s.db.Close()
}

func (s *Store) EnsureSchema(ctx context.Context) error {
	const schema = `
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  telegram_id BIGINT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL DEFAULT '',
  username TEXT NOT NULL DEFAULT '',
  photo_url TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS sessions (
  token_hash BYTEA PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON sessions(expires_at);
`
	_, err := s.db.ExecContext(ctx, schema)
	return err
}

func (s *Store) UpsertTelegramUser(ctx context.Context, telegramUser auth.TelegramUser) (User, error) {
	var user User
	err := s.db.QueryRowContext(ctx, `
INSERT INTO users (telegram_id, first_name, last_name, username, photo_url)
VALUES ($1, $2, $3, $4, $5)
ON CONFLICT (telegram_id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  username = EXCLUDED.username,
  photo_url = EXCLUDED.photo_url,
  updated_at = NOW()
RETURNING id, telegram_id, first_name, last_name, username, photo_url
`, telegramUser.ID, telegramUser.FirstName, telegramUser.LastName, telegramUser.Username, telegramUser.PhotoURL).
		Scan(&user.ID, &user.TelegramID, &user.FirstName, &user.LastName, &user.Username, &user.PhotoURL)
	return user, err
}

func (s *Store) CreateSession(ctx context.Context, userID int64, lifetime time.Duration) (string, time.Time, error) {
	rawToken := make([]byte, 32)
	if _, err := rand.Read(rawToken); err != nil {
		return "", time.Time{}, err
	}

	token := base64.RawURLEncoding.EncodeToString(rawToken)
	tokenHash := sha256.Sum256(rawToken)
	expiresAt := time.Now().Add(lifetime)
	_, err := s.db.ExecContext(ctx,
		`INSERT INTO sessions (token_hash, user_id, expires_at) VALUES ($1, $2, $3)`,
		tokenHash[:], userID, expiresAt,
	)
	return token, expiresAt, err
}
