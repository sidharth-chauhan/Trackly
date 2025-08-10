package project

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"openanalytics/internal/db"
	"openanalytics/internal/models"
	"openanalytics/internal/user"
	"openanalytics/internal/utils"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/mux"
)

// project - post
func CreateProject(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body) //json response
	if err != nil {
		http.Error(w, "Failed to read request body", http.StatusBadRequest)
		return
	}
	//variable input
	var input struct {
		Name        string `json:"name"`
		Description string `json:"description"`
		Link        string `json:"link"`
	}
	err = json.Unmarshal(body, &input)
	if err != nil || input.Name == "" {
		http.Error(w, "Invalid input data", http.StatusBadRequest)
		return
	}
	// Step 3: Get user_id from context (from JWT middleware)
	userIDStr, ok := user.GetUserIDFromContext(r)
	if !ok || userIDStr == "" {
		http.Error(w, "User ID not found in context", http.StatusUnauthorized)
		return
	}

	userIDUint64, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusInternalServerError)
		return
	}
	userID := uint(userIDUint64)

	// Now safe to use userID below
	project := models.Project{
		Name:        input.Name,
		Description: input.Description,
		Link:        input.Link,

		UserID: uint(userID),
	}

	//saving to db
	result := db.DB.Create(&project)
	if result.Error != nil {
		http.Error(w, "Failed to create project", http.StatusInternalServerError)
		return
	}

	//response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)

	json.NewEncoder(w).Encode(project)
}

// get projects - get
func GetProjects(w http.ResponseWriter, r *http.Request) {
	// Step 1: Get user ID from context
	userIDStr, ok := user.GetUserIDFromContext(r)
	if !ok || userIDStr == "" {
		http.Error(w, "User ID not found in context", http.StatusUnauthorized)
		return
	}

	parsedID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusInternalServerError)
		return
	}
	userID := uint(parsedID)

	// Step 2: Fetch all projects for this user
	var projects []models.Project
	result := db.DB.Where("user_id = ?", userID).Find(&projects)
	if result.Error != nil {
		http.Error(w, "Failed to fetch projects", http.StatusInternalServerError)
		return
	}

	// Step 3: Respond with JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(projects)
}

// GetProjectByID-get
func GetProjectByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	projectIDstr := vars["id"]

	projectID, err := strconv.Atoi(projectIDstr)
	if err != nil {
		http.Error(w, "Invalid project ID", http.StatusBadRequest)
		return
	}
	//user_id from context
	userIDstr, ok := user.GetUserIDFromContext(r)
	if !ok || userIDstr == "" {
		http.Error(w, "User ID not found in context", http.StatusUnauthorized)
		return
	}

	userID, err := strconv.Atoi(userIDstr)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusInternalServerError)
		return
	}

	//project by id
	var project []models.Project
	result := db.DB.Where("id = ? AND user_id = ?", projectID, userID).Find(&project)
	if result.Error != nil {
		http.Error(w, "Failed to fetch project", http.StatusInternalServerError)
		return
	}

	//returning json
	jsonData, err := json.Marshal(project)
	if err != nil {
		http.Error(w, "Failed to encode project data", http.StatusInternalServerError)
		return
	}
	//response
	w.Header().Set("content-type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)

}

// updateProejct by id - post
func UpdateProject(w http.ResponseWriter, r *http.Request) {
	//project id by url
	vars := mux.Vars(r)
	projectIDstr := vars["id"]
	projectID, err := strconv.Atoi(projectIDstr)
	if err != nil {
		http.Error(w, "Invalid project ID", http.StatusBadRequest)
		return
	}
	//user_id from context
	userIDstr, ok := user.GetUserIDFromContext(r)
	if !ok || userIDstr == "" {
		http.Error(w, "User ID not found in context", http.StatusUnauthorized)
		return
	}
	userID, err := strconv.Atoi(userIDstr)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusInternalServerError)
		return
	}

	//body reading
	body, err := ioutil.ReadAll(r.Body) //returns json
	if err != nil {
		http.Error(w, "Failed to read request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	var input struct {
		Name        string `jsopn:"name"`
		Description string `json:"description"`
	}
	err = json.Unmarshal(body, &input)
	if err != nil || input.Name == "" {
		http.Error(w, "Invalid input data", http.StatusBadRequest)
		return
	}
	//finding data from db
	var project models.Project
	result := db.DB.Where("id = ? AND user_id = ?", projectID, userID).First(&project)
	if result.Error != nil {
		http.Error(w, "Project not found", http.StatusNotFound)
		return
	}
	project.Name = input.Name
	project.Description = input.Description
	//save
	saveResult := db.DB.Save(&project)
	if saveResult.Error != nil {
		http.Error(w, "Failed to update project", http.StatusInternalServerError)
		return
	}
	//returning json data
	josnData, err := json.Marshal(project)
	if err != nil {
		http.Error(w, "Failed to encode project data", http.StatusInternalServerError)
		return
	}
	//response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(josnData)

}

