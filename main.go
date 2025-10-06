package main

import (
	"YATL/lib/logger"
	"YATL/services"

	"embed"
	"fmt"

	"github.com/wailsapp/wails/v3/pkg/application"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	logErr := logger.InitLogger()
	if logErr != nil {
		fmt.Println("Could not init Logger: ", logErr)
	}
	// Create an instance of your app structure
	app := application.New(application.Options{
		Name: "YATL",
		Description: "Yet Another Toontown Launcher",
		Services: []application.Service{
			application.NewService(&services.LoginService{}),
		},
		Assets: application.AssetOptions{
			Handler: application.AssetFileServerFS(assets),
		},
	})

	app.Window.NewWithOptions(application.WebviewWindowOptions{
		Title: "YATL",
		URL: "/",
		Frameless: true,
		DisableResize: true,
		Width: 1280,
		Height: 720,
	})

	err := app.Run()

	if err != nil {
		fmt.Println(err)
	}
}
