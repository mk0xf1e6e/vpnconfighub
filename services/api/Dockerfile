FROM golang:1.26-alpine AS builder
WORKDIR /src
COPY services/api/go.mod services/api/go.sum ./services/api/
WORKDIR /src/services/api
RUN go mod download
COPY services/api ./
RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /out/vpnconfighub-api ./cmd/api

FROM alpine:3.22
RUN addgroup -S app && adduser -S -G app app
COPY --from=builder /out/vpnconfighub-api /usr/local/bin/vpnconfighub-api
USER app
ENV API_PORT=4000
EXPOSE 4000
ENTRYPOINT ["/usr/local/bin/vpnconfighub-api"]
