package main

import (
	"YATL/ui"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/app"
)

func main() {
	YATLApp := app.New()
	YATLWindow := YATLApp.NewWindow("Yet Another Toontown Launcher")
	content := ui.BuildUI(YATLWindow)

	YATLWindow.SetContent(content)
	YATLWindow.Resize(fyne.NewSize(800,600))
	YATLWindow.ShowAndRun()
}
