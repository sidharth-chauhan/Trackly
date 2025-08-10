package user

import (
	"Trackly/internal/db"
	"Trackly/internal/models"
	"context"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
	"k8s.io/apimachinery/pkg/util/json"
)

// 👇 define a context key type to avoid collisions
type contextKey string

const userIDKey contextKey = "user_id"

// ✅ HandleLogin issues a token after validating email/password
func HandleLogin(w http.ResponseWriter, r *http.Request) {
	// Read request body
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Failed to read request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	// Parse JSON input
	var req LoginRequest
	if err := json.Unmarshal(body, &req); err != nil || req.Email == "" || req.Password == "" {
		http.Error(w, "Invalid email or password", http.StatusBadRequest)
		return
	}

	// Find user by email
	var user models.User
	result := db.DB.Where("email = ?", req.Email).First(&user)
	if result.Error != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Compare hashed password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		http.Error(w, "Invalid email or password", http.StatusUnauthorized)
		return
	}

	// Build claims
	claims := jwt.MapClaims{
		"sub":   user.ID,
		"email": user.Email,
		"exp":   time.Now().Add(24 * time.Hour).Unix(),
	}

	// Sign token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	secret := os.Getenv("JWT_SECRET")

	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		http.Error(w, "Failed to create token", http.StatusInternalServerError)
		return
	}

	// Return token as JSON
	response := map[string]string{"token": tokenString}
	jsonData, err := json.Marshal(response)
	if err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

// ✅ JwtMiddleware validates JWT and puts user_id into context
func JwtMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Get token from header
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			http.Error(w, "Missing or invalid Authorization header", http.StatusUnauthorized)
			return
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")

		// Parse and verify token
		token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return []byte(os.Getenv("JWT_SECRET")), nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Unauthorized: invalid or expired token", http.StatusUnauthorized)
			return
		}

		// Extract user ID from claims
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok || !token.Valid {
			http.Error(w, "Unauthorized: invalid claims", http.StatusUnauthorized)
			return
		}

		userID := claims["sub"]
		ctx := context.WithValue(r.Context(), userIDKey, fmt.Sprintf("%v", userID))
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// ✅ Safe helper to get user ID from context
func GetUserIDFromContext(r *http.Request) (string, bool) {
	userID, ok := r.Context().Value(userIDKey).(string)
	return userID, ok
}

// ✅ LoginRequest struct for /login
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
