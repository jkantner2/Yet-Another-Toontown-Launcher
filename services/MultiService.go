package services

import (
	"runtime"

	"github.com/rs/zerolog/log"
)

type MutliService struct{}

func (g *MutliService) Mt_init() uint8 {
	id, err := NewSession()

	if err != nil {
		log.Error().Err(err).Msg("Failed to init mt_session")
		return 0
	}

	return id
}

func (g *MutliService) Mt_select_window(id uint8) uint64 {
	runtime.LockOSThread()
	defer runtime.UnlockOSThread()
	window := GetSession(id).SelectWindow()

	return uint64(window)
}

func (g *MutliService) Mt_send_key(id uint8, window uint64, key string) {
	runtime.LockOSThread()
	defer runtime.UnlockOSThread()
	GetSession(id).SendKey(window, key)
}

func (g *MutliService) Mt_set_key_up(id uint8, window uint64, key string) {
	runtime.LockOSThread()
	defer runtime.UnlockOSThread()
	GetSession(id).SetKeyUp(window, key)
}

func (g *MutliService) Mt_set_key_down(id uint8, window uint64, key string) {
	runtime.LockOSThread()
	defer runtime.UnlockOSThread()
	GetSession(id).SetKeyDown(window, key)
}

func (g *MutliService) Mt_shutdown(id uint8) {
	runtime.LockOSThread()
	defer runtime.UnlockOSThread()
	RemoveSession(id)
}
