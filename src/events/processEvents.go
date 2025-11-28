package events

import "github.com/wailsapp/wails/v3/pkg/application"


func NotifyPID(pid int) {
	app := application.Get()
	app.Event.Emit("common:PID-updated", pid)
}
