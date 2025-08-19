package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"Trackly/internal/db"
	"Trackly/internal/middleware"
	"Trackly/internal/project"
	"Trackly/internal/user"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env only if running locally
	if os.Getenv("RENDER") == "" {
		if err := godotenv.Load(); err != nil {
			log.Println("⚠️ No .env file found, using system environment variables")
		}
	}

	// Check if critical env vars exist
	if os.Getenv("DB_URL") == "" {
		log.Fatal("❌ DB_URL environment variable not set")
	}

	db.ConnectDB()

	//BACKGROUND MONITOR
	go project.MonitorProjects()

	r := mux.NewRouter()

	//  middleware
	r.Use(middleware.CORSMiddleware)

	// Healthcheck
	r.HandleFunc("/healthcheck", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		fmt.Fprint(w, "OpenAnalytics backend is running 🚀")
	}).Methods("GET")

	// Public routes
	r.HandleFunc("/user/register", user.Register).Methods("POST", "OPTIONS")
	r.HandleFunc("/user/login", user.HandleLogin).Methods("POST", "OPTIONS")

	// Project routes (JWT protected)
	projectRouter := r.PathPrefix("/project").Subrouter()
	projectRouter.Use(user.JwtMiddleware)
	projectRouter.HandleFunc("", project.CreateProject).Methods("POST", "OPTIONS")
	projectRouter.HandleFunc("", project.GetProjects).Methods("GET", "OPTIONS")
	projectRouter.HandleFunc("/dashboard", project.GetDashboard).Methods("GET", "OPTIONS")
	projectRouter.HandleFunc("/status", project.CheckProjectStatus).Methods("GET", "OPTIONS")
	projectRouter.HandleFunc("/{id}", project.UpdateProject).Methods("PUT", "OPTIONS")
	projectRouter.HandleFunc("/{id}", project.DeleteProject).Methods("DELETE", "OPTIONS")
	projectRouter.HandleFunc("/{id}", project.GetProjectByID).Methods("GET", "OPTIONS")

	// Use PORT from Render or default to 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("🚀 Trackly backend is running on port %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
