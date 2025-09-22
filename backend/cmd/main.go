package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"Trackly/internal/middleware"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env locally (optional)
	_ = godotenv.Load()

	// Setup router
	r := mux.NewRouter()
	r.Use(middleware.CORSMiddleware)

	// Healthcheck
	r.HandleFunc("/healthcheck", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		fmt.Fprint(w, "Trackly backend is running 🚀 (no DB connected)")
	}).Methods("GET")

	// Example public route
	r.HandleFunc("/user/login", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		fmt.Fprint(w, "✅ Login route working (mock, no DB)")
	}).Methods("POST")

	// Example protected route (just demo, no JWT check here)
	r.HandleFunc("/project", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		fmt.Fprint(w, "✅ Project route working (mock, no DB)")
	}).Methods("GET")

	// Port (Vercel provides PORT automatically, default 8080 for local)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("🚀 Trackly backend is running on port %s (DB disabled)\n", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
