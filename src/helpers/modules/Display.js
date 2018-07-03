const rpio = require('rpio');

class Display {

    /**
     * Magic numbers to initialise the i2c display device and write output
     */
    constructor() {
        this.init = new Buffer([0x03, 0x03, 0x03, 0x02, 0x28, 0x0c, 0x01, 0x06]);
        this.LCD_LINE1 = 0x80;
        this.LCD_LINE2 = 0xc0;
        this.LCD_ENABLE = 0x04;
        this.LCD_BACKLIGHT = 0x08;

        rpio.i2cBegin();
        rpio.i2cSetSlaveAddress(0x27);
        rpio.i2cSetBaudRate(10000);

        for (let i = 0; i < this.init.length; i++) {
            this.sendChar(this.init[i], 0);
        }
    }

    /**
     * Data is written 4 bits at a time with the lower 4 bits containing the mode.
     *
     * @param data
     */
    writeBitsToDisplay(data) {
        rpio.i2cWrite(Buffer([(data | LCD_BACKLIGHT)]));
        rpio.i2cWrite(Buffer([(data | LCD_ENABLE | LCD_BACKLIGHT)]));
        rpio.i2cWrite(Buffer([((data & ~LCD_ENABLE) | LCD_BACKLIGHT)]));
    }

    /**
     * Sends characters to the display
     *
     * @param data
     * @param mode
     */
    sendChar(data, mode) {
        this.writeBitsToDisplay(mode | (data & 0xF0));
        this.writeBitsToDisplay(mode | ((data << 4) & 0xF0));
    }

    /**
     * Splits a line into chars before sending to the display
     *
     * @param str
     * @param addr
     */
    sendLine(str, addr) {
        this.sendChar(addr, 0);

        str.split('').forEach((c) => {
            this.sendChar(c.charCodeAt(0), 1);
        });
    }

    /**
     * Write to the display
     */
    write(line1 = '                ', line2 = '                ') {
        this.sendLine(line1, this.LCD_LINE1);
        this.sendLine(line2, this.LCD_LINE2);
    }

    /**
     * Clear the display
     */
    clear() {
        this.sendLine('                ', this.LCD_LINE1);
        this.sendLine('                ', this.LCD_LINE2);
    }
}

module.exports = new Display();
