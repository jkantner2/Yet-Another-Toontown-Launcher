package logger

import (
	"YATL/src/patcher"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"runtime"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func getLogDirPath() (string, error) {
	var logPath string

	switch runtime.GOOS {
	case "windows":
		appData := os.Getenv("LocalAppData")
		if appData == "" {
			return "", fmt.Errorf("Could not locate App Data for logger")
		}
		logPath = filepath.Join(appData, "YATL")
	case "darwin":
		homeDir, err := patcher.GetHomeDir()
		if err != nil {
			return "", err
		}
		logPath = filepath.Join(homeDir, "Library", "Logs", "YATL")
	case "linux":
		homeDir, err := patcher.GetHomeDir()
		if err != nil {
			return "", err
		}
		logPath = filepath.Join(homeDir, ".local", "share", "YATL")
	default:
		return "", fmt.Errorf("Could not determine runtime for logger")
	}
	return logPath, nil
}

func rotateLogs(logDir string) error {
	logFile := filepath.Join(logDir, "YATL.log")
	logFileOld := filepath.Join(logDir, "YATL.old.log")

	// If old log exists remove it
	if _, err := os.Stat(logFileOld); err == nil {
		// Old log exists
		if err = os.Remove(logFileOld); err != nil {
			return fmt.Errorf("Could not remove existing old log file: %w", err)
		}
	}

	// Rotate Logs
	if _, err := os.Stat(logFile); err == nil {
		// New log exists
		if err = os.Rename(logFile, logFileOld); err != nil {
			return fmt.Errorf("Could not rename current log to old log: %w", err)
		}
	} else if errors.Is(err, os.ErrNotExist) {
		// No log files exist, make it.
		_, err = os.Create(logFile)
		if err != nil {
			return fmt.Errorf("Could not create initial log file: %w", err)
		}

	}

	return nil
}

func InitLogger() error {
	logDir, err := getLogDirPath()
	if err != nil {
		return fmt.Errorf("Failed to find log dir path: %w", err)
	}

	err = os.MkdirAll(logDir, os.ModePerm)
	if err != nil {
		return fmt.Errorf("Failed to create log dir: %w", err)
	}

	err = rotateLogs(logDir)
	if err != nil {
		return fmt.Errorf("Failed to rotate logs: %w", err)
	}

	logFile := filepath.Join(logDir, "YATL.log")

	file, err := os.OpenFile(logFile, os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0666)
	if err != nil {
		return fmt.Errorf("Could not open log file: %w", err)
	}

	log.Logger = zerolog.New(file).With().Timestamp().Logger()

	log.Info().Msg("Logger Started")

	return nil
}
