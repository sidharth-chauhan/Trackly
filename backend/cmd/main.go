package main

import (
	"fmt"
	"log"
	"net/http"

	"openanalytics/internal/db"
	"openanalytics/internal/middleware"
	"openanalytics/internal/project"
	"openanalytics/internal/user"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("❌ Error loading .env file")
	}

	db.ConnectDB()

	r := mux.NewRouter()

	// ✅ Register middleware BEFORE routes
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

	fmt.Println("OpenAnalytics backend is running on port 8080")
	http.ListenAndServe(":8080", r)
}
