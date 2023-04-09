package main

import (
	"context"
	"fmt"
	"log"

	linuxProc "github.com/c9s/goprocinfo/linux"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

// GetCpuUsage retorna la informacion del estado actual de la memoria RAM
var prevTotalTime uint64 = 0
var prevIdleTime uint64 = 0
var executeOnce bool = false

func (a *App) GetCPUUsage() float64 {

	stat, err := linuxProc.ReadStat("/proc/stat")
	if err != nil {
		log.Fatal("No pudo leer /proc/stat")
	}

	totalTime := stat.CPUStatAll.User + stat.CPUStatAll.Nice + stat.CPUStatAll.System + stat.CPUStatAll.Idle + stat.CPUStatAll.IOWait + stat.CPUStatAll.IRQ
	deltaIdleUsage := float64(stat.CPUStatAll.Idle-prevIdleTime) / float64(totalTime-prevTotalTime)

	//fmt.Println((1.0 - deltaIdleUsage) * 100)

	prevIdleTime = stat.CPUStatAll.Idle
	prevTotalTime = totalTime

	if !executeOnce {
		executeOnce = true
		return 0.0
	}

	return (1.0 - deltaIdleUsage) * 100
}

func (a *App) GetDiskUsage() int8 {

	diskData, err := linuxProc.ReadDisk("/")
	if err != nil {
		log.Fatal("No pudo leer /proc/stat")
	}
	fmt.Println(diskData)
	//fmt.Println((float64(diskData.Used) / float64(diskData.All)) * 100)
	diskUsagePorcentage := (float64(diskData.Used) / float64(diskData.All)) * 100
	return int8(diskUsagePorcentage)
}

type ramInfo struct {
	MemLibre uint64
	MemUsada uint64
}

func (a *App) GetRamUsage() ramInfo {

	memInfo, err := linuxProc.ReadMemInfo("/proc/meminfo")

	if err != nil {
		log.Fatal("No se puede leer /proc/meminfo")
	}

	//fmt.Println(memInfo)

	memoriaRamLibre := memInfo.MemFree + memInfo.Cached + memInfo.Buffers
	memoriaRamUsado := memInfo.MemTotal - memoriaRamLibre

	//fmt.Println("Memoria libre:", (memoriaRamLibre / 1024), ", Memoria usada:", (memoriaRamUsado / 1024))

	return ramInfo{MemLibre: (memoriaRamLibre / 1024), MemUsada: (memoriaRamUsado / 1024)}
}
