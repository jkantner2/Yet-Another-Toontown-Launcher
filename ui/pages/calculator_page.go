package pages

import (
	"YATL/ui/widgets"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/container"
)

// TODO
func NewCalculatorPage() fyne.CanvasObject {
	gagGrid := widgets.NewGagMenu()

	form := container.NewVBox(gagGrid)

	return form
}
