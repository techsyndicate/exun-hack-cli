#!/usr/bin/env node

import {Command} from 'commander'
import readline from 'readline'
import ansiColor from 'ansi-color'
import socketio from 'socket.io-client'
const program = new Command()
var color = ansiColor.set

const alphabetMapping = [
    { letter: 'A', symbol: '⏃' },
    { letter: 'B', symbol: '⏚' },
    { letter: 'C', symbol: '☊' },
    { letter: 'D', symbol: '⎅' },
    { letter: 'E', symbol: '⟒' },
    { letter: 'F', symbol: '⎎' },
    { letter: 'G', symbol: '☌' },
    { letter: 'H', symbol: '⊑' },
    { letter: 'I', symbol: '⟟' },
    { letter: 'J', symbol: '⟊' },
    { letter: 'K', symbol: '☍' },
    { letter: 'L', symbol: '⌰' },
    { letter: 'M', symbol: '⋔' },
    { letter: 'N', symbol: '⋏' },
    { letter: 'O', symbol: '⍜' },
    { letter: 'P', symbol: '⌿' },
    { letter: 'Q', symbol: '⍾' },
    { letter: 'R', symbol: '⍀' },
    { letter: 'S', symbol: '⌇' },
    { letter: 'T', symbol: '⏁' },
    { letter: 'U', symbol: '⎍' },
    { letter: 'V', symbol: '⎐' },
    { letter: 'W', symbol: '⍙' },
    { letter: 'X', symbol: '⌖' },
    { letter: 'Y', symbol: '⊬' },
    { letter: 'Z', symbol: '⋉' }
];

function consoleKaBaap(msg, rl) {
    process.stdout.clearLine();
	process.stdout.cursorTo(0);
	console.log(msg);
	rl.prompt(true);
}

function translateToEnglish(msg) {
    for (let i = 0; i < alphabetMapping.length; i++) {
        msg = msg.replaceAll(alphabetMapping[i].symbol, alphabetMapping[i].letter)
    }
    return msg
}

function translateToNereian(msg) {
    msg = msg.toUpperCase()
    for (let i = 0; i < alphabetMapping.length; i++) {
        msg = msg.replaceAll(alphabetMapping[i].letter, alphabetMapping[i].symbol)
    }
    return msg
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms))
}

program.name('exuncli').description("Interact with the Nereia city and its inhabitants using our command line interface.").version('1.0.0')

program
.command('talk')
.description('Interact with various species with a single command.')
    .option('--human', 'Talk to the species as a human.', '')
    .option('--nereian', 'Talk to humans as a nereian', '')
    .action((args, options) => {
        var rl = readline.createInterface(process.stdin, process.stdout)
        if (!args.nereian && !args.human) {
            console.log('Please talk either as a human or as a nereian.')
            return process.exit()
        }
        var socket = socketio.connect('https://exun-hack-cli.onrender.com');
        socket.on('connect', () => {
            consoleKaBaap('Connected to the server', rl);
            rl.on('line', async (myInput) => {
                myInput = myInput.toUpperCase()
                if (args.nereian) {
                    socket.emit('send', {type: 'nereian', message: translateToEnglish(myInput)})
                } else {  
                    socket.emit('send', {type: 'human', message: translateToNereian(myInput)})
                }
            })
        });
        
        socket.on('message', function (data) {
            var myInput = data.message
            if (args[data.type]) {
                if (args.nereian) {
                    return consoleKaBaap(color(translateToNereian('<Message sent>'), 'green'), rl)
                } else {
                    return consoleKaBaap(color('<Message sent>', 'green'), rl)
                }
            }
            if (data.type == 'human') {
                if (args.nereian) {
                    myInput = translateToNereian(myInput)
                    consoleKaBaap(`${color(translateToNereian("<Message received>"), "blue")} ${myInput}`, rl)
                } else {
                    consoleKaBaap(`${color("<Message received>", "blue")} ${myInput}`, rl)
                }
            } else {
                if (args.human) {
                    myInput = translateToEnglish(myInput)
                    consoleKaBaap(`${color("<Message received>", "blue")} ${myInput}`, rl)
                } else {                 
                    consoleKaBaap(`${color(translateToNereian("<Message received>"), 'blue')} ${myInput}`, rl)
                }
            }
        });
    })

