package db

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"Trackly/internal/models"
)

var DB *gorm.DB

func ConnectDB() {
	// Get database URL from environment variable
	dsn := os.Getenv("DB_URL")
	if dsn == "" {
		log.Fatal("❌ DB_URL environment variable not set")
	}

	// Connect to PostgreSQL
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("❌ Failed to connect to database:", err)
	}

	// Run database migrations
	err = DB.AutoMigrate(&models.User{}, &models.Project{})
	if err != nil {
		log.Fatal("❌ AutoMigrate failed:", err)
	}

	fmt.Println("✅ Connected to PostgreSQL")
}
