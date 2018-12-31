import { EmlData } from "./emlformat";
const HTMLParser = require('node-html-parser');

const emlformat = require('eml-format')
const fs = require('fs')

export class InfoRow {
    title: string
    /** seconds */
    time: number
}

export class WeekInfo {
    /** Subject of email letter  */
    subject: string
    startDate: Date
    projects: InfoRow[]
    languages: InfoRow[]
    editors: InfoRow[]
    systems: InfoRow[]
}

export class Stats {
    weeks: WeekInfo[]
    async loadDir(dir: string) {
        this.weeks = []
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath: string = dir + '/' + file;
            if (filePath.endsWith('.eml')) {
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                const data = await this.loadFile(fileContent);
                fs.writeFileSync(filePath + '.html', data.html);
                fs.writeFileSync(filePath + '.txt', data.text);
            }
        }
    }
    private async loadFile(fileContent): Promise<EmlData> {
        const promise = new Promise<EmlData>((resolve, reject) => {
            emlformat.read(fileContent, (error, data: EmlData) => {
                if (!error) {
                    this.loadEmail(data);
                    resolve(data);
                } else {
                    console.error(error);
                    reject(error);
                }
            });
        });
        return promise;
    }
    private loadEmail(data: EmlData) {
        if (data.subject.includes('WakaTime Weekly Summary')) {
            const date = extractDateFromSubject(data.subject)
            console.log(data.subject, '->', date);
            const weekInfo = new WeekInfo();
            parseContent(data.html);
            weekInfo.subject = data.subject;
            weekInfo.startDate = date;
            this.weeks.push(weekInfo)
        }
    }
}

function parseContent(htmlString) {
    const tree = HTMLParser.parse(htmlString);
    console.log(tree.querySelector('table'));
}

function extractDateFromSubject(text: string) {
    let result = null;
    const desiredPosition = text.search(/for \d\d\d\d-\d\d-\d\d/);
    if (desiredPosition >= 0) {
        const dateTextPosition = desiredPosition + 4;
        const dateTextLength = '2010-12-25'.length;
        const dateText = text.substring(dateTextPosition, dateTextPosition + dateTextLength);
        const parts = dateText.split('-');
        if (parts.length == 3) {
            result = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]), 0, 0, 0, 0);
        }
    }
    return result;
}

