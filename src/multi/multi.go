package multi

/*
#cgo linux LDFLAGS: -lmultitoon
#cgo windows LDFLAGS: -lmultitoon -L${SRCDIR}
#cgo darwin LDFLAGS: -L${SRCDIR} -lmultitoon -framework Carbon -framework CoreFoundation -framework CoreGraphics -lSystem
#cgo CFLAGS: -I/usr/include/multitoon
#include <stdlib.h>
#include "mtlib.h"
*/
import "C"

import (
	"errors"
	"fmt"
	"runtime"
	"unsafe"

	"github.com/rs/zerolog/log"
)

type Session struct {
	ptr *C.mtlib_session_t
}


func Init() (*Session, error) {
	mtlib_pointer := C.mtlib_init()
	if mtlib_pointer == nil {
		return nil, errors.New("mtlib_init failed to init")
	}

	mtlib_session := &Session{ptr: mtlib_pointer}

	runtime.SetFinalizer(mtlib_session, func(s *Session) {
		if s.ptr != nil {
			C.mtlib_shutdown(s.ptr)
			s.ptr = nil
		}
	})
	return mtlib_session, nil
}

func (s *Session) Shutdown() {
	if s == nil || s.ptr == nil {
		return
	}
	C.mtlib_shutdown(s.ptr)
	s = nil
	runtime.SetFinalizer(s, nil)
}

func (s *Session) SelectWindow() C.uint64_t {
	if s == nil || s.ptr == nil {
		return 0
	}
	log.Info().Msg(fmt.Sprintf("session ptr: %p\n", s.ptr))
	window := C.mtlib_select_window(s.ptr)
	return window
}

func (s *Session) SetKeyDown(window uint64, key string) error {
	if s == nil || s.ptr == nil {
		return errors.New("session is nil")
	}
	log.Info().Msg(fmt.Sprintf("session ptr: %p\n", s.ptr))

	cs := C.CString(key)
	defer C.free(unsafe.Pointer(cs))
	C.mtlib_set_key_down(s.ptr, C.uint64_t(window), cs)
	return nil
}

func (s *Session) SetKeyUp(window uint64, key string) error {
	if s == nil || s.ptr == nil {
		return errors.New("session is nil")
	}
	log.Info().Msg(fmt.Sprintf("session ptr: %p\n", s.ptr))

	cs := C.CString(key)
	defer C.free(unsafe.Pointer(cs))
	C.mtlib_set_key_up(s.ptr, C.uint64_t(window), cs)
	return nil
}

func (s *Session) SendKey(window uint64, key string) error {
	if s == nil || s.ptr == nil {
		return errors.New("session is nil")
	}
	log.Info().Msg(fmt.Sprintf("session ptr: %p\n", s.ptr))

	cs := C.CString(key)
	defer C.free(unsafe.Pointer(cs))
	C.mtlib_send_key(s.ptr, C.uint64_t(window), cs)
	return nil
}