// delete -project
func DeleteProject(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	projectIDstr := vars["id"]
	projectID, err := strconv.Atoi(projectIDstr)
	if err != nil {
		http.Error(w, "Invalid project ID", http.StatusBadRequest)
		return
	}

	//userid from context (jwt)
	userIDstr, ok := user.GetUserIDFromContext(r)
	if !ok || userIDstr == "" {
		http.Error(w, "User ID not found in context", http.StatusUnauthorized)
		return
	}
	userID, err := strconv.Atoi(userIDstr)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusInternalServerError)
		return
	}
	//checking
	var project models.Project
	result := db.DB.Where("id = ? AND user_id=?", projectID, userID).First(&project)
	if result.Error != nil {
		http.Error(w, "Project not found", http.StatusNotFound)
		return
	}

	//delete the project
	deleteResult := db.DB.Delete(&project)
	if deleteResult.Error != nil {
		http.Error(w, "Failed to delete project", http.StatusInternalServerError)
		return
	}

	//response
	w.Header().Set("content-type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message":"Project deleted successfully"}`))

}

//dashboard data

type dashboardData struct {
	TotalProjects int    `json:"total_projects"`
	LatestProject string `json:"latest_projects"`
	LastUpdated   string `json:"last_updated"`
}

func GetDashboard(w http.ResponseWriter, r *http.Request) {
	// Get user ID from JWT context
	userIDStr, ok := user.GetUserIDFromContext(r)
	if !ok || userIDStr == "" {
		http.Error(w, "User ID not found in context", http.StatusUnauthorized)
		return
	}
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusInternalServerError)
		return
	}
	//all projects of this user
	var projects []models.Project
	result := db.DB.Where("user_id=?", userID).Find(&projects)
	if result.Error != nil {
		http.Error(w, "Failed to fetch projects", http.StatusInternalServerError)
		return
	}
	//count
	count := len(projects)

	//latest
	var latestProject models.Project
	db.DB.Where("user_id = ?", userID).Order("created_at desc").First(&latestProject)

	//last updated
	var lastUpdated models.Project
	db.DB.Where("user_id = ?", userID).Order("updated_at desc").First(&lastUpdated)

	//dashboard response
	data := dashboardData{
		TotalProjects: count,
		LatestProject: latestProject.Name,
		LastUpdated:   lastUpdated.UpdatedAt.Format("2006-01-02 15:04:05"),
	}
	// Convert to JSON
	jsonData, err := json.Marshal(data)
	if err != nil {
		http.Error(w, "Failed to encode dashboard data", http.StatusInternalServerError)
		return
	}

	//response
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

//project status

type ProjectStatus struct {
	Name      string `json:"name"`
	Link      string `json:"link"`
	Status    string `json:"status"`
	Code      int    `json:"code"`
	UpdatedAt string `json:"updated_at"`
}

func CheckProjectStatus(w http.ResponseWriter, r *http.Request) {
	//user_id by jwt
	userIDstr, ok := user.GetUserIDFromContext(r)
	if !ok || userIDstr == "" {
		http.Error(w, "User ID not found in context", http.StatusUnauthorized)
		return
	}
	userID, err := strconv.Atoi(userIDstr)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusInternalServerError)
		return
	}

	//project from db
	var projects []models.Project
	result := db.DB.Where("user_id=?", userID).Find(&projects)
	if result.Error != nil {
		http.Error(w, "Failed to fetch projects", http.StatusInternalServerError)
		return
	}
	//adding
	var projectList []ProjectStatus

	for _, p := range projects {
		if strings.TrimSpace(p.Link) == "" {
			continue // ⛔️ Skip projects with no link
		}
		status := ProjectStatus{
			Name:      p.Name,
			Link:      p.Link,
			UpdatedAt: p.UpdatedAt.Format("2006-01-02 15:04:05"),
		}

		// Step 3.1: Ping the site using http.Get
		client := http.Client{Timeout: 3 * time.Second}
		resp, err := client.Get(p.Link)
		if err != nil {
			status.Status = "DOWN"
			status.Code = 0
		} else {
			defer resp.Body.Close()
			status.Code = resp.StatusCode

			if resp.StatusCode >= 200 && resp.StatusCode < 400 {
				status.Status = "UP"
			} else {
				status.Status = "DOWN"
			}

		}
		projectList = append(projectList, status)
	}

	//response json
	w.Header().Set("Content-Type", "application/json")
	jsonData, err := json.Marshal(projectList)
	if err != nil {
		http.Error(w, "Failed to encode project status data", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)

}

// checker
func MonitorProjects() {
	go func() {
		for {
			fmt.Println("🔄 Running background project monitor...")
			// Get Users
			var users []models.User
			err := db.DB.Find(&users).Error
			if err != nil {
				fmt.Println("❌ Error fetching users:", err)
				time.Sleep(10 * time.Second) // Wait before retrying
				continue
			}
			// Iterate over each user
			for _, user := range users {
				if user.ID == 0 {
					fmt.Println("❌ Invalid user ID, skipping")
					continue
				}
				// Get Projects for this user by user-> ID
				var projects []models.Project
				result := db.DB.Where("user_id=?", user.ID).Find(&projects)
				if result.Error != nil {
					fmt.Println("❌ Error fetching projects for user ID", user.ID, ":", err)
					continue
				}
				//looping each project and checking status
				for _, project := range projects {
					client := http.Client{Timeout: 3 * time.Second}
					resp, err := client.Get(project.Link)

					if err != nil || (resp != nil && resp.StatusCode >= 400) {
						//email body
						subject := fmt.Sprintf("Project %s is DOWN", project.Name)
						body := fmt.Sprintf("Project %s (%s) is currently DOWN. Please check the link: %s", project.Name, project.Link, project.Link)

						//send email
						emailErr := utils.SendEmail(user.Email, subject, body)
						if emailErr != nil {
							fmt.Println("❌ Failed to send email to user ID", user.ID, ":", emailErr)
						} else {
							fmt.Printf("✅ Email sent to %s about project %s being DOWN\n", user.Email, project.Name)
						}

					}
					if resp != nil {
						defer resp.Body.Close()
					}

				}

			}
			time.Sleep(10 * time.Minute) // Wait before next check

		}

	}()
}
