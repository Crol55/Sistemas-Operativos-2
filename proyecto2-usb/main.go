package main

import (
	"fmt"
	usb "proyecto2/usb"
	"strings"
)

func main() {

	var USUARIO string = "so2"
	var PASSWORD string = "123"

	var answer string
	var inputPwd string

	for {
		fmt.Print("Ingrese Usuario:")
		fmt.Scan(&answer)
		fmt.Print("Ingrese Password:")
		fmt.Scan(&inputPwd)

		if answer != USUARIO || inputPwd != PASSWORD {
			panic("Error en sus credenciales")
		}

		fmt.Println("Bienvenido al manejador de USB")
		fmt.Println("Activando el monitor de dispositivos extraibles (log-> /var/p2so2/log.txt)")

		go usb.DirWatcher() // monitoreamos los puertos

	puertos:

		if usb.IsPortActive() {

			fmt.Print("Los puertos estan activos, desea (deshabilitar) los puertos USB (Y|N):")
			fmt.Scan(&answer)

			if strings.ToUpper(answer) == "Y" {

				fmt.Println("Deshabilitando puertos.....")
				usb.BlockAllUsbPorts()
			}

		} else {
			fmt.Print("Los puertos estan deshabilitados, desea (habilitar) los puertos USB (Y|N):")
			fmt.Scan(&answer)

			if strings.ToUpper(answer) == "Y" {

				fmt.Println("Habilitado puertos.....")
				usb.UnlockAllUsbPorts()
			}
		}

		goto puertos

	}

}
