package services

import (
	"github.com/rs/zerolog/log"
	"YATL/src/multi"
)

type MultiService struct{}

func (g *MultiService) Mt_init() uint8 {
	id, err := NewSession()

	if err != nil {
		log.Error().Err(err).Msg("Failed to init mt_session")
		return 0
	}

	return id
}

func (g *MultiService) Mt_select_window(id uint8) uint64 {
	window := GetSession(id).SelectWindow()

	return uint64(window)
}

func (g *MultiService) Mt_send_key(id uint8, window uint64, key string) {
	GetSession(id).SendKey(window, key)
}

func (g *MultiService) Mt_set_key_up(id uint8, window uint64, key string) {
	GetSession(id).SetKeyUp(window, key)
}

func (g *MultiService) Mt_set_key_down(id uint8, window uint64, key string) {
	GetSession(id).SetKeyDown(window, key)
}

func (g *MultiService) Mt_shutdown(id uint8) {
	RemoveSession(id)
}

func (g *MultiService) SaveMTProfile(name string, profile map[string]string) {
	multi.SaveKeyBindProfile(name, profile)
}

func (g *MultiService) LoadTTRControls() map[string]string {
	controls, err := multi.LoadTTRControls()
	if err != nil {
		log.Error().Err(err).Msg("Failed to load ttr controls")
	}

	return controls
}

func (g *MultiService) LoadMTProfile(name string) map[string]string {
	return multi.LoadKeyBindProfile(name)
}

func (g *MultiService) LoadAllMTProfileNames() map[string]string {
	return multi.LoadAllKeyBindProfileNames()
}
