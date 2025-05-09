package widgets

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"sync"

	"slices"

	"fyne.io/fyne/v2/widget"
)

type DownloadStatus struct {
	Label   *widget.Label
	Bar     *widget.ProgressBar
	Current string
}

type PatchInfo struct {
	DL       string            `json:"dl"`
	Hash     string            `json:"hash"`
	CompHash string            `json:"compHash"`
	Patches  map[string]string `json:"patches"`
	Only     []string          `json:"only"`
}

type PatchManifest map[string]PatchInfo

// Returns map of Files to be downloaded
// Example:
//"phase_10.mf": { <-- key
//    "dl": "phase_10.mf.e14e560332.bz2",
//    "hash": "e14e560332086df1884292bd309fe811e2813b67",
//    "compHash": "0b7b36d195e7e445104ffc2fce9bee6ff25cd0a9",
//    "patches": {},
//    "only": ["darwin", "linux", "linux2", "win32", "win64"]
//  },
func parseManifest (rawManifest []byte) PatchManifest{
	var patchManifest PatchManifest
	err := json.Unmarshal([]byte(rawManifest), &patchManifest)
	if err != nil {
		fmt.Println("Failed to parse manifest: ", err)
	}

	return patchManifest
}

func isPatchForOS(operatingSystems []string, platform string) bool {
	return slices.Contains(operatingSystems, platform)
}

// Why is win32 even supported in the year of our lord 2025
func getPlatformString() string {
	goos := runtime.GOOS
	goarch := runtime.GOARCH

	if goos == "windows" {
		if goarch == "386" {
			return "win32"
		} else if goarch == "amd64" {
			return "win64"
		}
	}

	return goos
}

func downloadFile (baseURL string, filename string, info PatchInfo, tempPath string, wg *sync.WaitGroup) {
	defer wg.Done()

	url := fmt.Sprintf("%s/%s", baseURL, info.DL)
	fmt.Println("Downloading", filename, "from", url)

	// Get data
	resp, err := http.Get(url)
	if err != nil {
		fmt.Println("Error downloading", filename, ": ", err)
	}
	defer resp.Body.Close()

	// Create blank file
	out, err := os.Create(tempPath)
	if err != nil {
		fmt.Println("Error creating blank file", tempPath, ": ", err)
	}
	defer out.Close()

	// Copy data to blank file
	_, err = io.Copy(out, resp.Body)

	if err != nil {
		fmt.Println("Error copying data to file", tempPath, ": ", err)
	}

	return
}


func downloadAndInstallManifestFiles(baseURL string, rawManifest []byte) {
	// Create tempFS for work
	tempDir := generateTempDir()


	// Parse manifest
	patchManifest := parseManifest(rawManifest)
	var wg sync.WaitGroup
	platform := getPlatformString()


	// Only dispatch downloads for required files
	for patch, info := range patchManifest {
		if !isPatchForOS(info.Only, platform) {
			fmt.Println("Skipping file: ", patch)
			continue
		}
		wg.Add(1)
		downloadFile(baseURL, patch, info, filepath.Join(*tempDir, patch), &wg)
	}

	wg.Wait()
	fmt.Println("Downloads Complete")
}

func generateTempDir() *string {
	tempDir := filepath.Join(os.TempDir(), "YATL")

	err := os.MkdirAll(tempDir, os.ModePerm)
	if err != nil {
		fmt.Println("Error creating temp dir: ", err)
		return nil
	}

	return &tempDir
}
