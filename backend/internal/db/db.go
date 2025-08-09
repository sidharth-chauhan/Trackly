package db

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"openanalytics/internal/models"
)

var DB *gorm.DB

func ConnectDB() {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("❌ Failed to connect to database:", err)
	}

	// ✅ migrate using clean model
	if err := DB.AutoMigrate(&models.User{}); err != nil {
		log.Fatal("❌ AutoMigrate failed:", err)
	}

	err = DB.AutoMigrate(&models.User{}, &models.Project{})
	if err != nil {
		log.Fatal("❌ AutoMigrate failed:", err)
	}

	fmt.Println("✅ Connected to PostgreSQL")
}
