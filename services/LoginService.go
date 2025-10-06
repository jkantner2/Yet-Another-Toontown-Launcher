package services
import "YATL/lib/login"

type LoginService struct{}

func (g *LoginService) Login(username string, password string) string {
	login.HandleLogin(username, password)
	return "called login service"
}
