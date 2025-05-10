package pages

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/widget"

	"YATL/lib/patcher"
)


const loginURL = "https://www.toontownrewritten.com/api/login?format=json"

type TTRResponse struct {
	Success      	string `json:"success"`
	Banner       	string `json:"banner,omitempty"`
	ResponseToken 	string `json:"responseToken,omitempty"`
	Gameserver   	string `json:"gameserver,omitempty"`
	Cookie    	string `json:"cookie,omitempty"`
	Manifest     	string `json:"manifest,omitempty"`
	ETA          	string `json:"eta,omitempty"`
	Position     	string `json:"position,omitempty"`
	QueueToken   	string `json:"queueToken,omitempty"`
}

func NewLoginPage() fyne.CanvasObject {
	username := widget.NewEntry()
	username.SetPlaceHolder("Username")

	password := widget.NewPasswordEntry()
	password.SetPlaceHolder("Password")

	statusLabel := widget.NewLabel("")

	loginBtn := widget.NewButton("Login", func() {
		handleLogin(username.Text, password.Text, statusLabel)
	})

	form := container.NewVBox(
		username,
		password,
		loginBtn,
		statusLabel,
	)

	return form
}

// The goal is to exit this function with TTR_GAMESERVER and TTR_PLAYCOOKIE in env
//   and Patch Manifest returned
func handleLogin(username string, password string, statusLabel *widget.Label) {
	resp, err := LoginTTR(username, password)
	if err != nil {
		fmt.Println("Error Logging In: ", err)
		return
	}

	switch resp.Success {
	case "true": 	// Full Seccess -> Get tokens and Download patch manifest
		handleLoginSuccess(resp)

	case "delayed": // In Queue -> Poll until full success
		statusLabel.SetText(fmt.Sprintf("In queue. ETA: %s sec, Position: %s\n", resp.ETA, resp.Position))
		_ = resp.QueueToken // TODO

	case "partial": // 2fa -> Toon factor authenicate until full success
		statusLabel.SetText("Two-factor auth required: " + resp.Banner)

	case "false": 	// Failure -> Give up ig
		statusLabel.SetText("Login failed: " + resp.Banner)


	default: 	// Should never see this
		statusLabel.SetText("Unexpected login response")
	}
}

func LoginTTR(username string, password string) (*TTRResponse, error) {
	// Create form to send
	form := url.Values{}
	form.Set("username", username)
	form.Set("password", password)

	// Create POST Request
	req, err := http.NewRequest(http.MethodPost, loginURL, bytes.NewBufferString(form.Encode()))

	// Add required Header
	req.Header.Set("Content-type", "application/x-www-form-urlencoded")

	// Send request
	client := &http.Client{}
	resp, err := client.Do(req)

	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	// Gather & return response
	body, _ := io.ReadAll(resp.Body)

	var ttrResp TTRResponse
	if err := json.Unmarshal(body, &ttrResp); err != nil {
		return nil, err
	}

	return &ttrResp, nil
}

func handleLoginSuccess(resp *TTRResponse) {
	// Set necessary env
	os.Setenv("TTR_GAMESERVER", resp.Gameserver)
	os.Setenv("TTR_PLAYERCOOKIE", resp.Cookie)

	// Prepare mirrors for download & patching
	mirrorResp, err := http.Get("https://www.toontownrewritten.com/api/mirrors");
	if err != nil {
		fmt.Println("Unable to get mirrors: ", err)
	}
	defer mirrorResp.Body.Close();

	var mirrors []string;
	json.NewDecoder(mirrorResp.Body).Decode(&mirrors);

	// Until they have more than literally one mirror I'm not adding funcitonality for it
	mirror := mirrors[0]

	patchURL := "https://cdn.toontownrewritten.com" + resp.Manifest

	// Let me know this all worked
	fmt.Println("Login successful!")
	fmt.Println("Game Server:", resp.Gameserver)
	fmt.Println("Play Cookie:", resp.Cookie)
	fmt.Println("Patch Manifest URL:", patchURL)

	// Handle Patching
	manifestContent, err := downloadPatchManifest(patchURL)
	if err != nil {
		fmt.Println("Failed to download patch manifest:", err)
		return
	}

	fmt.Println("Patch Manifest Content:")
	fmt.Println(manifestContent)

	patcher.DownloadAndInstallManifestFiles(mirror, []byte(manifestContent))
}

// Download manifest. Return error or manifest in string
func downloadPatchManifest(manifestURL string) (string, error) {
	resp, err := http.Get(manifestURL)
	if err != nil {
		return "", fmt.Errorf("Failed to download manifest: %w", err)

	}

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read manifest content: %w", err)
	}

	return string(body), nil
}
