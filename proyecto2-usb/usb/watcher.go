package usb

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/illarion/gonotify/v2"
)

func DirWatcher() {

	ctx, cancel := context.WithCancel(context.Background())

	watcher, err := gonotify.NewDirWatcher(ctx, gonotify.IN_ALL_EVENTS, "/media")

	if err != nil {
		panic(err)
	}

	var previousEventMask uint32 = 0

	for {

		select {

		case event := <-watcher.C:
			//fmt.Printf("%s El evento: %s [mask:%d]\n", time.Now().String(), event, event.Mask)

			if event.Wd == 3 {

				if event.Mask&gonotify.IN_CREATE != 0 {

					//fmt.Printf("Archivo creado: %s\n", event.Name)
					previousEventMask = event.Mask

				} else if event.Mask&gonotify.IN_OPEN != 0 {

					previousEventMask = event.Mask

				} else if event.Mask&gonotify.IN_MODIFY != 0 {

					if previousEventMask == gonotify.IN_OPEN {
						previousEventMask = event.Mask
					}

				} else if event.Mask&gonotify.IN_CLOSE_WRITE != 0 {

					if previousEventMask == gonotify.IN_MODIFY {
						previousEventMask = 0
						//fmt.Printf("Archivo creado o copiado hacia dispositvo usb: %s\n", event.Name)
						writeIntoLog(fmt.Sprintf("Archivo '%s' copiado HACIA dispositivo externo", event.Name))
					}

				} else if event.Mask&gonotify.IN_CLOSE_NOWRITE != 0 {

					if previousEventMask == gonotify.IN_OPEN {
						previousEventMask = 0
						//fmt.Printf("Archivo copiado desde el dispositvo usb: %s\n", event.Name)
						writeIntoLog(fmt.Sprintf("Archivo '%s' copiado DESDE dispositivo externo a disco duro", event.Name))
					}

				} else if event.Mask&gonotify.IN_ATTRIB != 0 {

					previousEventMask = event.Mask

				} else if event.Mask&gonotify.IN_ACCESS != 0 {

					previousEventMask = event.Mask

				} else if event.Mask&gonotify.IN_MOVE != 0 {
					//fmt.Printf("Archivo eliminado: %s\n", event.Name)
					previousEventMask = event.Mask
				}

				if event.Mask&gonotify.IN_UNMOUNT != 0 {
					writeIntoLog(fmt.Sprint("Dispositivo extraible fue desmontado"))
					cancel()
				}
			}

			//case <-time.After(100000 * time.Second):
			//	fmt.Println("Tiempo agotado")
			//	cancel()
			//	return
		}
	}
}

func checkErr(err error) {

	if err != nil {
		panic(err)
	}
}

func writeIntoLog(info string) {

	tiempo := time.Now()

	logFile, err := os.OpenFile("/var/p2so2/log", (os.O_APPEND | os.O_CREATE | os.O_WRONLY), 0644)

	checkErr(err)
	defer logFile.Close()

	year, month, day := tiempo.Date()
	hora, min, sec := tiempo.Clock()

	stream := []byte(fmt.Sprintf("%d/%d/%d %d:%d:%d	%s\n", year, month, day, hora, min, sec, info))
	_, err = logFile.Write(stream)

	checkErr(err)
}
