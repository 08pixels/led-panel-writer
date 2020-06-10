import Jimp from 'jimp';

type Uint8 = 0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31|32|33|34|35|36|37|38|39|40|41|42|43|44|45|46|47|48|49|50|51|52|53|54|55|56|57|58|59|60|61|62|63|64|65|66|67|68|69|70|71|72|73|74|75|76|77|78|79|80|81|82|83|84|85|86|87|88|89|90|91|92|93|94|95|96|97|98|99|100|101|102|103|104|105|106|107|108|109|110|111|112|113|114|115|116|117|118|119|120|121|122|123|124|125|126|127|128|129|130|131|132|133|134|135|136|137|138|139|140|141|142|143|144|145|146|147|148|149|150|151|152|153|154|155|156|157|158|159|160|161|162|163|164|165|166|167|168|169|170|171|172|173|174|175|176|177|178|179|180|181|182|183|184|185|186|187|188|189|190|191|192|193|194|195|196|197|198|199|200|201|202|203|204|205|206|207|208|209|210|211|212|213|214|215|216|217|218|219|220|221|222|223|224|225|226|227|228|229|230|231|232|233|234|235|236|237|238|239|240|241|242|243|244|245|246|247|248|249|250|251|252|253|254|255;

class LEDPanel {
    width: number;
    height: number;
    queue: Array<string>;
    textPixelLength = 13;
    backgroundColor: [Uint8, Uint8, Uint8] = [0, 0, 0]; // Black
    backgroundBright: Uint8 = 128;
    textColor: [Uint8, Uint8, Uint8] = [255, 255, 255]; // White

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.queue = ['Started'];
    };

    printFrame(byteList: Buffer): void {
        if(byteList.length != this.width * this.height * 4) {
            throw new RangeError(`A entrada não coincide com o tamanho da imagem`);
        }

        let pixelList: Array<Array<number>> = [];
        let counter = 0;
        let tempValue: Array<number> = [];
        byteList.forEach((value) => {

            if(++counter == 4){
                counter = 0;
                pixelList.push(tempValue);
                tempValue = [];
            }
            tempValue.push(value);
        });

        pixelList.forEach(() => {
            let line = pixelList.splice(0, this.width);
            let lineToPrint = line.map(v => {
                return v.toString() == [255,255,255,255].toString() ? 'B' : '.';
            });

            console.log(lineToPrint.join(' '))
        });
    };

    createImage(width?: number, height?: number, bgColor?: [Uint8, Uint8, Uint8], bgBright?: number): Buffer {
        let w = width ? width : this.width;
        let h = height ? height : this.height;
        let bg = bgColor ? bgColor : this.backgroundColor;
        let bgB = bgBright ? bgBright : this.backgroundBright;

        // Muda todos os Alpha para 255
        return <Buffer>Buffer.alloc(w * h * 4, bg[0]) // Set Color: RED
        .map((v, i) => {
            return (i + 1) % 2 == 0 ? bg[1] : v; // Set Color: GREEN
        })
        .map((v, i) => {
            return (i + 1) % 3 == 0 ? bg[2] : v; // Set Color: BLUE
        })
        .map((v, i) => {
            return (i + 1) % 4 == 0 ? bgB : v; // Set Color: ALPHA
        });
    }

    writePixel(coords: [number, number], color: [number, number, number, number], data: Buffer){
        let dataBuffer = data

        let line = this.width * coords[1];
        let pixel = line + coords[0];
        let offset = pixel * 4;

        color.forEach((value, index) => {
            dataBuffer.writeUInt8(value, offset + index);
        });

        return dataBuffer;
    }

    playAnimation(text: string): Promise<void> {
        return new Promise(resolv => {
            let image = new Jimp(this.width, this.height);
            
            Jimp.loadFont('./RobotoMono/RobotoMono.fnt', async (err, font) => { // Font = 22
                let textPosition = this.width;
    
                if(text.length * this.textPixelLength > this.width){
                    for(textPosition; textPosition > this.width - (text.length * this.textPixelLength) - this.width; textPosition--){
                        console.log()
                        console.log()
                        image.bitmap.data = this.createImage();
                        image.print(font, textPosition, -5, text);
        
                        panel.printFrame(image.bitmap.data);
        
                        await new Promise(r => { setTimeout(r, 50) });
                    }
                } else {
                    image.bitmap.data = this.createImage();
                    image.print(font, 0, -5, text);
                    panel.printFrame(image.bitmap.data);

                    await new Promise(r => { setTimeout(r, 3000) });
                }
                resolv();
            });
        });
    }

    async playQueue(){
        while(true){
            let phase = this.queue[0];
            if(this.queue.length > 1){
                this.queue.shift();
            }
    
            await this.playAnimation(phase)
        }
    }

    add2Queue(phase: string): void {
        this.queue.push(phase);
    }
}
const panel = new LEDPanel(40, 24);

panel.playQueue();

panel.queue.push('Olá Mundo')
panel.queue.push('Hello')
panel.queue.push('AYAYA')