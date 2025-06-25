package widgets

import (
	"fmt"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/layout"
	"fyne.io/fyne/v2/widget"
)

func NewGagMenu() fyne.CanvasObject {
	rows := 6
	columns := 7

	// Create buttons for gags (6x7)
	gags := make([][]*widget.Button, rows)
	for row := range rows {
		gags[row] = make([]*widget.Button, columns)
		for col := range columns {
			r, c := row, col

			// Button logic for calc go here TODO
			btn := widget.NewButton(fmt.Sprintf("(%d,%d)", r+1, c+1), func() {
				fmt.Printf("Clicked button at (%d, %d)\n", r+1, c+1)
			})
			gags[row][col] = btn
		}
	}
	gagObjects := []fyne.CanvasObject{}
	for row := range rows {
		for col := range columns {
			gagObjects = append(gagObjects, gags[row][col])
		}
	}

	return container.New(layout.NewGridLayout(columns), gagObjects...)
}
