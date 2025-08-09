package middleware

import (
	"fmt"
	"net/http"
)

func CORSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// ✅ Debug log
		fmt.Println("✅ CORS middleware called:", r.Method, r.URL.Path, "Origin:", r.Header.Get("Origin"))

		// Allow GitHub Pages frontend
		w.Header().Set("Access-Control-Allow-Origin", "https://sidharth-chauhan.github.io")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}
