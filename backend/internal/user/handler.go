package user

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"

	"openanalytics/internal/db"
	"openanalytics/internal/models" // ✅ fixed import

	"golang.org/x/crypto/bcrypt"
)

// Used to read request JSON
type RegisterRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Handles POST /user/register
func Register(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Failed to read request body", http.StatusBadRequest)
		return
	}

	bodyString := strings.TrimSpace(string(body))
	fmt.Println("Raw JSON input:", bodyString)

	var req RegisterRequest
	err = json.Unmarshal(body, &req)
	if err != nil || req.Email == "" || req.Password == "" {
		http.Error(w, "Invalid email or password", http.StatusBadRequest)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Failed to hash password", http.StatusInternalServerError)
		return
	}

	user := models.User{
		Email:    req.Email,
		Password: string(hashedPassword),
	}

	result := db.DB.Create(&user)
	if result.Error != nil {
		fmt.Println("❌ GORM DB Error:", result.Error)
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "User registered successfully ✅",
	})
}
