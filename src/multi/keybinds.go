package multi

import (
	"bytes"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	"YATL/src/patcher"

	"github.com/rs/zerolog/log"
	"github.com/spf13/viper"
)

type MTProfile struct {
    Name   string            `json:"name"`
    KeyMap map[string]string `json:"keyMap"`
}

func SaveKeyBindProfile(profileName string, profile map[string]string) error {
    profiles := viper.GetStringMap("keybindProfiles")
    if profiles == nil {
        profiles = map[string]any{}
    }

    profiles[profileName] = profile
    viper.Set("keybindProfiles", profiles)

    if err := viper.WriteConfig(); err != nil {
        log.Error().Err(err).Msg("Viper failed to write keybindings to config file")
        return err
    }
    return nil
}

func LoadKeyBindProfile(profileName string) map[string]string {
    return viper.GetStringMapString("keybindProfiles." + profileName)
}

func LoadAllKeyBindProfiles() map[string]string {
	var test = viper.GetStringMapString("keybindProfiles");
	log.Info().Msg(createKeyValuePairs(test))
	return nil;
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


// TODO: for debug delete later
func createKeyValuePairs(m map[string]string) string {
    b := new(bytes.Buffer)
    for key, value := range m {
        fmt.Fprintf(b, "%s=\"%s\"\n", key, value)
    }
    return b.String()
}