program
    .command('map')
    .description('View live satellite images of Nereia, and interact with the city.')
    .action((args, options) => {
        var rl = readline.createInterface(process.stdin, process.stdout),
            currentPos = 0
        const mapAscii =  [
`+-----------------------------------+
|          Nereia City Map          |
+-----------------------------------+
| Sector A        | Sector B        |
| -------------   | -------------   |
|  [A1]           | [B1]            |
|  [A2]           | [B2]            |
|                 |                 |
|  *You're here*  |                 |
+-----------------------------------+
| Sector C        | Sector D        |
| -------------   | -------------   |
|  [C1]           | [D1]            |
|  [C2]           | [D2]            |
|                 |                 |
|                 |                 |
+-----------------------------------+`,
`+-----------------------------------+
|          Nereia City Map          |
+-----------------------------------+
| Sector A        | Sector B        |
| -------------   | -------------   |
|  [A1]           | [B1]            |
|  [A2]           | [B2]            |
|                 |                 |
|                 |  *You're here*  |
+-----------------------------------+
| Sector C        | Sector D        |
| -------------   | -------------   |
|  [C1]           | [D1]            |
|  [C2]           | [D2]            |
|                 |                 |
|                 |                 |
+-----------------------------------+`,
`+-----------------------------------+
|          Nereia City Map          |
+-----------------------------------+
| Sector A        | Sector B        |
| -------------   | -------------   |
|  [A1]           | [B1]            |
|  [A2]           | [B2]            |
|                 |                 |
|                 |                 |
+-----------------------------------+
| Sector C        | Sector D        |
| -------------   | -------------   |
|  [C1]           | [D1]            |
|  [C2]           | [D2]            |
|                 |                 |
|  *You're here*  |                 |
+-----------------------------------+`,
`+-----------------------------------+
|          Nereia City Map          |
+-----------------------------------+
| Sector A        | Sector B        |
| -------------   | -------------   |
|  [A1]           | [B1]            |
|  [A2]           | [B2]            |
|                 |                 |
|                 |                 |
+-----------------------------------+
| Sector C        | Sector D        |
| -------------   | -------------   |
|  [C1]           | [D1]            |
|  [C2]           | [D2]            |
|                 |                 |
|                 |  *You're here*  |
+-----------------------------------+`]
        console.clear()
        consoleKaBaap(color(mapAscii[currentPos], 'green'), rl)
        consoleKaBaap(color('(Use w, a, s, d to navigate)', 'blue'), rl)
        consoleKaBaap(color('[A1]: Nereium Mining site 1', 'red'), rl)
        consoleKaBaap(color('[A2]: Nereium Mining site 2', 'red'), rl)
        consoleKaBaap(color('<Nereium extracted today> ', 'yellow') + `${Math.floor(Math.random() * 100)}g`, rl)
        consoleKaBaap(color('<Number of miners working> ', 'yellow') + `${Math.floor(Math.random() * 100)} miners`, rl)
        rl.on('line', (data) => {
            switch (data) {
                case 'w':
                    if (currentPos == 2 || currentPos == 3) {
                        currentPos -= 2
                    }
                    break
                case 'a':
                    if (currentPos == 1 || currentPos == 3) {
                        currentPos -= 1
                    }
                    break
                case 'd':
                    if (currentPos == 0 || currentPos == 2) {
                        currentPos += 1
                    }
                    break
                case 's':
                    if (currentPos == 0 || currentPos == 1) {
                        currentPos += 2
                    }
                    break
            }
            console.clear()
            consoleKaBaap(color(mapAscii[currentPos], 'green'), rl)
            switch(currentPos) {
                case 0:
                    consoleKaBaap(color('(Use w, a, s, d to navigate)', 'blue'), rl)
                    consoleKaBaap(color('[A1]: Nereium Mining site 1', 'red'), rl)
                    consoleKaBaap(color('[A2]: Nereium Mining site 2', 'red'), rl)
                    consoleKaBaap(color('<Nereium extracted today> ', 'yellow') + `${Math.floor(Math.random() * 100)}g`, rl)
                    consoleKaBaap(color('<Number of miners working> ', 'yellow') + `${Math.floor(Math.random() * 100)} miners`, rl)
                    break
                case 1:
                    consoleKaBaap(color('(Use w, a, s, d to navigate)', 'blue'), rl)
                    consoleKaBaap(color('[B1]: Residential Sector 1', 'red'), rl)
                    consoleKaBaap(color('[B2]: Residential Sector 2', 'red'), rl)
                    consoleKaBaap(color('<Current Population> ', 'yellow') + `${Math.floor((Math.random() * 10000) + 50000)} people`, rl)
                    consoleKaBaap(color('<Number of houses> ', 'yellow') + `${Math.floor((Math.random() * 1000)) + 5000} houses`, rl)
                    break
                case 2:
                    consoleKaBaap(color('(Use w, a, s, d to navigate)', 'blue'), rl)
                    consoleKaBaap(color('[C1]: Sea Plantation 1', 'red'), rl)
                    consoleKaBaap(color('[C2]: Sea Plantation 2', 'red'), rl)
                    consoleKaBaap(color('<Today\'s produce> ', 'yellow') + `${Math.floor(Math.random() * 5000)}g`, rl)
                    consoleKaBaap(color('<Number of species being grown> ', 'yellow') + `${Math.floor((Math.random() * 50)) + 50} corals`, rl)
                    break
                case 3:
                    consoleKaBaap(color('(Use w, a, s, d to navigate)', 'blue'), rl)
                    consoleKaBaap(color('[D1]: Research Building 1', 'red'), rl)
                    consoleKaBaap(color('[D2]: Research Building 2', 'red'), rl)
                    consoleKaBaap(color('<Number of researchers> ', 'yellow') + `${Math.floor(Math.random() * 750)} people`, rl)
                    consoleKaBaap(color('<Number of buildings currently> ', 'yellow') + `129 buildings`, rl)
                    break
                        
            }
        })
    })

program.parse()