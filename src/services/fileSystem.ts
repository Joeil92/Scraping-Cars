import fs from 'fs';
import path from 'path';

export default class FileSystem {
    constructor(
        private pathFile = path.join(__dirname, "../..", `outpout/${new Date().toDateString()}.txt`)
    ) { }

    public writeFile(content: string) {
        try {
            fs.writeFileSync(this.pathFile, content);
        } catch (err) {
            console.error(err);
        }
    }

    public appendFile(content: string) {
        try {
            fs.appendFileSync(this.pathFile, content);
        } catch (error) {
            console.error(error)
        }
    }
}