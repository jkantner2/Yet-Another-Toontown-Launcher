package multi

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	"YATL/src/patcher"

	"github.com/rs/zerolog/log"
	"github.com/spf13/viper"
)

type MTProfile struct {
	Name                string            `mapstructure:"name"`
	KeyMap              map[string]string `mapstructure:"keyMap"`
	AutoAttatchAccounts []string          `mapstructure:"autoAttatchAccounts"`
}

func SaveMTProfile(profileName string, profile MTProfile) error {
	profiles := viper.GetStringMap("mtProfiles")
	if profiles == nil {
		profiles = map[string]any{}
	}

	profiles[profileName] = profile
	viper.Set("mtProfiles", profiles)

	return viper.WriteConfig()
}

func LoadMTProfile(profileName string) MTProfile {
	var profile MTProfile
	if !viper.IsSet("mtProfiles." + profileName) {
		// Return empty profile
		return MTProfile{
			Name:                profileName,
			KeyMap:              make(map[string]string),
			AutoAttatchAccounts: []string{},
		}
	}

	err := viper.UnmarshalKey("mtProfiles."+profileName, &profile)
	if err != nil {
		// Return empty profile on unmarshal error
		return MTProfile{
			Name:                profileName,
			KeyMap:              make(map[string]string),
			AutoAttatchAccounts: []string{},
		}
	}

	return profile
}

func LoadAllMTProfiles() map[string]MTProfile {
	result := make(map[string]MTProfile)
	profiles := viper.GetStringMap("mtProfiles")
	for name := range profiles {
		result[name] = LoadMTProfile(name)
	}
	return result
}

func LoadTTRControls() (map[string]string, error) {
	var ttrDir, err = patcher.GetInstallDirByOS()

	if err != nil {
		log.Error().Err(err).Msg("Err getting install dir to load controls")
	}

	file, err := os.Open(filepath.Join(ttrDir, "settings.json"))
	if err != nil {
		log.Error().Err(err).Msg("Failed to open settings.json")
	}

	var data map[string]any
	if err := json.NewDecoder(file).Decode(&data); err != nil {
		return nil, err
	}

	controlsField, ok := data["controls"].(map[string]any)
	if !ok {
		return nil, fmt.Errorf("controls field not found or invalid")
	}

	controls := make(map[string]string)
	for k, v := range controlsField {
		if str, ok := v.(string); ok {
			controls[k] = str
		}
	}

	return controls, nil
}
