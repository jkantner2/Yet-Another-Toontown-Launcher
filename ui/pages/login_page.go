package pages

import (
	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/widget"
)

func NewLoginPage() fyne.CanvasObject {
	username := widget.NewEntry()
	username.SetPlaceHolder("Username")

	password := widget.NewPasswordEntry()
	password.SetPlaceHolder("Password")

	loginBtn := widget.NewButton("Login", func() {
		// placeholder
	})

	form := container.NewVBox(
		widget.NewLabel("Login"),
		username,
		password,
		loginBtn,
	)

	return form
}
