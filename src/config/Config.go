package config

import (
	"os"
	"path/filepath"

	"github.com/rs/zerolog/log"
	"github.com/spf13/viper"
)

const serviceName = "YATL"

func InitViper() error {
	configDir, err := os.UserConfigDir()
	if err != nil {
		log.Error().Err(err).Msg("Failde to get configDir")
	}
	appDir := filepath.Join(configDir, serviceName)
	os.MkdirAll(appDir, 0o700)

	viper.SetConfigName("config")
	viper.SetConfigType("json")
	viper.AddConfigPath(appDir)

	configFile := filepath.Join(appDir, "config.json")

	if _, err := os.Stat(configFile); os.IsNotExist(err) {
		viper.Set("accounts", []string{})
		if err := viper.WriteConfigAs(configFile); err != nil {
			return err
		}
	}

	return viper.ReadInConfig()
}
