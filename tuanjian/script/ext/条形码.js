﻿var barcode = {
    intval: function(val) {
        var type = typeof(val);
        if (type == 'string') {
            val = val.replace(/[^0-9-.]/g, "");
            val = parseInt(val * 1, 10);
            return isNaN(val) || !isFinite(val) ? 0: val
        }
        return type == 'number' && isFinite(val) ? Math.floor(val) : 0
    },
    code128: {
        encoding: ["11011001100", "11001101100", "11001100110", "10010011000", "10010001100", "10001001100", "10011001000", "10011000100", "10001100100", "11001001000", "11001000100", "11000100100", "10110011100", "10011011100", "10011001110", "10111001100", "10011101100", "10011100110", "11001110010", "11001011100", "11001001110", "11011100100", "11001110100", "11101101110", "11101001100", "11100101100", "11100100110", "11101100100", "11100110100", "11100110010", "11011011000", "11011000110", "11000110110", "10100011000", "10001011000", "10001000110", "10110001000", "10001101000", "10001100010", "11010001000", "11000101000", "11000100010", "10110111000", "10110001110", "10001101110", "10111011000", "10111000110", "10001110110", "11101110110", "11010001110", "11000101110", "11011101000", "11011100010", "11011101110", "11101011000", "11101000110", "11100010110", "11101101000", "11101100010", "11100011010", "11101111010", "11001000010", "11110001010", "10100110000", "10100001100", "10010110000", "10010000110", "10000101100", "10000100110", "10110010000", "10110000100", "10011010000", "10011000010", "10000110100", "10000110010", "11000010010", "11001010000", "11110111010", "11000010100", "10001111010", "10100111100", "10010111100", "10010011110", "10111100100", "10011110100", "10011110010", "11110100100", "11110010100", "11110010010", "11011011110", "11011110110", "11110110110", "10101111000", "10100011110", "10001011110", "10111101000", "10111100010", "11110101000", "11110100010", "10111011110", "10111101110", "11101011110", "11110101110", "11010000100", "11010010000", "11010011100", "11000111010"],
        getDigit: function(code) {
            var tableB = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
            var result = "";
            var sum = 0;
            var isum = 0;
            var i = 0;
            var j = 0;
            var value = 0;
            for (i = 0; i < code.length; i++) {
                if (tableB.indexOf(code.charAt(i)) == -1) return ("")
            }
            var tableCActivated = code.length > 1;
            var c = '';
            for (i = 0; i < 3 && i < code.length; i++) {
                c = code.charAt(i);
                tableCActivated &= c >= '0' && c <= '9'
            }
            sum = tableCActivated ? 105: 104;
            result = this.encoding[sum];
            i = 0;
            while (i < code.length) {
                if (!tableCActivated) {
                    j = 0;
                    while ((i + j < code.length) && (code.charAt(i + j) >= '0') && (code.charAt(i + j) <= '9')) j++;
                    tableCActivated = (j > 5) || ((i + j - 1 == code.length) && (j > 3));
                    if (tableCActivated) {
                        result += this.encoding[99];
                        sum += ++isum * 99
                    }
                } else if ((i == code.length) || (code.charAt(i) < '0') || (code.charAt(i) > '9') || (code.charAt(i + 1) < '0') || (code.charAt(i + 1) > '9')) {
                    tableCActivated = false;
                    result += this.encoding[100];
                    sum += ++isum * 100
                }
                if (tableCActivated) {
                    value = barcode.intval(code.charAt(i) + code.charAt(i + 1));
                    i += 2
                } else {
                    value = tableB.indexOf(code.charAt(i));
                    i += 1
                }
                result += this.encoding[value];
                sum += ++isum * value
            }
            result += this.encoding[sum % 103];
            result += this.encoding[106];
            result += "11";
            return (result)
        }
    }
}
console.log(barcode.code128.getDigit('11'))  
