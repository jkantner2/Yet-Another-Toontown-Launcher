package services

import (
	"YATL/src/login"
	"os"
	"syscall"
)

type LoginService struct{}

// Returns PID
func (g *LoginService) Login(username string) int {
	return login.HandleLogin(username)
}

// Returns 0 on success
func (g *LoginService) SaveAccount(username string, password string) int {
	err := login.SaveAccount(username, password)
	if err != nil {
		return 1
	}
	return 0
}

func (g *LoginService) GetAllAccounts() []string {
	return login.GetAllAccounts()
}

func (g *LoginService) IsProcessRunning(pid int) bool {
	process, err := os.FindProcess(pid)
	if err != nil {
		return false
	}

	err = process.Signal(syscall.Signal(0))
	return err == nil
}
