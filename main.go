package main

import (
	"YATL/lib/logger"
	"YATL/ui"
	"fmt"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/app"
	"YATL/lib/multi"
)

func main() {
	multi.Go_select_window()
	err := logger.InitLogger()
	if err != nil {
		fmt.Println("Could not init Logger: ", err)
	}

	YATLApp := app.New()
	YATLWindow := YATLApp.NewWindow("Yet Another Toontown Launcher")
	content := ui.BuildUI(YATLWindow)

	YATLWindow.SetContent(content)
	YATLWindow.Resize(fyne.NewSize(800,600))
	YATLWindow.ShowAndRun()
}
