package usb

import (
	"fmt"
	"log"
	"os"
)

func BlockAllUsbPorts() {
	// should be executed in sudo mode

	error := os.Chmod("/media", 000)

	if error != nil {
		log.Fatal(error)
	}

	fmt.Println("Puertos Bloqueados")
}

func UnlockAllUsbPorts() {

	error := os.Chmod("/media", 0b111101101)

	if error != nil {
		log.Fatal(error)
	}

	fmt.Println("Puertos desbloqueados")
}

func IsPortActive() bool {

	statsInfo, error := os.Stat("/media")
	if error != nil {
		log.Fatal(error)
	}

	if statsInfo.Mode().Perm() == 0b000000000 {
		return false
	}

	return true
}
