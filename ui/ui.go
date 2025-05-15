package ui

import (
	"YATL/ui/pages"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/layout"
	"fyne.io/fyne/v2/widget"
)

const (
	Launch = iota
	Calcs
	Toon
	Suits
	Doodle
	Settings
	SidebarLen
)

func BuildUI(w fyne.Window) fyne.CanvasObject {
	pageContainer := container.NewStack()

	loginPage := pages.NewLoginPage()

	pageContainer.Add(loginPage)

	// some of that side bar action
	sidebar := widget.NewList(
		func() int { return SidebarLen },
		func() fyne.CanvasObject { return widget.NewLabel("Option") },
		func(id widget.ListItemID, o fyne.CanvasObject) {
			switch id {
			case Launch:
				o.(*widget.Label).SetText("Launch")
			case Calcs:
				o.(*widget.Label).SetText("Calcs")
			case Toon:
				o.(*widget.Label).SetText("Toon")
			case Suits:
				o.(*widget.Label).SetText("Suits")
			case Doodle:
				o.(*widget.Label).SetText("Doodle")
			case Settings:
				o.(*widget.Label).SetText("Settings")
			}
		},
	)

	sidebar.OnSelected = func(id int) {
		switch id {
		case Launch:
			pageContainer.Objects = []fyne.CanvasObject{pages.NewLoginPage()}
		case Calcs:
			pageContainer.Objects = []fyne.CanvasObject{widget.NewLabel("Gag Calculator Page (coming soon)")}
		case Toon:
			pageContainer.Objects = []fyne.CanvasObject{widget.NewLabel("Toon Page (coming soon)")}
		case Suits:
			pageContainer.Objects = []fyne.CanvasObject{widget.NewLabel("Cog Suits Page (coming soon)")}
		case Doodle:
			pageContainer.Objects = []fyne.CanvasObject{widget.NewLabel("Doodle Page (coming soon)")}
		case Settings:
			pageContainer.Objects = []fyne.CanvasObject{widget.NewLabel("Settings Page (coming soon)")}
		}
		pageContainer.Refresh()
	}

	// Cleaning up the UI
	sidebarWithPadding := container.New(layout.NewCustomPaddedLayout(4, 4, 4, 16), sidebar)
	content := container.NewBorder(nil, nil, sidebarWithPadding, nil, pageContainer)

	return content
}
