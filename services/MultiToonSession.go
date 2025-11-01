package services

import (
	"YATL/src/multi"
	"sync"

	"github.com/rs/zerolog/log"
)

var (
	mt_sessions = make(map[uint8]*multi.Session)
	sessionMutex sync.Mutex
	newSessionID uint8 = 1
)

func NewSession() (uint8, error) {
	session, err := multi.Init()

	if err != nil {
		log.Error().Err(err).Msg("Failed to init mt_session")
		return 0, err
	}

	sessionMutex.Lock()
	defer sessionMutex.Unlock()

	id := newSessionID
	newSessionID++
	mt_sessions[id] = session

	return id, nil
}

func GetSession(id uint8) *multi.Session {
	sessionMutex.Lock()
	defer sessionMutex.Unlock()
	return mt_sessions[id]
}

func RemoveSession(id uint8) {
	sessionMutex.Lock()
	defer sessionMutex.Unlock()

	if session, ok := mt_sessions[id]; ok {
		session.Shutdown()
		delete(mt_sessions, id)
	}
}
