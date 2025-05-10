package patcher

import (
	"compress/bzip2"
	"crypto/sha1"
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
	"github.com/rs/zerolog/log"
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

// Manifest Query

// Returns map of Files to be downloaded
func parseManifest(rawManifest []byte) PatchManifest {
	var patchManifest PatchManifest
	err := json.Unmarshal(rawManifest, &patchManifest)
	if err != nil {
		log.Error().Str("Manifest", string(rawManifest)).Err(err).Msg("Failed to parse manifest")
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

// Downloads & Decompression

func downloadFile(baseURL string, filename string, info PatchInfo, tempPath string, wg *sync.WaitGroup) {
	defer wg.Done()

	url := fmt.Sprintf("%s/%s", baseURL, info.DL)
	fmt.Println("Downloading ", filename, " from ", url)

	// Get data
	resp, err := http.Get(url)
	if err != nil {
		log.Error().Str("filename", filename,).Err(err).Msg("Error downloading File")
	}
	defer resp.Body.Close()

	// Create blank file
	out, err := os.Create(tempPath)
	if err != nil {
		log.Error().Str("tempPath", tempPath).Err(err).Msg("Error creating blank file")
	}
	defer out.Close()

	// Copy data to blank file
	_, err = io.Copy(out, resp.Body)

	if err != nil {
		log.Error().Str("filename", filename).Err(err).Msg("Error copying data to file")
	}

	// TODO
	// Check hash of downloaded file against info hash

	return
}

func getSha1sum(filepath string) (string, error) {
	file, err := os.Open(filepath)
	if err != nil {
		return "", err
	}
	defer file.Close()

	hasher := sha1.New()
	_, err = io.Copy(hasher, file)
	if err != nil {
		return "", err
	}

	return fmt.Sprintf("%x", hasher.Sum(nil)), nil
}

func compareSha1sum(filename string) {
}

func DownloadAndInstallManifestFiles(baseURL string, rawManifest []byte) {
	// Create tempFS for work
	tempDir := generateTempDir()
	if tempDir == nil {
		log.Warn().Msg("Failed to access OS tempDir")
		return
	}

	// Parse manifest
	patchManifest := parseManifest(rawManifest)
	var wg sync.WaitGroup
	platform := getPlatformString()

	// Only dispatch downloads for required files
	filesToDecompress := map[string]string{}
	for patch, info := range patchManifest {
		if !isPatchForOS(info.Only, platform) {
			log.Info().Str("File", patch).Msg("Skipping file")
			continue
		}
		wg.Add(1)
		downloadFile(baseURL, patch, info, filepath.Join(*tempDir, patch), &wg)
		filesToDecompress[patch] = info.DL
	}

	wg.Wait()
	log.Info().Msg("Downloads Complete")

	// Handle Decompression
	for source, dest := range filesToDecompress {
		err := decompressFile(source, dest)
		if err != nil {
			log.Error().Str("source", source).Str("dest", dest).Err(err).Msg("Failed to decompress file")
		}
	}

	err := installTTR(*tempDir)
	if err != nil {
		log.Error().Err(err).Msg("Failed to install TTR")
	}
}

func generateTempDir() *string {
	tempDir := filepath.Join(os.TempDir(), "YATL")

	err := os.MkdirAll(tempDir, os.ModePerm)
	if err != nil {
		log.Warn().Str("tempDir", tempDir).Err(err).Msg("Error creating temporary directory")
		return nil
	}

	return &tempDir
}

func decompressFile(sourceFile string, destFile string) error {
	src, err := os.Open(sourceFile)
	if err != nil {
		log.Error().Str("Source file", sourceFile).Err(err).Msg("Error loading bz2 file")
	}
	defer src.Close()

	bz2Reader := bzip2.NewReader(src)
	dst, err := os.Create(destFile)
	if err != nil {
		log.Error().Str("destFile", destFile).Err(err).Msg("Error creating blank file")
	}
	defer dst.Close()

	_, err = io.Copy(dst, bz2Reader)
	if err != nil {
		return fmt.Errorf("Failed to decompress: %w", err)
	}

	return nil
}

// Installation

func installTTR(tempDir string) error {
	// Make dir for install
	installDirectory, err := getInstallDirByOS()
	if err != nil {
		return fmt.Errorf("Couldn't find install dir: %w", err)
	}

	err = os.MkdirAll(installDirectory, os.ModePerm)
	if err != nil {
		return fmt.Errorf("Couldn't make install dir: %w", err)
	}
	// TODO
	// Move files to Dirs & overwrite old ones

	return nil
}

func getInstallDirByOS() (string, error) {
	switch runtime.GOOS {
	case "windows":
		programFiles := os.Getenv("ProgramFiles")
		if programFiles != "" {
			return filepath.Join(programFiles, "Toontown Rewritten"), nil
		}
	case "darwin":
		homeDir, err := GetHomeDir()
		if err != nil {
			return "", err
		}
		return filepath.Join(homeDir, "Library", "Application Support", "Toontown Rewritten"), nil
	case "linux":
		homeDir, err := GetHomeDir()
		if err != nil {
			return "", err
		}
		return filepath.Join(homeDir, ".local", "share", "Toontown Rewritten"), nil
	}

	return "", fmt.Errorf("Could not find install dir for runtime: %s", runtime.GOOS)
}

func GetHomeDir() (string, error) {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return "", err
	}
	return homeDir, nil
}
